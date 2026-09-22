import Link from "next/link";

import { TextLink } from "@/components/core/TextLink";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { NewsGallery } from "@/components/news/NewsGallery";
import { NewsPoster } from "@/components/news/NewsPoster";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { NewsDateMeta } from "@/components/news/NewsDateMeta";
import {
  getNewsKindLabel,
  getNewsNeighbors,
  type LoadedNews,
} from "@/content/news";
import { pl } from "@/i18n/pl";

export interface NewsArticlePageProps {
  entry: LoadedNews;
  active: string;
}

function formatAriaLabel(template: string, title: string): string {
  return template.replace("{title}", title);
}

export function NewsArticlePage({ entry, active }: NewsArticlePageProps) {
  const { Content } = entry;
  const kindLabel = getNewsKindLabel(entry.kind);
  const neighbors = getNewsNeighbors(entry.slug);
  const hasPoster = Boolean(entry.poster);
  const hasGallery = Boolean(entry.images && entry.images.length > 0);

  return (
    <SectionPageShell active={active}>
      <article className="news-article">
        <Breadcrumb
          items={[
            { label: pl.news.breadcrumbHome, href: "/aktualnosci" },
            { label: entry.title },
          ]}
        />

        <header className="news-article-header">
          <p className="news-article-meta">
            <span className="text-accent-text">{kindLabel}</span>
            {" · "}
            <NewsDateMeta
              date={entry.date}
              dateEnd={entry.dateEnd}
              withYear
              className="text-text-tertiary"
            />
          </p>
          <h1 className="news-article-title">{entry.title}</h1>
        </header>

        <div className={hasPoster ? "news-article-body-grid" : undefined}>
          <div className="news-article-mdx text-page-mdx min-w-0">
            <Content />
          </div>
          {hasPoster ? <NewsPoster poster={entry.poster} /> : null}
        </div>

        {hasGallery ? <NewsGallery images={entry.images!} /> : null}

        <nav className="news-article-nav" aria-label={pl.news.articleNavAriaLabel}>
          <div className="news-article-nav-links">
            {neighbors.previous ? (
              <Link
                href={`/aktualnosci/${neighbors.previous.slug}`}
                className="news-article-nav-link"
                aria-label={formatAriaLabel(pl.news.previousEntryAria, neighbors.previous.title)}
              >
                <span aria-hidden="true">‹</span>
                {pl.news.previousEntry}
              </Link>
            ) : (
              <span className="news-article-nav-spacer" aria-hidden="true" />
            )}
            {neighbors.next ? (
              <Link
                href={`/aktualnosci/${neighbors.next.slug}`}
                className="news-article-nav-link news-article-nav-link-next"
                aria-label={formatAriaLabel(pl.news.nextEntryAria, neighbors.next.title)}
              >
                {pl.news.nextEntry}
                <span aria-hidden="true">›</span>
              </Link>
            ) : (
              <span className="news-article-nav-spacer" aria-hidden="true" />
            )}
          </div>
          <TextLink href="/aktualnosci" className="news-article-nav-all">
            {pl.news.allNewsLink}
          </TextLink>
        </nav>
      </article>
    </SectionPageShell>
  );
}
