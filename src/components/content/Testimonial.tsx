import type { ReactNode } from "react";

export interface TestimonialProps {
  quote: ReactNode;
  author: ReactNode;
}

/**
 * Home page variant — quote + signature only, no portrait/bio/link (K-14:
 * a deliberate simplification of design/components/content/Testimonial.jsx,
 * identical on mobile and desktop).
 */
export function Testimonial({ quote, author }: TestimonialProps) {
  return (
    <section className="rule-gold-t rule-gold-b px-page-margin-mobile md:px-testimonial-px py-testimonial-py md:py-space-12 flex flex-col items-center text-center gap-space-5">
      <p className="font-serif italic text-size-quote-lg leading-quote text-text-body max-w-measure-quote">
        {quote}
      </p>
      <div className="text-size-ui-m text-text-tertiary">{author}</div>
    </section>
  );
}
