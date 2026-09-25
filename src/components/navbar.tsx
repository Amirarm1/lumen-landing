"use client"

import { Menu, Sparkles, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { NAV_LINKS } from "@data/nav"
import { SITE } from "@data/site"
import { cn } from "@/lib/utils"

/** Sticky Navbar с glassmorphism */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "glass sticky top-0 z-50 border-b border-transparent transition-shadow",
        scrolled && "border-glass-border shadow-lg shadow-black/20"
      )}
    >
      <div className="container-page flex h-[72px] items-center justify-between gap-4">
        <Link
          href="#top"
          className="font-heading z-10 flex items-center gap-2.5 text-lg font-bold tracking-tight"
        >
          <span className="grid size-8 place-items-center rounded-[10px] bg-linear-to-br from-brand to-brand-3 shadow-glow">
            <Sparkles className="size-4 text-white" />
          </span>
          {SITE.name}
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Основная навигация">
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
            href="#cta"
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden rounded-full bg-linear-to-br from-brand to-brand-3 px-4 text-white shadow-glow hover:opacity-95 md:inline-flex"
            )}
          >
            Попробовать бесплатно
          </a>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
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
              className="rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-surface-hover hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#cta"
            onClick={() => setOpen(false)}
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-2 rounded-full bg-linear-to-br from-brand to-brand-3 text-white"
            )}
          >
            Попробовать бесплатно
          </a>
        </nav>
      )}
    </header>
  )
}
