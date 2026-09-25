"use client"

import { useEffect, useRef } from "react"

import { Reveal } from "@/components/reveal"
import { buttonVariants } from "@/components/ui/button-variants"
import { SITE } from "@data/site"
import { cn } from "@/lib/utils"

/** Hero: заголовок, CTA, блобы, мок-ап продукта */
export function Hero() {
  const blobRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const speeds = [0.15, 0.25, 0.1]
    let ticking = false

    const update = () => {
      const y = window.scrollY
      blobRefs.current.forEach((el, i) => {
        if (el) el.style.transform = `translate3d(0, ${y * speeds[i]}px, 0)`
      })
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update)
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <section className="relative overflow-hidden py-12 md:py-20 lg:py-24" aria-labelledby="hero-title">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgb(61_139_253/0.28),transparent_55%),radial-gradient(ellipse_50%_40%_at_90%_40%,rgb(167_139_250/0.18),transparent_50%),radial-gradient(ellipse_45%_35%_at_10%_60%,rgb(34_211_238/0.12),transparent_50%)] dark:opacity-100 opacity-70" />
        <div
          ref={(el) => {
            blobRefs.current[0] = el
          }}
          className="animate-blob absolute -left-[5%] top-[8%] size-[340px] rounded-full bg-brand opacity-55 blur-[60px]"
        />
        <div
          ref={(el) => {
            blobRefs.current[1] = el
          }}
          className="animate-blob absolute -right-[4%] top-[30%] size-[280px] rounded-full bg-brand-3 opacity-55 blur-[60px] [animation-delay:-4s]"
        />
        <div
          ref={(el) => {
            blobRefs.current[2] = el
          }}
          className="animate-blob absolute bottom-[5%] left-[35%] size-[220px] rounded-full bg-brand-2 opacity-55 blur-[60px] [animation-delay:-7s]"
        />
      </div>

      <div className="container-page relative z-10 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <Reveal>
          <p className="mb-3 text-sm font-semibold tracking-[0.08em] text-brand-2 uppercase">
            AI Workspace
          </p>
          <h1
            id="hero-title"
            className="font-heading mb-4 text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Работайте в потоке.
            <br />
            <span className="gradient-text">{SITE.name} думает с вами.</span>
          </h1>
          <p className="mb-7 max-w-lg text-lg text-muted-foreground">{SITE.description}</p>
          <div className="mb-7 flex flex-wrap gap-3">
            <a
              href="#cta"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full bg-linear-to-br from-brand to-brand-3 px-6 text-white shadow-glow hover:opacity-95"
              )}
            >
              Начать бесплатно
            </a>
            <a
              href="#how"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full px-6"
              )}
            >
              Смотреть, как работает
            </a>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
            <span>
              <strong className="text-foreground">2 400+</strong> команд
            </span>
            <span>
              <strong className="text-foreground">14 дней</strong> Pro бесплатно
            </span>
            <span>Без карты на старте</span>
          </div>
        </Reveal>

        <Reveal delay={2} className="relative">
          <div className="glass rounded-[20px] p-3 shadow-2xl transition-transform duration-500 [transform:perspective(1200px)_rotateY(-6deg)_rotateX(4deg)] hover:[transform:none] max-lg:[transform:none]">
            <div className="flex items-center gap-1.5 px-2 pb-3" aria-hidden>
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-amber-400" />
              <span className="size-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="grid min-h-[280px] gap-3 rounded-xl border border-border bg-secondary p-4">
              <div className="rounded-[10px] border border-border bg-surface p-3.5">
                <div className="mb-2.5 h-2 w-[42%] rounded bg-linear-to-r from-brand to-brand-3" />
                <div className="mb-1.5 h-1.5 rounded bg-border" />
                <div className="mb-1.5 h-1.5 w-[70%] rounded bg-border" />
                <div className="mb-2 h-1.5 w-[55%] rounded bg-border" />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {["Focus", "AI Priority", "Sprint 12"].map((pill) => (
                    <span
                      key={pill}
                      className="rounded-full border border-brand/30 bg-brand/15 px-2.5 py-1 text-[0.7rem] text-brand-2"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[10px] border border-border bg-surface p-3.5">
                  <div className="mb-2.5 h-2 w-[55%] rounded bg-linear-to-r from-brand to-brand-3" />
                  <div className="mb-1.5 h-1.5 rounded bg-border" />
                  <div className="h-1.5 w-[70%] rounded bg-border" />
                </div>
                <div className="rounded-[10px] border border-border bg-surface p-3.5">
                  <div className="mb-2.5 h-2 w-[35%] rounded bg-linear-to-r from-brand-2 to-brand" />
                  <div className="mb-1.5 h-1.5 rounded bg-border" />
                  <div className="h-1.5 w-[55%] rounded bg-border" />
                </div>
              </div>
            </div>
          </div>
          <div className="glass animate-badge-bob absolute right-2 bottom-[-0.5rem] rounded-xl px-4 py-2.5 text-sm font-semibold shadow-xl lg:right-[-0.5rem] lg:bottom-[12%]">
            ⚡ +32% скорость цикла
          </div>
        </Reveal>
      </div>
    </section>
  )
}
