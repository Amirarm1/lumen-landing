import { Reveal } from "@/components/reveal"
import { buttonVariants } from "@/components/ui/button-variants"
import { PRICING_PLANS } from "@data/pricing"
import { SITE } from "@data/site"
import { cn } from "@/lib/utils"

/** Тариф 390 ₽ */
export function Pricing() {
  const bot = process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL || SITE.telegramBotUrl
  const plan = PRICING_PLANS[0]

  return (
    <section className="section-pad" id="pricing" aria-labelledby="pricing-title">
      <div className="container-page">
        <Reveal className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-sm font-semibold tracking-[0.1em] text-brand-2 uppercase">
            Тариф
          </p>
          <h2
            id="pricing-title"
            className="font-heading mb-3 text-3xl font-bold tracking-tight md:text-4xl"
          >
            Дешевле доставки. Сильнее будильника.
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Пока бот пишет — ты делаешь. Отмена в один клик.
          </p>
        </Reveal>

        <Reveal className="mx-auto max-w-md">
          <article className="relative overflow-hidden rounded-[1.75rem] border border-brand/35 bg-card/80 p-8 shadow-[0_24px_60px_-24px_var(--brand-glow)] backdrop-blur-sm">
            <div className="pointer-events-none absolute -top-20 -right-16 size-56 rounded-full bg-brand/20 blur-3xl" />
            <div className="relative">
              <span className="mb-4 inline-flex rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold tracking-wide text-brand-2 uppercase">
                Популярный
              </span>
              <h3 className="font-heading mb-1 text-xl font-bold">{plan.name}</h3>
              <p className="mb-6 text-sm text-muted-foreground">{plan.description}</p>
              <div className="font-heading mb-1 flex items-end gap-1 text-5xl font-extrabold tracking-tight">
                {plan.price}
                <span className="mb-1 text-2xl font-bold">{plan.currency}</span>
              </div>
              <p className="mb-7 text-sm text-muted-foreground">{plan.period}</p>
              <ul className="mb-8 flex flex-col gap-2.5">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex gap-2.5 text-sm text-muted-foreground before:mt-0.5 before:font-bold before:text-brand-2 before:content-['✓']"
                  >
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={bot}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "pinok-btn w-full rounded-full text-white hover:brightness-110"
                )}
              >
                {plan.cta}
              </a>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  )
}
