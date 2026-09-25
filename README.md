# Пинок

Telegram-бот + лендинг: ежедневный микро-шаг и вопрос «Сделал?»

## Лендинг (Next.js)

```bash
npm install
# .env.local — Supabase (waitlist) + опционально:
# NEXT_PUBLIC_TELEGRAM_BOT_URL=https://t.me/YourBot
npm run dev
```

Открой http://localhost:3000

## Бот

```bash
cd bot
pip install -r requirements.txt
# bot/.env:
#   BOT_TOKEN=...
#   GROQ_API_KEY=gsk_...   # console.groq.com (VPN из РФ)
python bot.py
```

ИИ (Groq) генерирует микро-шаг под любую цель. Если ключа нет — шаблоны.

### Напоминания
По умолчанию каждый день в **09:00 МСК** (пока `python bot.py` запущен).

- `/time 08:30` — своё время  
- `/ping` — тестовый пинок сейчас  
- `/remind_off` / `/remind_on`  
- Состояние пользователей: `bot/users_state.json`

Команды для BotFather: `bot/botfather_commands.txt`
## Оплата

Пока waitlist (email → Supabase `subscribers`). ЮKassa / Telegram Payments — следующий шаг.

## Стек

- Next.js + Tailwind + shadcn
- Supabase (список email)
- aiogram 3 (бот)
