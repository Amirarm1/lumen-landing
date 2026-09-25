"use client"

import { toast } from "sonner"

import { Reveal } from "@/components/reveal"
import { Button } from "@/components/ui/button"
import { SITE } from "@data/site"

/** Финальный CTA + имитация подписки (console.log + toast) */
export function Cta() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const email = String(data.get("email") || "").trim()

    if (!email) {
      toast.error("Введите email")
      return
    }

    console.log("[Lumen subscribe]", { email, at: new Date().toISOString() })
    toast.success("Готово! Проверьте почту — ссылка уже летит ✨")
    form.reset()
  }

  return (
    <section className="section-pad" id="cta" aria-labelledby="cta-title">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-12 text-center md:px-12 md:py-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_120%,rgb(61_139_253/0.35),transparent_60%)]" />
            <div className="relative">
              <h2
                id="cta-title"
                className="font-heading mb-3 text-3xl font-extrabold tracking-tight md:text-4xl"
              >
                Готовы вернуть команде фокус?
              </h2>
              <p className="mx-auto mb-6 max-w-md text-muted-foreground">
                Оставьте email — пришлём доступ к {SITE.name} и короткий гайд по запуску за день.
              </p>

              <form
                onSubmit={onSubmit}
                className="mx-auto flex max-w-md flex-wrap justify-center gap-2.5"
                noValidate
              >
                <label htmlFor="subscribe-email" className="sr-only">
                  Email
                </label>
                <input
                  id="subscribe-email"
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  required
                  autoComplete="email"
                  className="min-w-[220px] flex-1 rounded-full border border-border bg-background px-4 py-2.5 outline-none transition focus:border-brand focus:ring-3 focus:ring-brand/30"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="rounded-full bg-linear-to-br from-brand to-brand-3 px-6 text-white shadow-glow hover:opacity-95"
                >
                  Получить доступ
                </Button>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
