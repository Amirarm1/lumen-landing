import { Reveal } from "@/components/reveal"
import { STEPS } from "@data/steps"

/** Как работает Пинок */
export function HowItWorks() {
  return (
    <section className="section-pad" id="how" aria-labelledby="how-title">
      <div className="container-page">
        <Reveal className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-sm font-semibold tracking-[0.1em] text-brand-2 uppercase">
            Как работает
          </p>
          <h2
            id="how-title"
            className="font-heading mb-3 text-3xl font-bold tracking-tight md:text-4xl"
          >
            Не план на год. Шаг на сегодня.
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Бот ведёт за руку: микро-действие → «Сделал?» → пинок каждый день в твоё время.
          </p>
        </Reveal>

        <div className="relative grid gap-4 md:grid-cols-3 md:gap-5">
          <div className="pointer-events-none absolute top-1/2 right-[8%] left-[8%] hidden h-px bg-linear-to-r from-transparent via-brand/30 to-transparent md:block" />
          {STEPS.map((step, i) => (
            <Reveal key={step.number} delay={(Math.min(i + 1, 3) as 1 | 2 | 3)}>
              <article className="relative h-full rounded-3xl border border-border/80 bg-card/70 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/35 hover:shadow-[0_20px_50px_-20px_var(--brand-glow)]">
                <div className="font-heading mb-4 bg-linear-to-br from-brand-2 to-brand-3 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
                  {step.number}
                </div>
                <h3 className="font-heading mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
