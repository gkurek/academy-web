import Link from "next/link";

import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { NewsArticleCover } from "@/components/news/NewsArticleCover";
import { NewsArticleNav } from "@/components/news/NewsArticleNav";
import { NewsEventCta } from "@/components/news/NewsEventCta";
import { NewsFacts } from "@/components/news/NewsFacts";
import { NewsGallery } from "@/components/news/NewsGallery";
import { newsMdxComponents } from "@/components/news/newsMdxComponents";
import { NewsRelated } from "@/components/news/NewsRelated";
import { NewsDateMeta } from "@/components/news/NewsDateMeta";
import {
  getEffectiveNewsLayout,
  getExcerpt,
  getNewsEventPhase,
  shouldShowLead,
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

function newsArticleGridClass(flags: {
  hasTop: boolean;
  hasCta: boolean;
  hasMgal: boolean;
  hasGal: boolean;
}): string {
  const parts = ["news-article"];
  if (flags.hasTop) {
    parts.push("news-article--has-top");
  }
  if (flags.hasCta) {
    parts.push("news-article--has-cta");
  }
  if (flags.hasMgal) {
    parts.push("news-article--has-mgal");
  }
  if (flags.hasGal) {
    parts.push("news-article--has-gal");
  }
  return parts.join(" ");
}

export function NewsArticlePage({ entry, active }: NewsArticlePageProps) {
  const { Content } = entry;
  const kindLabel = getNewsKindLabel(entry.kind);
  const neighbors = getNewsNeighbors(entry.slug);
  const layout = getEffectiveNewsLayout(entry);
  const eventPhase = getNewsEventPhase(entry);
  const images = entry.images ?? [];
  const hasImages = images.length > 0;
  const lead = shouldShowLead(entry) ? getExcerpt(entry) : undefined;
  const relatedLinks = getNewsRelatedLinks(entry);

  const showFacts = layout === "wydarzenie" && entry.facts && entry.facts.length > 0;
  const showEventCta = eventPhase === "zapowiedz";
  const showRelated =
    layout === "wydarzenie"
      ? eventPhase === "relacja" || eventPhase === "po-terminie"
      : relatedLinks.length > 0;
  const isWideImageLayout = layout === "galeria" || layout === "wydarzenie";
  const columnImageIndex = entry.columnImageIndex;
  const columnImage =
    columnImageIndex !== undefined ? images[columnImageIndex] : undefined;
  const showColumnImage =
    columnImage !== undefined && columnImageIndex !== undefined;
  const hasGalleryTekst = layout === "tekst" && hasImages;
  const hasGalleryWide = isWideImageLayout && hasImages;
  /** Desktop `gal` row: omit when the only image sits in the column (mobile still uses `gal`). */
  const hasGalGridArea =
    hasGalleryWide && (images.length > 1 || !showColumnImage);
  const galleryHeading = layout === "tekst";
  const hideOnDesktopIndex = showColumnImage ? columnImageIndex : undefined;
  const railStickyOff = relatedLinks.length > 3;

  const articleClass = newsArticleGridClass({
    hasTop: Boolean(showFacts || showColumnImage),
    hasCta: showEventCta,
    hasMgal: hasGalleryTekst,
    hasGal: hasGalGridArea,
  });

  return (
    <SectionPageShell active={active}>
      <article className={articleClass}>
        <header className="news-article-head">
          <p className="news-article-meta">
            <span className="news-article-kind">{kindLabel}</span>
            {" · "}
            <NewsDateMeta
              date={entry.date}
              dateEnd={entry.dateEnd}
              withYear
              className="news-article-meta-date"
            />
          </p>
          <h1 className="news-article-title">{entry.title}</h1>
          {lead ? <p className="news-article-lead">{lead}</p> : null}
          <hr className="news-article-head-rule" />
        </header>

        {showFacts || showColumnImage ? (
          <div className="news-article-top">
            {showColumnImage ? (
              <NewsArticleCover
                image={columnImage}
                images={images}
                lightboxIndex={columnImageIndex}
              />
            ) : null}
            {showFacts ? <NewsFacts facts={entry.facts!} /> : null}
          </div>
        ) : null}

        <div className="news-article-main news-article-prose news-prose">
          <Content components={newsMdxComponents} />
        </div>

        {showEventCta ? (
          <div className="news-article-cta">
            <NewsEventCta kind={entry.kind} />
          </div>
        ) : null}

        {hasGalleryTekst ? (
          <div className="news-article-mgal">
            <NewsGallery
              images={images}
              layout={layout}
              showHeading={galleryHeading}
              hideOnDesktopIndex={hideOnDesktopIndex}
            />
          </div>
        ) : null}

        {hasGalleryWide ? (
          <div
            className={[
              "news-article-gal",
              !hasGalGridArea ? "news-article-gal--column-only-mobile" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <NewsGallery
              images={images}
              layout={layout}
              showHeading={false}
              hideOnDesktopIndex={hideOnDesktopIndex}
            />
          </div>
        ) : null}

        <div className="news-article-rail">
          <div
            className={[
              "news-article-rail-inner",
              railStickyOff ? "news-article-rail-inner--no-sticky" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {showRelated ? <NewsRelated links={relatedLinks} /> : null}
            <NewsArticleNav previous={neighbors.previous} next={neighbors.next} />
          </div>
        </div>

        {hasGalGridArea ? (
          <footer className="news-article-gend">
            <Link href="/aktualnosci" className="news-article-entry-link news-article-gend-link">
              {pl.news.allNewsLink}
            </Link>
          </footer>
        ) : null}
      </article>
    </SectionPageShell>
  );
}
