import { Reveal } from "@/components/reveal"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FAQ_ITEMS } from "@data/faq"

/** FAQ — shadcn Accordion */
export function Faq() {
  return (
    <section className="section-pad" id="faq" aria-labelledby="faq-title">
      <div className="container-page">
        <Reveal className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-sm font-semibold tracking-[0.08em] text-brand-2 uppercase">
            FAQ
          </p>
          <h2
            id="faq-title"
            className="font-heading mb-3 text-3xl font-bold tracking-tight md:text-4xl"
          >
            Частые вопросы
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Если не нашли ответ — напишите нам из формы ниже.
          </p>
        </Reveal>

        <Reveal>
          <Accordion className="mx-auto max-w-2xl gap-2" defaultValue={[]}>
            {FAQ_ITEMS.map((item) => (
              <AccordionItem
                key={item.question}
                value={item.question}
                className="rounded-2xl border border-border bg-surface px-4 not-last:border-b hover:bg-surface-hover data-open:bg-surface-hover"
              >
                <AccordionTrigger className="py-4 text-base hover:no-underline">
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
