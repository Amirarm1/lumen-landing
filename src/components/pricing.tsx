import { Reveal } from "@/components/reveal"
import { buttonVariants } from "@/components/ui/button-variants"
import { PRICING_PLANS } from "@data/pricing"
import { cn } from "@/lib/utils"

/** Тарифы — 3 плана, средний выделен */
export function Pricing() {
  return (
    <section className="section-pad" id="pricing" aria-labelledby="pricing-title">
      <div className="container-page">
        <Reveal className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-sm font-semibold tracking-[0.08em] text-brand-2 uppercase">
            Тарифы
          </p>
          <h2
            id="pricing-title"
            className="font-heading mb-3 text-3xl font-bold tracking-tight md:text-4xl"
          >
            Прозрачные цены без сюрпризов
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Начните бесплатно. Масштабируйтесь, когда команда готова.
          </p>
        </Reveal>

        <div className="grid items-stretch gap-5 lg:grid-cols-3">
          {PRICING_PLANS.map((plan, i) => (
            <Reveal key={plan.id} delay={(Math.min(i + 1, 3) as 1 | 2 | 3)}>
              <article
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border border-border bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                  plan.highlighted &&
                    "z-10 border-brand/55 bg-linear-to-b from-brand/12 to-surface shadow-glow lg:scale-105 lg:hover:-translate-y-1 lg:hover:scale-105"
                )}
              >
                {plan.highlighted && (
                  <span className="absolute top-[-0.65rem] left-1/2 -translate-x-1/2 rounded-full bg-linear-to-br from-brand to-brand-3 px-3 py-1 text-[0.72rem] font-bold tracking-wide text-white uppercase">
                    Популярный
                  </span>
                )}

                <h3 className="mb-1 text-xl font-bold">{plan.name}</h3>
                <p className="mb-5 text-sm text-muted-foreground">{plan.description}</p>

                <div className="font-heading mb-1 text-4xl font-extrabold tracking-tight">
                  {plan.price === "Custom" ? "Custom" : `$${plan.price}`}
                </div>
                <p className="mb-6 text-sm text-muted-foreground">{plan.period}</p>

                <ul className="mb-7 flex flex-1 flex-col gap-2.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-2 text-sm text-muted-foreground before:font-bold before:text-success before:content-['✓']"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="#cta"
                  className={cn(
                    buttonVariants({
                      variant: plan.highlighted ? "default" : "outline",
                      size: "lg",
                    }),
                    "w-full rounded-full",
                    plan.highlighted &&
                      "bg-linear-to-br from-brand to-brand-3 text-white shadow-glow hover:opacity-95"
                  )}
                >
                  {plan.cta}
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
