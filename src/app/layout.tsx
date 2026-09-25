import type { Metadata } from "next"
import { Manrope, Unbounded } from "next/font/google"

import { Providers } from "@/components/providers"
import { SITE } from "@data/site"

import "./globals.css"

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
})

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: `${SITE.name} — ты знаешь, что делать. Ты просто не начинаешь.`,
  description: SITE.description,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${manrope.variable} ${unbounded.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
