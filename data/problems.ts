/** Карточки «Проблема → Решение» */
export const PROBLEM_CARDS = [
  {
    problem: "Хаос в задачах",
    problemDesc: "Дедлайны теряются в чатах, таблицах и почте.",
    solution: "Единый поток",
    solutionDesc:
      "Lumen собирает задачи, контекст и приоритеты в одном месте.",
    icon: "chaos" as const,
  },
  {
    problem: "Медленные ответы",
    problemDesc: "Команда ждёт, пока кто-то найдёт нужный документ.",
    solution: "AI-подсказки",
    solutionDesc:
      "Ассистент мгновенно находит знания и предлагает следующий шаг.",
    icon: "speed" as const,
  },
  {
    problem: "Потеря фокуса",
    problemDesc: "Уведомления рвут внимание и убивают глубокую работу.",
    solution: "Умный фокус",
    solutionDesc: "Режим Focus отсекает шум и оставляет только важное.",
    icon: "focus" as const,
  },
] as const
