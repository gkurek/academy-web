import { Button } from "@/components/core/Button";
import { pl } from "@/i18n/pl";

export interface NewsCtaProps {
  href: string;
  label: string;
}

/** Inline CTA block (WP-14) — used from news MDX via mdx-components. */
export function NewsCta({ href, label }: NewsCtaProps) {
  return (
    <aside className="news-cta rule-gold-t">
      <Button href={href} variant="primary" size="lg" block>
        {label}
      </Button>
      <p className="news-cta-contact">{pl.news.ctaContact}</p>
    </aside>
  );
}
