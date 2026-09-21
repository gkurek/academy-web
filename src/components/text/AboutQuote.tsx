export interface AboutQuoteProps {
  quote: string;
  author: string;
}

/** In-section quote variant for /o-akademii (mockup 6a OA-41) — not home Testimonial. */
export function AboutQuote({ quote, author }: AboutQuoteProps) {
  return (
    <blockquote className="about-quote">
      <p className="about-quote-text">{quote}</p>
      <footer className="about-quote-author">{author}</footer>
    </blockquote>
  );
}
