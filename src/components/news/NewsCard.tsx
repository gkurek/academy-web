import { NewsDateMeta } from "@/components/news/NewsDateMeta";
import { NewsEntryLink } from "@/components/news/NewsEntryLink";
import { formatGalleryCount, getNewsKindLabel, type NewsListEntry } from "@/content/news";
import { pl } from "@/i18n/pl";

export interface NewsCardProps {
  entry: NewsListEntry;
}

export function NewsCard({ entry }: NewsCardProps) {
  const kindLabel = getNewsKindLabel(entry.kind);
  const href = `/aktualnosci/${entry.slug}`;
  const year = entry.date.slice(0, 4);
  const galleryLabel = entry.images?.length ? formatGalleryCount(entry.images.length) : undefined;

  return (
    <article className="news-card">
      <div className="news-card-meta-col">
        <p className="news-card-meta">
          <NewsDateMeta date={entry.date} withYear />
          <span className="sr-only">{`, ${kindLabel}`}</span>
          <span className="news-card-meta-inline-kind" aria-hidden="true">
            <span className="news-card-meta-separator"> · </span>
            <span className="news-card-kind">{kindLabel}</span>
          </span>
        </p>
        <p className="news-card-kind-desktop" aria-hidden="true">{kindLabel}</p>
        {galleryLabel ? <p className="news-card-gallery">{galleryLabel}</p> : null}
      </div>

      <div className="news-card-body">
        <h3 className="news-card-title">
          <NewsEntryLink href={href} year={year} className="news-card-title-link">
            {entry.title}
          </NewsEntryLink>
        </h3>
        {entry.displayExcerpt ? (
          <p className="news-card-excerpt">{entry.displayExcerpt}</p>
        ) : null}
      </div>

      <span className="news-card-read-more" aria-hidden="true">{pl.news.readMore}</span>
    </article>
  );
}
