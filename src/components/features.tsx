import {
  BarChart3,
  LayoutGrid,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react"

import { Reveal } from "@/components/reveal"
import { FEATURES } from "@data/features"

const ICONS = {
  spark: Sparkles,
  board: LayoutGrid,
  users: Users,
  zap: Zap,
  chart: BarChart3,
  shield: Shield,
} as const

/** Фичи — сетка 3×2 */
export function Features() {
  return (
    <section className="section-pad" id="features" aria-labelledby="features-title">
      <div className="container-page">
        <Reveal className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-sm font-semibold tracking-[0.08em] text-brand-2 uppercase">
            Возможности
          </p>
          <h2
            id="features-title"
            className="font-heading mb-3 text-3xl font-bold tracking-tight md:text-4xl"
          >
            Всё, что нужно команде в потоке
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            От AI-черновиков до аналитики спринта — без зоопарка инструментов.
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = ICONS[feature.icon]
            return (
              <Reveal key={feature.title} delay={(Math.min((i % 3) + 1, 3) as 1 | 2 | 3)}>
                <article className="group relative h-full overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-surface-hover hover:shadow-xl">
                  <div className="pointer-events-none absolute -right-8 -bottom-10 size-28 rounded-full bg-[radial-gradient(circle,var(--brand-glow),transparent_70%)] opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="mb-4 grid size-12 place-items-center rounded-2xl border border-border bg-secondary transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 group-hover:border-brand">
                    <Icon className="size-5 text-brand" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
