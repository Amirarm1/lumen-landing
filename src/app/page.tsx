import { Cta } from "@/components/cta"
import { Faq } from "@/components/faq"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { Navbar } from "@/components/navbar"
import { Pricing } from "@/components/pricing"
import { ProblemSolution } from "@/components/problem-solution"
import { Testimonials } from "@/components/testimonials"

/** Главная страница лендинга Lumen */
export default function HomePage() {
  return (
    <div id="top">
      <Navbar />
      <main>
        <Hero />
        <ProblemSolution />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}
