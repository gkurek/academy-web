import { useId } from "react";

import type { Testimonial } from "@/content/types";

import { formatAttribution } from "./formatAttribution";
import { PageHeading } from "@/components/core/PageHeading";

export interface OfferQuoteGridProps {
  heading: string;
  quotes: Testimonial[];
  columns?: 2 | 3;
}

export function OfferQuoteGrid({ heading, quotes, columns = 3 }: OfferQuoteGridProps) {
  const headingId = useId();
  const gridClass =
    columns === 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-offer-quotes-gap"
      : "grid grid-cols-1 md:grid-cols-3 gap-offer-quotes-gap";

  return (
    <section
      aria-labelledby={headingId}
      className="mt-section-gap"
    >
      <PageHeading level="section" id={headingId} className="mb-heading-gap">
        {heading}
      </PageHeading>
      <div className={gridClass}>
        {quotes.map((item, index) => (
          <blockquote
            key={`${item.author}-${index}`}
            className="bg-surface-card px-offer-quote-x py-offer-quote-y border-t-offer-quote-top border-accent"
          >
            <p className="font-serif italic text-size-quote leading-quote-offer text-text-body mb-space-4">
              {item.quote}
            </p>
            <footer className="text-size-ui text-text-tertiary">
              {formatAttribution(item.author, item.role)}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
