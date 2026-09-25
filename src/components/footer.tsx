import { SITE } from "@data/site"

/** Футер Пинок */
export function Footer() {
  const year = new Date().getFullYear()
  const bot = process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL || SITE.telegramBotUrl

  return (
    <footer className="mt-4 border-t border-border/70 pt-12 pb-8">
      <div className="container-page">
        <div className="mb-10 grid gap-8 md:grid-cols-3">
          <div>
            <div className="font-heading mb-2 text-lg font-bold">{SITE.name}</div>
            <p className="mb-4 max-w-[280px] text-sm leading-relaxed text-muted-foreground">
              {SITE.tagline}
            </p>
            <a
              href={bot}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-brand-2 hover:underline"
            >
              Открыть бота →
            </a>
          </div>
          <div>
            <h3 className="font-heading mb-3.5 text-sm font-semibold">Продукт</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="#how" className="hover:text-brand-2">
                Как работает
              </a>
              <a href="#pricing" className="hover:text-brand-2">
                Тариф
              </a>
              <a href="#faq" className="hover:text-brand-2">
                FAQ
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-heading mb-3.5 text-sm font-semibold">Важно</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Не терапия и не медпомощь. Ты сам выбираешь цель — бот помогает не забыть действовать.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-border/70 pt-6 text-sm text-muted-foreground">
          <span>
            © {year} {SITE.name}
          </span>
          <span>Telegram-бот · {SITE.price}</span>
        </div>
      </div>
    </footer>
  )
}
