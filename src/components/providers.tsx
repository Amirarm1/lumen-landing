"use client"

import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"

/** Провайдеры темы и toast — клиентская обёртка для app router */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
      <Toaster
        theme="system"
        position="bottom-right"
        richColors
        closeButton
      />
    </ThemeProvider>
  )
}
