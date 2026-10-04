import Image from "next/image";

import { TextLink } from "@/components/core/TextLink";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { NewsCard } from "@/components/news/NewsCard";
import { PublicationMetricsBox } from "@/components/publications/PublicationMetricsBox";
import { PublicationSpreadStrip } from "@/components/publications/PublicationSpreadStrip";
import { PublicationTocList } from "@/components/publications/PublicationTocList";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { getNewsBySlug } from "@/content/news";
import type { LoadedPublication } from "@/content/publications";
import { pl } from "@/i18n/pl";
import { footerSitemapFlat } from "@/navigation";

export interface PublicationAlbumPageProps {
  publication: LoadedPublication;
}

export function PublicationAlbumPage({ publication }: PublicationAlbumPageProps) {
  const publicationsLabel = footerSitemapFlat.find((item) => item.href === "/publikacje")!.label;
  const relatedNews = publication.relatedNewsSlug
    ? getNewsBySlug(publication.relatedNewsSlug)
    : undefined;
  return (
    <SectionPageShell active={publicationsLabel}>
      <div className="mx-auto w-full max-w-content-max publication-page">
        <Breadcrumb
          items={[
            { label: pl.publications.breadcrumbHome, href: "/" },
            { label: publicationsLabel, href: "/publikacje" },
            { label: publication.title },
          ]}
        />

        <header className="publication-page-header">
          <h1 className="publication-page-title">{publication.title}</h1>
          <p className="publication-page-lead">{publication.lead}</p>
        </header>

        <section className="publication-album-hero" aria-label={publication.title}>
          <div className="publication-album-hero-grid">
            <div className="publication-album-cover-wrap">
              <div
                className="publication-album-cover-frame"
                style={{
                  aspectRatio: `${publication.cover.width} / ${publication.cover.height}`,
                }}
              >
                <Image
                  src={publication.cover.src}
                  alt={publication.cover.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="publication-album-cover-image"
                  priority
                />
              </div>
              <p className="publication-album-cover-caption">{pl.publications.coverCaptionAlbum}</p>
            </div>
            <PublicationMetricsBox publication={publication} />
          </div>
        </section>

        <section className="publication-spreads-section" aria-labelledby="publication-spreads-heading">
          <h2 id="publication-spreads-heading" className="publication-section-heading">
            {pl.publications.spreadsHeading}
          </h2>
          <PublicationSpreadStrip spreads={publication.spreads} columns={3} />
        </section>

        <section className="publication-about-section" aria-labelledby="publication-about-heading">
          <h2 id="publication-about-heading" className="publication-section-heading">
            {pl.publications.aboutHeading}
          </h2>
          <div className="publication-about-copy">
            {publication.aboutParagraphs.map((paragraph) => (
              <p key={paragraph} className="publication-about-paragraph">{paragraph}</p>
            ))}
          </div>
        </section>

        <PublicationTocList chapters={publication.chapters} items={publication.toc} />

        <section className="publication-see-also publication-album-footer-links">
          <TextLink href="/publikacje">{pl.publications.allPublications}</TextLink>
          <TextLink href="/wyklady">{pl.publications.lecturesScheduleLink}</TextLink>
        </section>

        {relatedNews ? (
          <section className="publication-related-section" aria-labelledby="publication-related-heading">
            <h2 id="publication-related-heading" className="publication-section-heading">
              {pl.publications.seeAlsoHeading}
            </h2>
            <NewsCard entry={relatedNews} />
          </section>
        ) : null}
      </div>
    </SectionPageShell>
  );
}
