import Link from "next/link";

import type { NewsListEntry } from "@/content/news";
import { pl } from "@/i18n/pl";

export interface NewsArticleNavProps {
  previous?: NewsListEntry;
  next?: NewsListEntry;
}

function formatAriaLabel(template: string, title: string): string {
  return template.replace("{title}", title);
}

export function NewsArticleNav({ previous, next }: NewsArticleNavProps) {
  return (
    <nav className="news-article-entry-nav" aria-label={pl.news.articleNavAriaLabel}>
      {previous ? (
        <Link
          href={`/aktualnosci/${previous.slug}`}
          className="news-article-nav-row"
          aria-label={formatAriaLabel(pl.news.previousEntryAria, previous.title)}
        >
          <span className="news-article-entry-label">{pl.news.previousEntryNav}</span>
          <span className="news-article-nav-row-title">{previous.title}</span>
        </Link>
      ) : null}
      {next ? (
        <Link
          href={`/aktualnosci/${next.slug}`}
          className="news-article-nav-row"
          aria-label={formatAriaLabel(pl.news.nextEntryAria, next.title)}
        >
          <span className="news-article-entry-label">{pl.news.nextEntryNav}</span>
          <span className="news-article-nav-row-title">{next.title}</span>
        </Link>
      ) : null}
      <Link href="/aktualnosci" className="news-article-entry-link news-article-nav-all">
        {pl.news.allNewsLink}
      </Link>
    </nav>
  );
}
