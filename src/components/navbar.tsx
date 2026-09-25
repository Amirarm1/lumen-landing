"use client"

import { Menu, X, Zap } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { NAV_LINKS } from "@data/nav"
import { SITE } from "@data/site"
import { cn } from "@/lib/utils"

function botUrl() {
  return process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL || SITE.telegramBotUrl
}

/** Sticky Navbar Пинок */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-transparent transition-all duration-300",
        scrolled && "glass border-glass-border shadow-lg shadow-black/10"
      )}
    >
      <div className="container-page flex h-[68px] items-center justify-between gap-4 md:h-[76px]">
        <Link
          href="#top"
          className="font-heading z-10 flex items-center gap-2.5 text-lg font-bold tracking-tight"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-linear-to-br from-brand-2 to-brand-3 shadow-glow">
            <Zap className="size-4 text-white" fill="currentColor" />
          </span>
          {SITE.name}
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Навигация">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="z-10 flex items-center gap-2">
          <ThemeToggle />
          <a
            href={botUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "sm" }),
              "pinok-btn hidden rounded-full px-4 text-white hover:brightness-110 md:inline-flex"
            )}
          >
            Открыть бота
          </a>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-xl md:hidden"
            aria-label={open ? "Закрыть" : "Меню"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="glass container-page flex flex-col gap-1 border-t border-glass-border py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-3 text-sm text-muted-foreground hover:bg-surface-hover hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href={botUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className={cn(
              buttonVariants({ size: "lg" }),
              "pinok-btn mt-2 rounded-full text-white"
            )}
          >
            Открыть бота
          </a>
        </nav>
      )}
    </header>
  )
}
