import Image from "next/image";

import { NewsDateMeta } from "@/components/news/NewsDateMeta";
import { NewsEntryLink } from "@/components/news/NewsEntryLink";
import { getNewsKindLabel, type NewsListEntry } from "@/content/news";
import { pl } from "@/i18n/pl";

export interface NewsFeaturedProps {
  entry: NewsListEntry;
}

export function NewsFeatured({ entry }: NewsFeaturedProps) {
  if (!entry.cover) {
    return null;
  }

  const kindLabel = getNewsKindLabel(entry.kind);
  const href = `/aktualnosci/${entry.slug}`;
  const year = entry.date.slice(0, 4);

  return (
    <section className="news-featured-section" aria-labelledby="news-featured-label">
      <p id="news-featured-label" className="news-featured-label">
        {pl.news.featuredLabel}
      </p>
      <article className="news-featured">
      <div className="news-featured-media" aria-hidden="true">
        <Image
          src={entry.cover.src}
          alt=""
          width={entry.cover.width}
          height={entry.cover.height}
          sizes="(min-width: 768px) 42vw, 100vw"
          className="news-featured-image"
        />
      </div>
      <div className="news-featured-content">
        <p className="news-featured-meta">
          <NewsDateMeta date={entry.date} dateEnd={entry.dateEnd} withYear className="news-featured-date" />
          <span className="news-card-meta-separator" aria-hidden="true"> · </span>
          <span className="news-featured-kind">{kindLabel}</span>
        </p>
        <h2 className="news-featured-title">
          <NewsEntryLink href={href} year={year} className="news-featured-title-link">
            {entry.title}
          </NewsEntryLink>
        </h2>
        {entry.displayExcerpt ? (
          <p className="news-featured-excerpt">{entry.displayExcerpt}</p>
        ) : null}
        <span className="news-featured-read-more" aria-hidden="true">{pl.news.readMoreFeatured}</span>
      </div>
      </article>
    </section>
  );
}
