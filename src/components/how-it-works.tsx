import { Reveal } from "@/components/reveal"
import { STEPS } from "@data/steps"
import { SITE } from "@data/site"

/** Как это работает — 3 шага */
export function HowItWorks() {
  return (
    <section className="section-pad" id="how" aria-labelledby="how-title">
      <div className="container-page">
        <Reveal className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-sm font-semibold tracking-[0.08em] text-brand-2 uppercase">
            Как это работает
          </p>
          <h2
            id="how-title"
            className="font-heading mb-3 text-3xl font-bold tracking-tight md:text-4xl"
          >
            Запуск за один день, не за квартал
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Три шага — и команда уже в ритме {SITE.name}.
          </p>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.number} delay={(Math.min(i + 1, 3) as 1 | 2 | 3)}>
              <article className="h-full rounded-2xl border border-border bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-surface-hover hover:shadow-xl">
                <div className="font-heading mb-4 bg-linear-to-br from-brand to-brand-3 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
                  {step.number}
                </div>
                <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
