"""
Пинок — Telegram-бот + Groq + ежедневные напоминания.
"""

from __future__ import annotations

import asyncio
import base64
import binascii
import json
import logging
import os
import secrets
from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path
from urllib.parse import unquote_plus
from zoneinfo import ZoneInfo

from dotenv import load_dotenv

load_dotenv()

from aiogram import Bot, Dispatcher, F
from aiogram.filters import Command, CommandObject, CommandStart
from aiogram.types import (
    CallbackQuery,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    Message,
)

from ai_groq import generate_micro_step

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("pinok")

TZ = ZoneInfo(os.getenv("PINOK_TZ", "Europe/Moscow"))
DEFAULT_HOUR = int(os.getenv("PINOK_REMIND_HOUR", "9"))
DEFAULT_MINUTE = int(os.getenv("PINOK_REMIND_MINUTE", "0"))
STATE_FILE = Path(__file__).resolve().parent / "users_state.json"

_SEEN_CALLBACKS: set[str] = set()


@dataclass
class UserState:
    goal: str = ""
    reason: str = ""
    streak_miss: int = 0
    days_done: int = 0
    day_index: int = 1
    last_step: str = ""
    waiting_reason: bool = False
    busy: bool = False
    step_token: str = ""
    # напоминания
    remind_on: bool = True
    remind_hour: int = DEFAULT_HOUR
    remind_minute: int = DEFAULT_MINUTE
    last_remind_date: str = ""  # YYYY-MM-DD уже слали сегодня


USERS: dict[int, UserState] = {}


def get_user(uid: int) -> UserState:
    if uid not in USERS:
        USERS[uid] = UserState()
    return USERS[uid]


def save_users() -> None:
    """Лёгкое сохранение на диск (чтобы после перезапуска не потерять цели)."""
    payload = {str(uid): asdict(u) for uid, u in USERS.items()}
    # не сохраняем busy
    for v in payload.values():
        v["busy"] = False
        v["waiting_reason"] = False
    try:
        STATE_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    except Exception as exc:  # noqa: BLE001
        log.warning("Не удалось сохранить state: %s", exc)


def load_users() -> None:
    if not STATE_FILE.exists():
        return
    try:
        raw = json.loads(STATE_FILE.read_text(encoding="utf-8"))
        for uid_s, data in raw.items():
            uid = int(uid_s)
            u = UserState()
            for k, v in data.items():
                if hasattr(u, k):
                    setattr(u, k, v)
            u.busy = False
            USERS[uid] = u
        log.info("Загружено пользователей: %s", len(USERS))
    except Exception as exc:  # noqa: BLE001
        log.warning("Не удалось загрузить state: %s", exc)


def new_token() -> str:
    return secrets.token_hex(3)


def checkin_kb(token: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="✅ Сделал", callback_data=f"done:{token}"),
                InlineKeyboardButton(text="❌ Не сделал", callback_data=f"skip:{token}"),
            ]
        ]
    )


def reason_kb() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="1) Нет времени", callback_data="reason:time")],
            [InlineKeyboardButton(text="2) Страшно / стыдно", callback_data="reason:fear")],
            [InlineKeyboardButton(text="3) Не знаю с чего", callback_data="reason:how")],
            [InlineKeyboardButton(text="4) Просто откладываю", callback_data="reason:delay")],
        ]
    )


def decode_start_payload(payload: str) -> str:
    raw = (payload or "").strip()
    if not raw:
        return ""
    try:
        pad = "=" * (-len(raw) % 4)
        b = raw.replace("-", "+").replace("_", "/") + pad
        return base64.b64decode(b).decode("utf-8")
    except (binascii.Error, UnicodeDecodeError, ValueError):
        return unquote_plus(raw).replace("_", " ")


async def make_step(user: UserState, *, shrink: bool = False) -> str:
    step = await asyncio.to_thread(
        generate_micro_step,
        user.goal,
        reason=user.reason,
        day=user.day_index,
        shrink=shrink,
        previous_step=user.last_step,
    )
    user.last_step = step
    save_users()
    return step


def claim_callback(callback: CallbackQuery) -> bool:
    cid = callback.id
    if cid in _SEEN_CALLBACKS:
        return False
    _SEEN_CALLBACKS.add(cid)
    if len(_SEEN_CALLBACKS) > 2000:
        _SEEN_CALLBACKS.clear()
    return True


async def strip_keyboard(callback: CallbackQuery) -> None:
    try:
        await callback.message.edit_reply_markup(reply_markup=None)
    except Exception:  # noqa: BLE001
        pass


def _esc(text: str) -> str:
    return (
        (text or "")
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def parse_hhmm(text: str) -> tuple[int, int] | None:
    text = text.strip().replace(".", ":")
    if ":" not in text:
        return None
    a, b = text.split(":", 1)
    if not a.isdigit() or not b.isdigit():
        return None
    h, m = int(a), int(b)
    if 0 <= h <= 23 and 0 <= m <= 59:
        return h, m
    return None


async def send_daily_ping(bot: Bot, uid: int, user: UserState) -> None:
    """Ежедневный пинок в выбранное время."""
    if not user.goal or not user.reason:
        return
    if user.busy:
        return

    user.busy = True
    try:
        # новый шаг дня
        user.day_index = min(user.day_index + 1, 30)
        step = await make_step(user, shrink=False)
        token = new_token()
        user.step_token = token
        await bot.send_message(
            uid,
            "⏰ <b>Ежедневный пинок</b>\n\n"
            f"Цель: <b>{_esc(user.goal)}</b>\n\n"
            f"👉 <b>{_esc(step)}</b>\n\n"
            "Сделал?",
            parse_mode="HTML",
            reply_markup=checkin_kb(token),
        )
        user.last_remind_date = datetime.now(TZ).date().isoformat()
        save_users()
        log.info("Напоминание отправлено uid=%s", uid)
    except Exception as exc:  # noqa: BLE001
        log.warning("Не удалось напомнить uid=%s: %s", uid, exc)
    finally:
        user.busy = False


async def reminder_loop(bot: Bot) -> None:
    """Каждые 20 сек проверяем, кому пора писать."""
    log.info(
        "Напоминания включены (TZ=%s, дефолт %02d:%02d)",
        TZ,
        DEFAULT_HOUR,
        DEFAULT_MINUTE,
    )
    while True:
        try:
            now = datetime.now(TZ)
            today = now.date().isoformat()
            for uid, user in list(USERS.items()):
                if not user.remind_on:
                    continue
                if not user.goal or not user.reason:
                    continue
                if user.last_remind_date == today:
                    continue
                if now.hour == user.remind_hour and now.minute == user.remind_minute:
                    await send_daily_ping(bot, uid, user)
        except Exception as exc:  # noqa: BLE001
            log.exception("reminder_loop: %s", exc)
        await asyncio.sleep(20)


dp = Dispatcher()


@dp.message(CommandStart())
async def cmd_start(message: Message, command: CommandObject) -> None:
    uid = message.from_user.id
    user = get_user(uid)
    user.streak_miss = 0
    user.busy = False
    user.step_token = ""
    payload = (command.args or "").strip()
    if payload:
        goal = decode_start_payload(payload)
        user.goal = goal or payload
        user.reason = ""
        user.waiting_reason = True
        save_users()
        await message.answer(
            f"👊 Привет, я Пинок.\n\n"
            f"Цель: <b>{_esc(user.goal)}</b>\n\n"
            "Честно: почему до сих пор нет?",
            parse_mode="HTML",
            reply_markup=reason_kb(),
        )
        return

    user.goal = ""
    user.reason = ""
    save_users()
    await message.answer(
        "👊 Привет, я <b>Пинок</b>.\n\n"
        "Напиши <b>одной фразой</b>, что откладываешь уже больше месяца.\n\n"
        f"Каждый день в <b>{DEFAULT_HOUR:02d}:{DEFAULT_MINUTE:02d}</b> (МСК) пришлю шаг. "
        "Время: /time 09:00 · выкл: /remind_off\n\n"
        "<i>Не курс. Не мотивация. Микро-шаг + «Сделал?».</i>",
        parse_mode="HTML",
    )


@dp.message(Command("status"))
async def cmd_status(message: Message) -> None:
    user = get_user(message.from_user.id)
    if not user.goal:
        await message.answer("Цели ещё нет. Напиши, что откладываешь.")
        return
    model = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")
    ai = f"Groq ({model})" if os.getenv("GROQ_API_KEY") else "шаблоны"
    rem = (
        f"вкл {user.remind_hour:02d}:{user.remind_minute:02d} МСК"
        if user.remind_on
        else "выкл"
    )
    await message.answer(
        f"Цель: <b>{_esc(user.goal)}</b>\n"
        f"День: {user.day_index}\n"
        f"Сделано: {user.days_done}\n"
        f"Пропусков подряд: {user.streak_miss}\n"
        f"Последний шаг: {_esc(user.last_step) or '—'}\n"
        f"Напоминание: {rem}\n"
        f"ИИ: {ai}",
        parse_mode="HTML",
    )


@dp.message(Command("time"))
async def cmd_time(message: Message, command: CommandObject) -> None:
    """ /time 09:00 — час ежедневного пинка (МСК) """
    user = get_user(message.from_user.id)
    arg = (command.args or "").strip()
    if not arg:
        await message.answer(
            f"Сейчас: <b>{user.remind_hour:02d}:{user.remind_minute:02d}</b> МСК "
            f"({'вкл' if user.remind_on else 'выкл'}).\n"
            "Пример: <code>/time 08:30</code>",
            parse_mode="HTML",
        )
        return
    parsed = parse_hhmm(arg)
    if not parsed:
        await message.answer("Формат: /time 09:00")
        return
    h, m = parsed
    user.remind_hour = h
    user.remind_minute = m
    user.remind_on = True
    # чтобы сегодня ещё раз можно было получить, если время в будущем
    now = datetime.now(TZ)
    if (h, m) > (now.hour, now.minute):
        user.last_remind_date = ""
    save_users()
    await message.answer(
        f"Ок. Каждый день в <b>{h:02d}:{m:02d}</b> МСК пришлю пинок.\n"
        "Выключить: /remind_off · тест сейчас: /ping",
        parse_mode="HTML",
    )


@dp.message(Command("remind_off"))
async def cmd_remind_off(message: Message) -> None:
    user = get_user(message.from_user.id)
    user.remind_on = False
    save_users()
    await message.answer("Напоминания выключены. Включить: /remind_on")


@dp.message(Command("remind_on"))
async def cmd_remind_on(message: Message) -> None:
    user = get_user(message.from_user.id)
    user.remind_on = True
    save_users()
    await message.answer(
        f"Напоминания включены: <b>{user.remind_hour:02d}:{user.remind_minute:02d}</b> МСК",
        parse_mode="HTML",
    )


@dp.message(Command("ping"))
async def cmd_ping(message: Message) -> None:
    """Ручной тест ежедневного пинка (не ждёт времени)."""
    uid = message.from_user.id
    user = get_user(uid)
    if not user.goal or not user.reason:
        await message.answer("Сначала задай цель и причину (/start).")
        return
    await message.answer("Шлю тестовый пинок…")
    user.last_remind_date = ""  # разрешить
    await send_daily_ping(message.bot, uid, user)


@dp.message(Command("stop"))
async def cmd_stop(message: Message) -> None:
    USERS.pop(message.from_user.id, None)
    save_users()
    await message.answer("Пауза и цель сброшены. Когда вернёшься — /start")


@dp.callback_query(F.data.startswith("reason:"))
async def on_reason(callback: CallbackQuery) -> None:
    if not claim_callback(callback):
        await callback.answer()
        return

    user = get_user(callback.from_user.id)
    if user.busy:
        await callback.answer("Подожди…")
        return

    user.busy = True
    await callback.answer()
    await strip_keyboard(callback)
    try:
        code = (callback.data or "").split(":", 1)[1]
        labels = {
            "time": "нет времени",
            "fear": "страшно/стыдно",
            "how": "не знаю с чего",
            "delay": "просто откладываю",
        }
        user.reason = labels.get(code, code)
        user.waiting_reason = False
        user.day_index = 1
        user.remind_on = True

        step = await make_step(user, shrink=False)
        token = new_token()
        user.step_token = token
        save_users()
        await callback.message.answer(
            f"Понял: <b>{_esc(user.reason)}</b>.\n\n"
            f"Сегодня не «стать идеальным».\n"
            f"Твоё действие:\n\n👉 <b>{_esc(step)}</b>\n\n"
            "Сделал?\n\n"
            f"⏰ Каждый день в <b>{user.remind_hour:02d}:{user.remind_minute:02d}</b> МСК "
            "придумаю новый шаг. Время: /time 09:00 · тест: /ping",
            parse_mode="HTML",
            reply_markup=checkin_kb(token),
        )
    finally:
        user.busy = False


@dp.callback_query(F.data.startswith("done:"))
async def on_done(callback: CallbackQuery) -> None:
    if not claim_callback(callback):
        await callback.answer()
        return

    user = get_user(callback.from_user.id)
    token = (callback.data or "").split(":", 1)[-1]
    if not user.step_token or token != user.step_token:
        await callback.answer("Это старый шаг — жми кнопки под последним сообщением", show_alert=True)
        await strip_keyboard(callback)
        return

    if user.busy:
        await callback.answer("Подожди…")
        return

    user.busy = True
    await callback.answer("Засчитано 👊")
    await strip_keyboard(callback)
    try:
        user.days_done += 1
        user.streak_miss = 0
        user.day_index = min(user.day_index + 1, 30)

        nxt = await make_step(user, shrink=False)
        token = new_token()
        user.step_token = token

        text = f"Красава. День <b>{user.days_done}</b> в копилку.\n\n"
        if user.days_done % 7 == 0:
            text += (
                "📊 <b>Недельный отчёт</b>\n"
                f"Цель: {_esc(user.goal)}\n"
                f"Сделано дней: {user.days_done}\n"
                "Ты сдвинулся — это факт.\n\n"
            )
        text += f"Дальше:\n\n👉 <b>{_esc(nxt)}</b>\n\nСделал?"
        await callback.message.answer(text, parse_mode="HTML", reply_markup=checkin_kb(token))
        save_users()
    finally:
        user.busy = False


@dp.callback_query(F.data.startswith("skip:"))
async def on_skip(callback: CallbackQuery) -> None:
    if not claim_callback(callback):
        await callback.answer()
        return

    user = get_user(callback.from_user.id)
    token = (callback.data or "").split(":", 1)[-1]
    if not user.step_token or token != user.step_token:
        await callback.answer("Это старый шаг — жми кнопки под последним сообщением", show_alert=True)
        await strip_keyboard(callback)
        return

    if user.busy:
        await callback.answer("Подожди…")
        return

    user.busy = True
    await callback.answer("Ок, упрощаем")
    await strip_keyboard(callback)
    try:
        user.streak_miss += 1
        hard = user.streak_miss >= 3
        step = await make_step(user, shrink=True)
        token = new_token()
        user.step_token = token

        if hard:
            text = (
                "Три раза «не сделал» подряд.\n"
                "Варианты: этот шаг / новая цель (/start) / пауза (/stop).\n\n"
                f"Минимум:\n\n👉 <b>{_esc(step)}</b>\n\nСделал?"
            )
        else:
            text = (
                "Ок. Меньше сопротивление.\n\n"
                f"👉 <b>{_esc(step)}</b>\n\nСделал?"
            )
        await callback.message.answer(text, parse_mode="HTML", reply_markup=checkin_kb(token))
        save_users()
    finally:
        user.busy = False


@dp.message(F.text)
async def on_text(message: Message) -> None:
    uid = message.from_user.id
    user = get_user(uid)
    text = (message.text or "").strip()
    if not text or text.startswith("/"):
        return

    if not user.goal or not user.reason:
        user.goal = text
        user.reason = ""
        user.waiting_reason = True
        user.streak_miss = 0
        user.step_token = ""
        save_users()
        await message.answer(
            f"Цель: <b>{_esc(user.goal)}</b>\n\nЧестно: почему до сих пор нет?",
            parse_mode="HTML",
            reply_markup=reason_kb(),
        )
        return

    await message.answer(
        "Жми ✅ / ❌ только под <b>последним</b> сообщением.\n"
        "Новая цель — /start · время — /time 09:00 · тест пинка — /ping",
        parse_mode="HTML",
    )


async def main() -> None:
    token = os.getenv("BOT_TOKEN")
    if not token or token.startswith("123456"):
        raise SystemExit("Укажи BOT_TOKEN в bot/.env")
    if not os.getenv("GROQ_API_KEY"):
        log.warning("GROQ_API_KEY не задан — будут шаблонные шаги")
    else:
        log.info(
            "Groq включён, модель %s",
            os.getenv("GROQ_MODEL", "openai/gpt-oss-20b"),
        )

    load_users()
    bot = Bot(token)
    asyncio.create_task(reminder_loop(bot))
    log.info("Пинок запущен")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
