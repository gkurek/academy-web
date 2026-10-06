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
import { publicationsLink } from "@/navigation";
import { PageHeading } from "@/components/core/PageHeading";
import { Prose } from "@/components/core/Prose";

export interface PublicationAlbumPageProps {
  publication: LoadedPublication;
  /** Route path — see SectionPageShellProps["path"]. */
  path: string;
}

export function PublicationAlbumPage({ publication, path }: PublicationAlbumPageProps) {
  const relatedNews = publication.relatedNewsSlug
    ? getNewsBySlug(publication.relatedNewsSlug)
    : undefined;
  return (
    <SectionPageShell path={path}>
      <div className="publication-page">
        <Breadcrumb
          items={[
            { label: pl.publications.breadcrumbHome, href: "/" },
            { label: publicationsLink.label, href: publicationsLink.href },
            { label: publication.title },
          ]}
        />

        <header className="publication-page-header">
          <PageHeading level="page" className="mb-space-5">{publication.title}</PageHeading>
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
          <PageHeading level="section" id="publication-spreads-heading" className="mb-heading-gap">
            {pl.publications.spreadsHeading}
          </PageHeading>
          <PublicationSpreadStrip spreads={publication.spreads} columns={3} />
        </section>

        <section className="publication-about-section" aria-labelledby="publication-about-heading">
          <PageHeading level="section" id="publication-about-heading" className="mb-heading-gap">
            {pl.publications.aboutHeading}
          </PageHeading>
          <Prose variant="text" className="publication-about-copy">
            {publication.aboutParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Prose>
        </section>

        <PublicationTocList chapters={publication.chapters} items={publication.toc} />

        {relatedNews ? (
          <section className="publication-related-section" aria-labelledby="publication-related-heading">
            <PageHeading level="section" id="publication-related-heading" className="mb-heading-gap">
              {pl.publications.seeAlsoHeading}
            </PageHeading>
            <NewsCard entry={relatedNews} />
          </section>
        ) : null}

        <footer className="publication-see-also">
          <div className="publication-see-also-row">
            <span className="publication-see-also-label">{pl.publications.seeAlsoLabel}</span>
            <TextLink standalone href="/publikacje">{pl.publications.allPublications}</TextLink>
            <TextLink standalone href="/wyklady">{pl.publications.lecturesScheduleLink}</TextLink>
          </div>
        </footer>
      </div>
    </SectionPageShell>
  );
}
