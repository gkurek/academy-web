import Image from "next/image";

import { Button } from "@/components/core/Button";
import { TextLink } from "@/components/core/TextLink";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { ArticleList } from "@/components/publications/ArticleList";
import { PublicationSpreadStrip } from "@/components/publications/PublicationSpreadStrip";
import { getArticles } from "@/content/articles";
import {
  formatPublicationPrice,
  getHubSpreadPreview,
  getPublications,
} from "@/content/publications";
import { getSiteSettings } from "@/content/settings";
import { pl } from "@/i18n/pl";
import { pluralize } from "@/i18n/pluralize";
import { buildMailtoHref } from "@/lib/mailto";
import { footerSitemap } from "@/navigation";

export function PublicationsHubPage() {
  const publicationsLabel = footerSitemap.find((item) => item.href === "/publikacje")!.label;
  const [publication] = getPublications();
  const articles = getArticles();
  const settings = getSiteSettings();
  const secretariatEmail = settings.emails.find((email) => email.label.includes("sekretariat"))
    ?.address ?? settings.emails[1]?.address ?? settings.emails[0].address;
  const mailtoHref = buildMailtoHref(secretariatEmail, pl.publications.mailtoSubject);

  if (!publication) {
    return null;
  }

  const priceLabel = formatPublicationPrice(publication.price);
  const availabilityLabel =
    publication.availability === "dostepny"
      ? pl.publications.facts.availabilityAvailableShort
      : pl.publications.facts.availabilitySoldOut;
  const pageWord = pluralize(publication.pages, ["strona", "strony", "stron"]);
  const imprint = pl.publications.imprint.replace("{year}", String(publication.year));
  const hubSpreads = getHubSpreadPreview(publication.spreads, 4);

  return (
    <SectionPageShell active={publicationsLabel}>
      <div className="mx-auto w-full max-w-content-max publication-page">
        <header className="publication-page-header">
          <h1 className="publication-page-title">{pl.publications.title}</h1>
          <p className="publication-page-lead">{pl.publications.lead}</p>
        </header>

        <section className="publication-hub-album" aria-labelledby="publication-hub-album-title">
          <div className="publication-hub-album-grid">
            <div className="publication-hub-cover-wrap">
              <div className="publication-hub-cover-frame">
                <Image
                  src={publication.cover.src}
                  alt={publication.cover.alt}
                  fill
                  sizes="(min-width: 768px) 440px, 100vw"
                  className="publication-hub-cover-image"
                  priority
                />
              </div>
              <p className="publication-hub-cover-caption">
                {pl.publications.coverCaption}{" "}
                <span className="publication-placeholder-note">{pl.publications.coverScanNote}</span>
              </p>
            </div>

            <div className="publication-hub-album-copy">
              <p className="publication-hub-eyebrow">{pl.publications.albumEyebrow}</p>
              <h2 id="publication-hub-album-title" className="publication-hub-album-title">
                {publication.title}
              </h2>
              <p className="publication-hub-imprint">{imprint}</p>
              <p className="publication-hub-description">{publication.hubDescription}</p>

              <dl className="publication-hub-facts">
                <div className="publication-hub-facts-row">
                  <dt>{pl.publications.facts.year}</dt>
                  <dd>{publication.year}</dd>
                </div>
                <div className="publication-hub-facts-row">
                  <dt>{pl.publications.facts.pageCount}</dt>
                  <dd>
                    {publication.pages} {pageWord}
                  </dd>
                </div>
                <div className="publication-hub-facts-row">
                  <dt>{pl.publications.facts.format}</dt>
                  <dd>{publication.format}</dd>
                </div>
                {priceLabel ? (
                  <div className="publication-hub-facts-row">
                    <dt>{pl.publications.facts.price}</dt>
                    <dd>{priceLabel}</dd>
                  </div>
                ) : null}
                <div className="publication-hub-facts-row">
                  <dt>{pl.publications.facts.availability}</dt>
                  <dd>{availabilityLabel}</dd>
                </div>
              </dl>

              <div className="publication-hub-ctas">
                <Button href={`/publikacje/${publication.slug}`} variant="primary" size="lg">
                  {pl.publications.viewAlbum}
                </Button>
                <Button href={mailtoHref} variant="secondary" size="lg">
                  {pl.publications.orderAlbum}
                </Button>
              </div>
            </div>
          </div>

          <div className="publication-hub-spreads">
            <p className="publication-hub-spreads-label">{pl.publications.spreadsHeading}</p>
            <PublicationSpreadStrip spreads={hubSpreads} columns={4} />
            <p className="publication-hub-spreads-note">{pl.publications.spreadsIntroHub}</p>
          </div>
        </section>

        <section
          id="artykuly"
          className="publication-articles-section"
          aria-labelledby="publication-articles-heading"
        >
          <h2 id="publication-articles-heading" className="publication-section-heading">
            {pl.publications.articlesHeading}
          </h2>
          <p className="publication-section-lead">{pl.publications.articlesLead}</p>
          <ArticleList articles={articles} />
        </section>

        <footer className="publication-see-also">
          <div className="publication-see-also-row">
            <span className="publication-see-also-label">{pl.publications.seeAlsoLabel}</span>
            <TextLink href="/ikony/wystawy">{pl.publications.exhibitionLink}</TextLink>
            <TextLink href="/wyklady">{pl.publications.lecturesLinkFooter}</TextLink>
          </div>
        </footer>
      </div>
    </SectionPageShell>
  );
}
