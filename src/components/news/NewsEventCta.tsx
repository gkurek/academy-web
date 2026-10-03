import { Button } from "@/components/core/Button";
import type { NewsKind } from "@/content/types";
import { getNewsEventCta } from "@/content/news";

export interface NewsEventCtaProps {
  kind: NewsKind;
}

export function NewsEventCta({ kind }: NewsEventCtaProps) {
  const cta = getNewsEventCta(kind);
  if (!cta) {
    return null;
  }

  return (
    <div className="news-article-event-cta">
      <Button href={cta.href} variant="primary" size="lg" block>
        {cta.label}
      </Button>
    </div>
  );
}
