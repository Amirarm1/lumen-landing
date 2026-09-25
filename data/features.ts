/** Фичи продукта — сетка 3×2 */
export const FEATURES = [
  {
    title: "AI-ассистент",
    description:
      "Суммирует встречи, пишет черновики и предлагает приоритеты на день.",
    icon: "spark" as const,
  },
  {
    title: "Живые доски",
    description:
      "Канбан, таймлайн и список — переключайтесь без потери контекста.",
    icon: "board" as const,
  },
  {
    title: "Синхрон команды",
    description: "Комментарии, реакции и упоминания прямо в карточке задачи.",
    icon: "users" as const,
  },
  {
    title: "Автоматизации",
    description:
      "Правила «если → то» без кода: статусы, напоминания, интеграции.",
    icon: "zap" as const,
  },
  {
    title: "Аналитика",
    description:
      "Скорость цикла, загрузка команды и узкие места — на одном дашборде.",
    icon: "chart" as const,
  },
  {
    title: "Безопасность",
    description:
      "SSO, роли, аудит-лог и шифрование данных в покое и в пути.",
    icon: "shield" as const,
  },
] as const
