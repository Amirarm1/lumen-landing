import Link from "next/link"

import { SITE } from "@data/site"

/** Футер с ссылками и соцсетями */
export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-8 border-t border-border pt-14 pb-8">
      <div className="container-page">
        <div className="mb-10 grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="font-heading mb-2.5 text-lg font-bold">{SITE.name}</div>
            <p className="mb-4 max-w-[240px] text-sm text-muted-foreground">
              AI-рабочее пространство для команд, которые ценят поток и ясность.
            </p>
            <div className="flex gap-2">
              <SocialLink href="https://x.com" label="X / Twitter">
                <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.849L1.5 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                </svg>
              </SocialLink>
              <SocialLink href="https://github.com" label="GitHub">
                <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.09.682-.22.682-.48 0-.24-.009-.87-.014-1.71-2.782.6-3.369-1.34-3.369-1.34-.454-1.16-1.11-1.47-1.11-1.47-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.53 2.341 1.09 2.91.83.092-.647.35-1.09.636-1.34-2.22-.25-4.555-1.11-4.555-4.94 0-1.09.39-1.98 1.029-2.68-.103-.25-.446-1.27.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.59 1.028 2.68 0 3.84-2.339 4.68-4.566 4.93.359.31.678.92.678 1.855 0 1.34-.012 2.42-.012 2.75 0 .26.18.58.688.48A10.013 10.013 0 0022 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </SocialLink>
              <SocialLink href="https://linkedin.com" label="LinkedIn">
                <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </SocialLink>
            </div>
          </div>

          <FooterCol title="Продукт">
            <a href="#features">Возможности</a>
            <a href="#pricing">Тарифы</a>
            <a href="#how">Как работает</a>
            <a href="#faq">FAQ</a>
          </FooterCol>

          <FooterCol title="Компания">
            <a href="#testimonials">Отзывы</a>
            <a href="#cta">Контакты</a>
            <Link href="#top">О нас</Link>
          </FooterCol>

          <FooterCol title="Правовое">
            <a href="#faq">Конфиденциальность</a>
            <a href="#faq">Условия</a>
          </FooterCol>
        </div>

        <div className="flex flex-wrap justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground">
          <span>
            © {year} {SITE.name}. Все права защищены.
          </span>
          <span>Next.js · Tailwind · shadcn</span>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h3 className="mb-3.5 text-sm font-semibold">{title}</h3>
      <div className="flex flex-col gap-2 text-sm text-muted-foreground [&_a]:transition-colors [&_a]:hover:text-brand-2">
        {children}
      </div>
    </div>
  )
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition hover:-translate-y-0.5 hover:border-brand hover:bg-surface-hover"
    >
      {children}
    </a>
  )
}
