"use client"

import { useState } from "react"
import { ArrowRight, Sparkles, Zap } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { buttonVariants } from "@/components/ui/button-variants"
import { GOAL_EXAMPLES } from "@data/goals"
import { SITE } from "@data/site"
import { cn } from "@/lib/utils"

/** Deep-link: base64url для кириллицы в ?start= */
function botUrl(goal?: string) {
  const base = process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL || SITE.telegramBotUrl
  if (!goal?.trim()) return base
  const b64 = btoa(unescape(encodeURIComponent(goal.trim().slice(0, 80))))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
  const clean = base.split("?")[0]
  return `${clean}?start=${b64.slice(0, 64)}`
}

/** Hero Пинок */
export function Hero() {
  const [goal, setGoal] = useState("")

  return (
    <section
      className="relative overflow-hidden pb-10 pt-10 md:pb-16 md:pt-16 lg:pt-20"
      aria-labelledby="hero-title"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="animate-blob absolute -left-24 top-10 size-[380px] rounded-full bg-brand/25 blur-[90px]" />
        <div className="animate-blob absolute -right-16 top-32 size-[300px] rounded-full bg-brand-2/20 blur-[80px] [animation-delay:-5s]" />
        <div className="animate-blob absolute bottom-0 left-1/3 size-[240px] rounded-full bg-brand-3/15 blur-[70px] [animation-delay:-9s]" />
      </div>

      <div className="container-page relative z-10 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <Reveal>
          <p className="font-heading mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            {SITE.name}
          </p>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-3 py-1 text-xs font-semibold tracking-wide text-brand-2 uppercase">
            <Sparkles className="size-3.5" />
            Telegram · {SITE.price}
          </div>

          <h1
            id="hero-title"
            className="font-heading mb-5 text-[1.85rem] leading-[1.1] font-bold tracking-tight sm:text-4xl lg:text-[2.65rem]"
          >
            Ты знаешь, что делать.
            <br />
            <span className="gradient-text">Ты просто не начинаешь.</span>
          </h1>

          <p className="mb-8 max-w-lg text-base text-muted-foreground sm:text-lg">
            {SITE.description}
          </p>

          <form
            className="glass flex max-w-xl flex-col gap-2 rounded-[1.6rem] p-2 sm:flex-row sm:items-center"
            onSubmit={(e) => {
              e.preventDefault()
              window.open(botUrl(goal), "_blank", "noopener,noreferrer")
            }}
          >
            <label htmlFor="goal" className="sr-only">
              Что откладываешь
            </label>
            <input
              id="goal"
              name="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Что откладываешь уже больше месяца?"
              className="min-h-12 flex-1 rounded-[1.2rem] border-0 bg-transparent px-4 text-left outline-none placeholder:text-muted-foreground/70"
            />
            <button
              type="submit"
              className={cn(
                buttonVariants({ size: "lg" }),
                "pinok-btn min-h-12 shrink-0 rounded-full px-5 text-white hover:brightness-110"
              )}
            >
              Получить пинок
              <ArrowRight className="size-4" />
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {GOAL_EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setGoal(example)}
                className="rounded-full border border-border/80 bg-card/50 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-brand/40 hover:bg-brand/10 hover:text-foreground"
              >
                {example}
              </button>
            ))}
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Не курс и не мотивация — ежедневный микро-шаг и вопрос «Сделал?»
          </p>
        </Reveal>

        <Reveal delay={2} className="relative mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
          <div className="absolute -inset-4 rounded-[2rem] bg-linear-to-br from-brand/20 via-transparent to-brand-2/10 blur-2xl" />
          <div className="glass relative overflow-hidden rounded-[1.75rem] p-1 shadow-2xl shadow-black/30">
            <div className="rounded-[1.5rem] border border-border/60 bg-card/90 p-4 backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-3 border-b border-border/70 pb-3">
                <span className="animate-kick grid size-11 place-items-center rounded-2xl bg-linear-to-br from-brand-2 to-brand-3 text-white shadow-glow">
                  <Zap className="size-5" fill="currentColor" />
                </span>
                <div>
                  <div className="font-heading text-sm font-semibold">{SITE.name}</div>
                  <div className="flex items-center gap-1.5 text-xs text-success">
                    <span className="size-1.5 rounded-full bg-success" />
                    online · ждёт твою цель
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="chat-line max-w-[92%] rounded-2xl rounded-tl-md bg-secondary px-3.5 py-2.5 text-left text-sm [animation-delay:0.05s]">
                  Что откладываешь уже больше месяца?
                </div>
                <div className="chat-line ml-auto max-w-[80%] rounded-2xl rounded-tr-md bg-linear-to-br from-brand to-brand-3 px-3.5 py-2.5 text-left text-sm text-white [animation-delay:0.25s]">
                  выучить китайский
                </div>
                <div className="chat-line max-w-[95%] rounded-2xl rounded-tl-md bg-secondary px-3.5 py-2.5 text-left text-sm [animation-delay:0.5s]">
                  Ок. Сегодня не «выучить всё».
                  <br />
                  <span className="font-semibold text-brand-2">
                    👉 Напиши 5 иероглифов с произношением.
                  </span>
                  <br />
                  Сделал?
                </div>
                <div className="chat-line flex gap-2 [animation-delay:0.75s]">
                  <span className="rounded-full bg-success/15 px-3 py-1.5 text-xs font-semibold text-success">
                    ✅ Сделал
                  </span>
                  <span className="rounded-full bg-surface px-3 py-1.5 text-xs text-muted-foreground">
                    ❌ Не сделал
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground lg:text-left">
            Так выглядит первый день в боте
          </p>
        </Reveal>
      </div>
    </section>
  )
}
