import { Reveal } from "@/components/reveal"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FAQ_ITEMS } from "@data/faq"

/** FAQ Пинок */
export function Faq() {
  return (
    <section className="section-pad" id="faq" aria-labelledby="faq-title">
      <div className="container-page">
        <Reveal className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-sm font-semibold tracking-[0.1em] text-brand-2 uppercase">
            FAQ
          </p>
          <h2
            id="faq-title"
            className="font-heading mb-3 text-3xl font-bold tracking-tight md:text-4xl"
          >
            Частые вопросы
          </h2>
        </Reveal>

        <Reveal>
          <Accordion className="mx-auto max-w-2xl gap-2.5">
            {FAQ_ITEMS.map((item) => (
              <AccordionItem
                key={item.question}
                value={item.question}
                className="rounded-2xl border border-border/80 bg-card/60 px-4 backdrop-blur-sm not-last:border-b last:border-b hover:border-brand/30 data-open:border-brand/35 data-open:bg-card/80"
              >
                <AccordionTrigger className="py-4 text-left text-base font-medium hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
