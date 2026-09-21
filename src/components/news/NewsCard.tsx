import Link from "next/link";

import { formatNewsDate, getNewsKindLabel, type NewsListEntry } from "@/content/news";

export interface NewsCardProps {
  entry: NewsListEntry;
}

export function NewsCard({ entry }: NewsCardProps) {
  const kindLabel = getNewsKindLabel(entry.kind);
  const dateLabel = formatNewsDate(entry.date, entry.dateEnd);
  const href = `/aktualnosci/${entry.slug}`;

  return (
    <article className="news-card">
      <p className="news-card-meta">
        <span className="text-accent-text">{kindLabel}</span>
        {" · "}
        <span className="text-text-tertiary">{dateLabel}</span>
      </p>
      <h3 className="news-card-title">
        <Link href={href} className="news-card-title-link">
          {entry.title}
        </Link>
      </h3>
      {entry.excerpt ? <p className="news-card-excerpt">{entry.excerpt}</p> : null}
    </article>
  );
}
