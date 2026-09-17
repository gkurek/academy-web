import type { Testimonial } from "@/content/types";

import { formatAttribution } from "./formatAttribution";

export interface OfferQuoteGridProps {
  heading: string;
  quotes: Testimonial[];
  columns?: 2 | 3;
}

export function OfferQuoteGrid({ heading, quotes, columns = 3 }: OfferQuoteGridProps) {
  const gridClass =
    columns === 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-offer-quotes-gap"
      : "grid grid-cols-1 md:grid-cols-3 gap-offer-quotes-gap";

  return (
    <section aria-labelledby="offer-quotes-heading" className="pb-space-9">
      <h2
        id="offer-quotes-heading"
        className="font-serif text-size-h2 leading-heading text-text-h2 mb-space-2"
      >
        {heading}
      </h2>
      <div className={gridClass}>
        {quotes.map((item) => (
          <blockquote
            key={item.author}
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
