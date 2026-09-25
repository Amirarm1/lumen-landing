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
- Данные в `/data/*.ts` без БД
- Форма подписки: `console.log` + toast, без бэкенда
