import { Button } from "@/components/core/Button";

export interface OfferCardProps {
  eyebrow: string;
  title: string;
  excerpt: string;
  bullets: readonly string[];
  href: string;
  ctaLabel: string;
  ctaVariant: "primary" | "secondary";
}

/** Hub offer card — same tile language as OfferQuoteGrid (card surface, gold top bar). */
export function OfferCard({ eyebrow, title, excerpt, bullets, href, ctaLabel, ctaVariant }: OfferCardProps) {
  return (
    <article className="offer-card bg-surface-card border-t-offer-quote-top border-accent px-offer-card-x pt-offer-card-y pb-offer-card-pb">
      <p className="font-serif text-size-body text-accent-text mb-space-3">{eyebrow}</p>
      <h2 className="font-serif text-size-role-card-title-m md:text-size-role-card-title leading-heading text-text-h2 mb-space-4">
        {title}
      </h2>
      <p className="text-size-body leading-body text-text-secondary mb-space-4">{excerpt}</p>
      <ul className="mb-space-5 list-none text-size-body leading-body text-text-secondary">
        {bullets.map((item) => (
          <li key={item} className="flex gap-space-3">
            <span aria-hidden="true" className="text-accent">
              ·
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {/* Last subgrid row (offers.css) — bottom-aligned so buttons line up across the row. */}
      <div className="self-end">
        <Button href={href} variant={ctaVariant} size="lg" compactMobile block>
          {ctaLabel}
        </Button>
      </div>
    </article>
  );
}
