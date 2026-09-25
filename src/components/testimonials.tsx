import { Reveal } from "@/components/reveal"
import { TESTIMONIALS } from "@data/testimonials"

/** Отзывы — адаптивный grid */
export function Testimonials() {
  return (
    <section className="section-pad" id="testimonials" aria-labelledby="testimonials-title">
      <div className="container-page">
        <Reveal className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-sm font-semibold tracking-[0.08em] text-brand-2 uppercase">
            Отзывы
          </p>
          <h2
            id="testimonials-title"
            className="font-heading mb-3 text-3xl font-bold tracking-tight md:text-4xl"
          >
            Команды, которые уже в потоке
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Реальные истории от продактов, CTO и фаундеров.
          </p>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2">
          {TESTIMONIALS.map((item, i) => (
            <Reveal key={item.name} delay={(Math.min((i % 3) + 1, 3) as 1 | 2 | 3)}>
              <blockquote className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-surface-hover hover:shadow-xl">
                <p className="flex-1 text-muted-foreground before:mr-1 before:text-xl before:font-bold before:text-brand before:content-['“']">
                  {item.text}
                </p>
                <footer className="flex items-center gap-3">
                  <div
                    className="grid size-10 place-items-center rounded-full bg-linear-to-br from-brand to-brand-3 text-xs font-bold text-white"
                    aria-hidden
                  >
                    {item.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.role}</div>
                  </div>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
