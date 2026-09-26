import Image from "next/image";

import { TextLink } from "@/components/core/TextLink";
import { getAuthorDisplayName, getAuthorProfileHref } from "@/content/authors";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { NewsCard } from "@/components/news/NewsCard";
import { PublicationMetricsBox } from "@/components/publications/PublicationMetricsBox";
import { PublicationSpreadStrip } from "@/components/publications/PublicationSpreadStrip";
import { PublicationTocList } from "@/components/publications/PublicationTocList";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { getNewsBySlug } from "@/content/news";
import {
  getPublicationAuthorGroups,
  type LoadedPublication,
} from "@/content/publications";
import { getSiteSettings } from "@/content/settings";
import { pl } from "@/i18n/pl";
import { buildMailtoHref } from "@/lib/mailto";
import { footerSitemap } from "@/navigation";

export interface PublicationAlbumPageProps {
  publication: LoadedPublication;
}

export function PublicationAlbumPage({ publication }: PublicationAlbumPageProps) {
  const publicationsLabel = footerSitemap.find((item) => item.href === "/publikacje")!.label;
  const authorGroups = getPublicationAuthorGroups(publication);
  const relatedNews = publication.relatedNewsSlug
    ? getNewsBySlug(publication.relatedNewsSlug)
    : undefined;
  const settings = getSiteSettings();
  const secretariatEmail = settings.emails.find((email) => email.label.includes("sekretariat"))
    ?.address ?? settings.emails[1]?.address ?? settings.emails[0].address;
  const mailtoHref = buildMailtoHref(secretariatEmail, pl.publications.mailtoSubject);

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
              <div className="publication-album-cover-frame">
                <Image
                  src={publication.cover.src}
                  alt={publication.cover.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="publication-album-cover-image"
                  priority
                />
              </div>
              <p className="publication-album-cover-caption">
                {pl.publications.coverCaptionAlbum}{" "}
                <span className="publication-placeholder-note">{pl.publications.coverScanNote}</span>
              </p>
            </div>
            <PublicationMetricsBox publication={publication} />
          </div>
        </section>

        <section className="publication-spreads-section" aria-labelledby="publication-spreads-heading">
          <h2 id="publication-spreads-heading" className="publication-section-heading">
            {pl.publications.spreadsHeading}
          </h2>
          <p className="publication-section-lead publication-spreads-lead-mobile">
            {pl.publications.spreadsIntroMobile}
          </p>
          <PublicationSpreadStrip
            spreads={publication.spreads}
            columns={3}
            showMailto
            mailtoHref={mailtoHref}
          />
          <p className="publication-spreads-footnote">{pl.publications.spreadsFootnote}</p>
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

        <PublicationTocList items={publication.toc} />

        <section className="publication-authors-section" aria-labelledby="publication-authors-heading">
          <h2 id="publication-authors-heading" className="publication-section-heading">
            {pl.publications.authorsHeading}
          </h2>
          <div className="publication-authors-grid">
            <div>
              <p className="publication-authors-group-label">{pl.publications.authorsLecturers}</p>
              <p className="publication-authors-list">
                {authorGroups.lecturers.map((author, index) => {
                  const profileHref = getAuthorProfileHref(author);
                  const displayName = getAuthorDisplayName(author);

                  return (
                  <span key={author.lecturerSlug ?? author.name}>
                    {profileHref ? (
                      <TextLink href={profileHref}>
                        {displayName}
                      </TextLink>
                    ) : (
                      displayName
                    )}
                    {index < authorGroups.lecturers.length - 1 ? " · " : ""}
                  </span>
                  );
                })}
              </p>
              <TextLink href="/wyklady/wykladowcy" className="publication-authors-link">
                {pl.publications.lecturersLink}
              </TextLink>
            </div>
            <div>
              <p className="publication-authors-group-label">{pl.publications.authorsParticipants}</p>
              <p className="publication-authors-list">
                {authorGroups.participants.map((author, index) => (
                  <span key={author.name}>
                    {getAuthorDisplayName(author)}
                    {index < authorGroups.participants.length - 1 ? " · " : ""}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </section>

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
