import Link from "next/link";

import { TextLink } from "@/components/core/TextLink";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { NewsEventCta } from "@/components/news/NewsEventCta";
import { NewsFacts } from "@/components/news/NewsFacts";
import { NewsGallery } from "@/components/news/NewsGallery";
import { newsMdxComponents } from "@/components/news/newsMdxComponents";
import { NEWS_ARTICLE_WIDE_ALIGN } from "@/components/news/newsArticleWideAlign";
import { NewsRelated } from "@/components/news/NewsRelated";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { NewsDateMeta } from "@/components/news/NewsDateMeta";
import {
  getEffectiveNewsLayout,
  getExcerpt,
  getNewsArticleYear,
  getNewsEventPhase,
  getNewsKindLabel,
  getNewsNeighbors,
  getNewsRelatedLinks,
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
  const layout = getEffectiveNewsLayout(entry);
  const eventPhase = getNewsEventPhase(entry);
  const images = entry.images ?? [];
  const hasGallery = images.length > 0;
  const year = getNewsArticleYear(entry);
  const lead = entry.hideLead ? undefined : getExcerpt(entry);
  const relatedLinks = getNewsRelatedLinks(entry);

  const showFacts = layout === "wydarzenie" && entry.facts && entry.facts.length > 0;
  const showEventCta = eventPhase === "zapowiedz";
  const showRelated =
    layout === "wydarzenie"
      ? eventPhase === "relacja" || eventPhase === "po-terminie"
      : relatedLinks.length > 0;
  const galleryHeading = layout === "tekst";

  const wideAlignClass =
    NEWS_ARTICLE_WIDE_ALIGN === "center"
      ? "news-article--wide-center"
      : "news-article--wide-start";

  return (
    <SectionPageShell active={active}>
      <article className={["news-article", wideAlignClass].join(" ")}>
        <Breadcrumb
          items={[
            { label: pl.news.breadcrumbHome, href: "/aktualnosci" },
            {
              label: year,
              href: `/aktualnosci#${year}`,
            },
          ]}
        />

        <header className="news-article-header news-article-col">
          <p className="news-article-meta">
            <span className="news-article-meta-kind">{kindLabel}</span>
            {" · "}
            <NewsDateMeta
              date={entry.date}
              dateEnd={entry.dateEnd}
              withYear
              className="news-article-meta-date"
            />
            {entry.venue ? (
              <>
                {" · "}
                <span>{entry.venue}</span>
              </>
            ) : null}
          </p>
          <h1 className="news-article-title">{entry.title}</h1>
          {lead ? <p className="news-article-lead">{lead}</p> : null}
        </header>

        {showFacts ? <NewsFacts facts={entry.facts!} /> : null}

        <div className="news-article-prose news-prose news-article-col">
          <Content components={newsMdxComponents} />
        </div>

        {showEventCta ? <NewsEventCta kind={entry.kind} /> : null}

        {hasGallery ? (
          <NewsGallery images={images} layout={layout} showHeading={galleryHeading} />
        ) : null}

        {showRelated ? <NewsRelated links={relatedLinks} /> : null}

        <nav
          className="news-article-nav news-article-col"
          aria-label={pl.news.articleNavAriaLabel}
        >
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
