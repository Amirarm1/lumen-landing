import { Ban, Brain, Ghost } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { PAIN_POINTS } from "@data/pain"

const ICONS = [Ghost, Brain, Ban]

/** Блок боли */
export function Pain() {
  return (
    <section className="section-pad" id="pain" aria-labelledby="pain-title">
      <div className="container-page">
        <Reveal className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-sm font-semibold tracking-[0.1em] text-brand-2 uppercase">
            Знакомо?
          </p>
          <h2
            id="pain-title"
            className="font-heading mb-3 text-3xl font-bold tracking-tight md:text-4xl"
          >
            Разрыв между «знаю» и «делаю»
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Информации полно. Движения — ноль. Ты не ленивый. Ты застрял.
          </p>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          {PAIN_POINTS.map((item, i) => {
            const Icon = ICONS[i] ?? Ghost
            return (
              <Reveal key={item.title} delay={(Math.min(i + 1, 3) as 1 | 2 | 3)}>
                <article className="group h-full rounded-3xl border border-border/80 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/35 hover:shadow-[0_20px_50px_-20px_var(--brand-glow)]">
                  <div className="mb-4 grid size-11 place-items-center rounded-2xl border border-border bg-secondary transition group-hover:border-brand/40 group-hover:bg-brand/10">
                    <Icon className="size-5 text-brand-2" />
                  </div>
                  <h3 className="font-heading mb-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
