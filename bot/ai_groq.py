"""
Генерация микро-шагов через Groq.
Если ключа нет или API упал — понятные fallback-шаблоны (не «жест к цели»).
"""

from __future__ import annotations

import json
import logging
import os
import re
from typing import Any

from groq import Groq

log = logging.getLogger("pinok.groq")

# gpt-oss доступен на free/developer; llama часто enterprise-only
DEFAULT_MODEL = "openai/gpt-oss-20b"

SYSTEM = """Ты — Пинок: короткий коуч без воды.
Верни ТОЛЬКО одно конкретное действие на русском.
Формат: одна строка, начинается с глагола (Открой/Напиши/Поставь/Выучи/Скачай…).
1–5 минут (если просят упростить — 30–90 секунд).
Запрещено: списки, markdown, цитаты, «просто начни», абстракции вроде «сделай жест/символ/маленькое действие».
Пример хорошего ответа: Напиши в заметку 5 испанских слов про еду с переводом.
"""


def _fallback(goal: str, shrink: bool, day: int) -> str:
    g = goal.lower()
    day = max(1, min(int(day or 1), 7))

    # языки
    if any(w in g for w in ("испан", "spanish", "англий", "англ", "немец", "франц", "язык")):
        lang = "испанск" if "испан" in g or "spanish" in g else "иностранн"
        if "англ" in g:
            lang = "английск"
        if shrink:
            return f"Открой заметки и напиши одно {lang}ое слово с переводом."
        steps = [
            f"Открой заметку «{goal}» и напиши 5 слов с переводом.",
            f"Повтори вслух вчерашние 5 слов (2 минуты).",
            f"Добавь ещё 5 новых слов по теме «дом».",
            f"Составь 3 коротких фразы из своих слов.",
            f"Пройди 1 мини-урок в приложении (Duolingo и т.п.) или 5 минут карточек.",
            f"Напиши 5 предложений о себе на языке цели.",
            f"Повтори все слова недели вслух 3 минуты.",
        ]
        return steps[day - 1]

    if any(w in g for w in ("код", "программ", "python", "разработ", "javascript", "js")):
        if shrink:
            return "Открой редактор и создай пустой файл hello.py (или .js)."
        steps = [
            "Установи/открой редактор и создай файл practice.py.",
            "Напиши print(\"hello\") и запусти файл.",
            "Напиши функцию, которая складывает 2 числа, и вызови её.",
            "Сделай цикл for, который печатает числа 1…5.",
            "Напиши список из 3 дел и выведи его.",
            "Разбери 1 ошибку: специально сломай код и почини.",
            "Напиши мини-скрипт на 10–15 строк по своей теме.",
        ]
        return steps[day - 1]

    if "бег" in g or "спорт" in g:
        if shrink:
            return "Надень кроссовки на 60 секунд. Без улицы."
        steps = [
            "Поставь кроссовки у двери на видное место.",
            "5 минут быстрой ходьбы у дома.",
            "8–10 минут ходьбы или лёгкой трусцы.",
            "Повтори вчерашнее движение в то же время.",
            "12 минут движения без телефона в руке.",
            "Лёгкий день: 6 минут ходьбы или 2×10 приседаний.",
            "10 минут — как можешь, главное выйти.",
        ]
        return steps[day - 1]

    if "резюме" in g:
        if shrink:
            return "Открой файл резюме на 1 минуту. Ничего не правь."
        steps = [
            "Создай или открой документ с названием «Резюме».",
            "Напиши 3 строки про последний опыт.",
            "Добавь список из 5 навыков.",
            "Поправь контакты и заголовок.",
            "Сохрани PDF-черновик.",
            "Перешли PDF себе в избранное Telegram.",
            "Найди и сохрани 1 вакансию.",
        ]
        return steps[day - 1]

    if "блог" in g:
        if shrink:
            return "Открой пустую заметку и напиши слово «Блог»."
        steps = [
            "Открой заметку и напиши рабочий заголовок блога (5 слов).",
            "Напиши 5 тем постов списком.",
            "Выбери одну тему и набросай 3 абзаца черновика.",
            "Придумай ник или название канала.",
            "Сохрани черновик себе в Telegram как «пост 0».",
            "Напиши один короткий пост на 500 знаков.",
            "Выложи или запланируй публикацию.",
        ]
        return steps[day - 1]

    if shrink:
        return f"Открой заметку «{goal}» и напиши одну строку: что сделаешь завтра."
    return f"Открой таймер на 5 минут и сделай первый видимый кусок по цели «{goal}» (файл/заметка/вещь)."


def _clean(text: str) -> str:
    text = (text or "").strip().strip('"').strip("'")
    # убрать reasoning-обёртки, если модель их протащила в content
    text = re.sub(r"<think>[\s\S]*?</think>", "", text, flags=re.I)
    text = re.sub(r"[*_`#]+", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) > 220:
        text = text[:217].rsplit(" ", 1)[0] + "…"
    return text


def _is_bad_step(text: str) -> bool:
    t = (text or "").lower()
    if len(t) < 10:
        return True
    bad_bits = (
        "жест к",
        "символ движения",
        "маленькое действие по цели",
        "просто начни",
        "просто начните",
    )
    return any(b in t for b in bad_bits)


def _extract_message_text(message: Any) -> str:
    """Достаём текст из разных форматов ответа (в т.ч. gpt-oss)."""
    if message is None:
        return ""

    content = getattr(message, "content", None)
    if isinstance(content, str) and content.strip():
        return content
    if isinstance(content, list):
        parts: list[str] = []
        for p in content:
            if isinstance(p, str):
                parts.append(p)
            elif isinstance(p, dict):
                parts.append(str(p.get("text") or p.get("content") or ""))
            else:
                parts.append(str(getattr(p, "text", "") or getattr(p, "content", "") or ""))
        joined = "\n".join(x for x in parts if x).strip()
        if joined:
            return joined

    for attr in ("reasoning", "reasoning_content", "refusal"):
        val = getattr(message, attr, None)
        if isinstance(val, str) and val.strip() and attr != "refusal":
            # reasoning иногда содержит финальную строку в конце
            cleaned = _clean(val)
            # берём последнюю непустую строку reasoning как кандидат
            lines = [ln.strip() for ln in val.splitlines() if ln.strip()]
            if lines:
                return lines[-1]

    # model_dump на всякий случай
    try:
        dumped = message.model_dump()  # type: ignore[attr-defined]
        log.info("Groq raw message keys=%s", list(dumped.keys()))
        c = dumped.get("content")
        if isinstance(c, str) and c.strip():
            return c
        # иногда финальный ответ лежит глубже
        return json.dumps(dumped, ensure_ascii=False)[:500]
    except Exception:  # noqa: BLE001
        return ""


def generate_micro_step(
    goal: str,
    *,
    reason: str = "",
    day: int = 1,
    shrink: bool = False,
    previous_step: str = "",
) -> str:
    """Синхронный вызов Groq. Безопасно вызывать через asyncio.to_thread."""
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    if not api_key:
        log.warning("GROQ_API_KEY нет — fallback")
        return _fallback(goal, shrink, day)

    if shrink:
        user_prompt = (
            f"Цель: {goal}\n"
            f"Стопор: {reason or 'неизвестно'}\n"
            f"Прошлый шаг (слишком тяжёлый): {previous_step or '—'}\n"
            "Дай ОДИН ещё более лёгкий шаг на 30–90 секунд. Конкретный глагол. Без абстракций."
        )
    else:
        user_prompt = (
            f"Цель: {goal}\n"
            f"Стопор: {reason or 'неизвестно'}\n"
            f"День: {day}\n"
            "Дай ОДИН микро-шаг на 1–5 минут. Конкретный и проверяемый."
        )

    model = os.getenv("GROQ_MODEL", DEFAULT_MODEL).strip() or DEFAULT_MODEL

    for attempt in range(2):
        try:
            client = Groq(api_key=api_key)
            log.info("Groq request model=%s attempt=%s", model, attempt + 1)

            kwargs: dict[str, Any] = {
                "model": model,
                "messages": [
                    {"role": "system", "content": SYSTEM},
                    {"role": "user", "content": user_prompt},
                ],
                "temperature": 0.6,
                # reasoning-модели съедают токены на «мысли» — нужен запас
                "max_tokens": 800,
            }
            # если модель поддерживает — приглушаем reasoning
            if "gpt-oss" in model:
                kwargs["reasoning_effort"] = "low"

            completion = client.chat.completions.create(**kwargs)
            msg = completion.choices[0].message
            raw = _extract_message_text(msg)
            cleaned = _clean(raw)
            log.info("Groq cleaned=%r", cleaned[:180])

            if _is_bad_step(cleaned):
                log.warning("Groq bad/empty step, retry or fallback")
                if attempt == 0:
                    user_prompt += "\nОтветь одной строкой без пояснений."
                    continue
                return _fallback(goal, shrink, day)
            return cleaned
        except TypeError:
            # reasoning_effort не поддерживается этой версией SDK — без него
            try:
                client = Groq(api_key=api_key)
                completion = client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": SYSTEM},
                        {"role": "user", "content": user_prompt},
                    ],
                    temperature=0.6,
                    max_tokens=800,
                )
                cleaned = _clean(_extract_message_text(completion.choices[0].message))
                log.info("Groq cleaned(no effort)=%r", cleaned[:180])
                if _is_bad_step(cleaned):
                    return _fallback(goal, shrink, day)
                return cleaned
            except Exception as exc:  # noqa: BLE001
                log.exception("Groq error: %s", exc)
                return _fallback(goal, shrink, day)
        except Exception as exc:  # noqa: BLE001
            log.exception("Groq error: %s", exc)
            return _fallback(goal, shrink, day)

    return _fallback(goal, shrink, day)
