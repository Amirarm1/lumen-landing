"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"

import { subscribeEmail } from "@/app/actions/subscribe"
import { Reveal } from "@/components/reveal"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { SITE } from "@data/site"
import { cn } from "@/lib/utils"

function botUrl() {
  return process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL || SITE.telegramBotUrl
}

/** CTA: бот + waitlist */
export function Cta() {
  const [pending, startTransition] = useTransition()
  const [email, setEmail] = useState("")

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await subscribeEmail(null, formData)
      if (result.ok) {
        toast.success(result.message)
        setEmail("")
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <section className="section-pad" id="cta" aria-labelledby="cta-title">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-brand/25 bg-card/80 px-6 py-14 text-center shadow-[0_30px_80px_-40px_var(--brand-glow)] backdrop-blur-md md:px-14 md:py-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_120%,color-mix(in_srgb,var(--brand)_40%,transparent),transparent_60%)]" />
            <div className="pointer-events-none absolute -top-10 left-1/2 size-64 -translate-x-1/2 rounded-full bg-brand-2/20 blur-3xl" />
            <div className="relative">
              <h2
                id="cta-title"
                className="font-heading mb-3 text-3xl font-extrabold tracking-tight md:text-5xl"
              >
                Хватит «завтра начну»
              </h2>
              <p className="mx-auto mb-8 max-w-md text-muted-foreground">
                Открой бота сейчас — или оставь email, напишем про пилот и оплату.
              </p>

              <a
                href={botUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "pinok-btn mb-8 inline-flex rounded-full px-8 text-white hover:brightness-110"
                )}
              >
                Открыть {SITE.name} в Telegram
              </a>

              <form
                onSubmit={onSubmit}
                className="glass mx-auto flex h-12 max-w-md items-center gap-1.5 rounded-full p-1.5"
                noValidate
              >
                <label htmlFor="waitlist-email" className="sr-only">
                  Email
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email для пилота"
                  required
                  autoComplete="email"
                  disabled={pending}
                  className="h-full min-w-0 flex-1 rounded-full border-0 bg-transparent px-4 text-sm outline-none disabled:opacity-60"
                />
                <Button
                  type="submit"
                  disabled={pending}
                  className="h-full shrink-0 rounded-full bg-foreground px-5 text-background hover:opacity-90"
                >
                  {pending ? "…" : "В список"}
                </Button>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
