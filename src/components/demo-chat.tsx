"use client"

import { useEffect, useState } from "react"

import { Reveal } from "@/components/reveal"

const LINES = [
  { who: "bot" as const, text: "Что откладываешь уже больше месяца?" },
  { who: "user" as const, text: "начать бегать" },
  { who: "bot" as const, text: "Почему? Выбери: время / стыдно / не знаю с чего / откладываю" },
  { who: "user" as const, text: "просто откладываю" },
  {
    who: "bot" as const,
    text: "Сегодня не марафон. 2 минуты: поставь кроссовки у двери. Сделал?",
  },
]

/** Живой пример диалога */
export function DemoChat() {
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    if (visible >= LINES.length) return
    const t = setTimeout(() => setVisible((v) => v + 1), 550)
    return () => clearTimeout(t)
  }, [visible])

  return (
    <section className="section-pad pt-2 md:pt-4" aria-labelledby="demo-title">
      <div className="container-page">
        <Reveal className="mb-8 text-center md:mb-10">
          <p className="mb-3 text-sm font-semibold tracking-[0.1em] text-brand-2 uppercase">
            Как это выглядит
          </p>
          <h2 id="demo-title" className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            Первый диалог — без воды
          </h2>
        </Reveal>

        <Reveal delay={1} className="mx-auto max-w-md">
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-linear-to-b from-brand/15 to-transparent blur-xl" />
            <div className="glass relative overflow-hidden rounded-[1.75rem] p-1.5 shadow-2xl">
              <div className="rounded-[1.4rem] bg-card/95 p-4">
                <div className="mb-4 flex items-center gap-3 border-b border-border/70 pb-3">
                  <span className="grid size-10 place-items-center rounded-2xl bg-linear-to-br from-brand-2 to-brand-3 text-sm font-bold text-white">
                    П
                  </span>
                  <div>
                    <div className="font-heading text-sm font-semibold">Пинок</div>
                    <div className="text-xs text-success">печатает шаг…</div>
                  </div>
                </div>

                <div className="flex min-h-[220px] flex-col gap-2.5">
                  {LINES.slice(0, visible).map((line, i) => (
                    <div
                      key={i}
                      className={
                        line.who === "bot"
                          ? "chat-line max-w-[92%] rounded-2xl rounded-tl-md bg-secondary px-3.5 py-2.5 text-left text-sm"
                          : "chat-line ml-auto max-w-[82%] rounded-2xl rounded-tr-md bg-linear-to-br from-brand to-brand-3 px-3.5 py-2.5 text-left text-sm text-white"
                      }
                      style={{ animationDelay: "0ms" }}
                    >
                      {line.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
