import type { NewsFact } from "@/content/types";

export interface NewsFactsProps {
  facts: NewsFact[];
}

export function NewsFacts({ facts }: NewsFactsProps) {
  if (facts.length === 0) {
    return null;
  }

  return (
    <dl className="news-article-facts news-article-col">
      {facts.map((fact) => (
        <div key={`${fact.label}-${fact.value}`} className="news-article-facts-item">
          <dt className="news-article-facts-label">{fact.label}</dt>
          <dd className="news-article-facts-value">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
