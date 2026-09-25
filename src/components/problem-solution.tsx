import { Focus, ListTodo, Zap } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { PROBLEM_CARDS } from "@data/problems"
import { SITE } from "@data/site"

const ICONS = {
  chaos: ListTodo,
  speed: Zap,
  focus: Focus,
} as const

/** Секция «Проблема → Решение» */
export function ProblemSolution() {
  return (
    <section className="section-pad" id="problems" aria-labelledby="problems-title">
      <div className="container-page">
        <Reveal className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-sm font-semibold tracking-[0.08em] text-brand-2 uppercase">
            Проблема → Решение
          </p>
          <h2
            id="problems-title"
            className="font-heading mb-3 text-3xl font-bold tracking-tight md:text-4xl"
          >
            Знакомый хаос. Новый порядок.
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            {SITE.name} закрывает три боли, из‑за которых команды теряют дни каждую неделю.
          </p>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {PROBLEM_CARDS.map((card, i) => {
            const Icon = ICONS[card.icon]
            return (
              <Reveal key={card.problem} delay={(Math.min(i + 1, 3) as 1 | 2 | 3)}>
                <article className="group h-full rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-border/80 hover:bg-surface-hover hover:shadow-xl">
                  <div className="mb-4 grid size-11 place-items-center rounded-xl border border-border bg-linear-to-br from-brand/30 to-brand-3/25">
                    <Icon className="size-5 text-brand-2" />
                  </div>
                  <p className="mb-1 text-xs font-semibold tracking-wider text-destructive uppercase">
                    Проблема
                  </p>
                  <h3 className="mb-1 text-lg font-bold">{card.problem}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">{card.problemDesc}</p>
                  <div className="mb-4 h-px bg-border" />
                  <p className="mb-1 text-xs font-semibold tracking-wider text-success uppercase">
                    Решение
                  </p>
                  <h3 className="mb-1 text-lg font-bold">{card.solution}</h3>
                  <p className="text-sm text-muted-foreground">{card.solutionDesc}</p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
