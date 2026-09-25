# Lumen — лендинг на Next.js

Современный SaaS-лендинг **Lumen** на стеке:

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS 4**
- **shadcn/ui** (Accordion, Button)
- **next-themes** + **sonner** (тема и toast)

## Запуск

```bash
npm install
npm run dev
```

Откройте http://localhost:3000

## Структура

```
data/                     # контент (отзывы, тарифы, FAQ…)
src/
  app/                    # layout + page
  components/             # секции лендинга + ui/
  lib/utils.ts
```

## Особенности

- Тёмная тема по умолчанию + светлая
- Данные лендинга в `/data/*.ts`
- Форма подписки пишет email в **Supabase** (`subscribers`)

## Supabase

1. Скопируй `.env.example` → `.env.local` и подставь ключи из Project Settings → API.
2. **Project URL** без `/rest/v1/` — только `https://xxxx.supabase.co`.
3. Таблица: `subscribers` (`id`, `email`, `created_at`).
4. Для продакшена добавь те же переменные в Vercel → Environment Variables и сделай Redeploy.
