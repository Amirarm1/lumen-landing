import { Cta } from "@/components/cta"
import { DemoChat } from "@/components/demo-chat"
import { Faq } from "@/components/faq"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { Navbar } from "@/components/navbar"
import { Pain } from "@/components/pain"
import { Pricing } from "@/components/pricing"

/** Лендинг продукта «Пинок» */
export default function HomePage() {
  return (
    <div id="top">
      <Navbar />
      <main>
        <Hero />
        <DemoChat />
        <Pain />
        <HowItWorks />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}
