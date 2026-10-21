import { PageHeading } from "@/components/core/PageHeading";
import { pl } from "@/i18n/pl";

export interface WorkshopsFaqProps {
  items: { question: string; answer: string }[];
}

/** „Zanim zaczniesz” on /warsztaty — always expanded (no accordion), so every answer is on the page. */
export function WorkshopsFaq({ items }: WorkshopsFaqProps) {
  return (
    <section aria-labelledby="workshops-faq-heading">
      <PageHeading level="section" id="workshops-faq-heading" className="mb-heading-gap">
        {pl.workshopsHub.faqHeading}
      </PageHeading>
      {/* Short gold accent bar; the gap below it matches the gap between the pairs. */}
      <div aria-hidden="true" className="h-0.5 w-space-8 bg-accent mb-space-7" />
      {/* Desktop: two balanced columns (reading order = DOM order), so an odd count leaves no empty grid cell. */}
      <div className="lg:columns-2 lg:gap-x-space-10">
        {items.map((item) => (
          <div key={item.question} className="workshops-faq-item">
            <h3 className="workshops-faq-question">{item.question}</h3>
            <p className="body-copy text-text-secondary text-pretty">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
