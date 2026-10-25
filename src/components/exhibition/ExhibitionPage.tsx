import Image from "next/image";
import type { CSSProperties } from "react";

import { TextLink } from "@/components/core/TextLink";
import { ExhibitionAnnualTiles } from "@/components/exhibition/ExhibitionAnnualTiles";
import { ExhibitionFactsPanel } from "@/components/exhibition/ExhibitionFactsPanel";
import { ExhibitionHashScroll } from "@/components/exhibition/ExhibitionHashScroll";
import { ExhibitionFrame } from "@/components/exhibition/ExhibitionFrame";
import { ExhibitionNowNext } from "@/components/exhibition/ExhibitionNowNext";
import { ExhibitionPageNav } from "@/components/exhibition/ExhibitionPageNav";
import { ExhibitionToursSection } from "@/components/exhibition/ExhibitionToursSection";
import { ExhibitionTravelingSection } from "@/components/exhibition/ExhibitionTravelingSection";
import { LightboxProvider } from "@/components/lightbox/LightboxProvider";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import {
  getAnnualExhibitionYear,
  getExhibitionCopy,
  isAnnualExhibitionActive,
  resolveAnnualVernissage,
  type ExhibitionNowNext as ExhibitionNowNextState,
  type LoadedExhibitionPage,
} from "@/content/exhibition";
import { getLectureSeasonShortTheme } from "@/content/lectures";
import { getEnrollmentEmail } from "@/content/settings";
import type { AnnualExhibition } from "@/content/types";
import { pl } from "@/i18n/pl";
import { buildMailtoHref } from "@/lib/mailto";
import { formatPolishMonthYearLocative } from "@/lib/polishMonth";
import { PageHeading } from "@/components/core/PageHeading";

export interface ExhibitionPageProps {
  /** Route path — see SectionPageShellProps["path"]. */
  path: string;
  page: LoadedExhibitionPage;
  latestAnnual: AnnualExhibition;
  lastFinished?: AnnualExhibition;
  nowNext: ExhibitionNowNextState;
  firstAnnualYear: number;
}

export function ExhibitionPage({
  path,
  page,
  latestAnnual,
  lastFinished,
  nowNext,
  firstAnnualYear,
}: ExhibitionPageProps) {
  const annualActive = isAnnualExhibitionActive(latestAnnual);
  const { page: pageLabels, permanent, annual, facts, traveling } = pl.exhibition;
  const copy = getExhibitionCopy();
  const enrollmentEmail = getEnrollmentEmail();
  const travelingMailtoHref = buildMailtoHref(enrollmentEmail, traveling.mailtoSubject);

  const annualFactRows = [
    { label: facts.where, value: copy.whereValue },
    { label: annual.facts.when, value: copy.annual.facts.whenValue },
    { label: annual.facts.vernissage, value: copy.annual.facts.vernissageValue },
    { label: annual.facts.onDisplay, value: copy.annual.facts.onDisplayValue },
    { label: annual.facts.admission, value: copy.annual.facts.admissionValue },
  ];

  const permanentFactRows = [
    { label: facts.where, value: copy.whereValue },
    { label: permanent.facts.when, value: copy.permanent.facts.whenValue },
    { label: permanent.facts.hours, value: copy.permanent.facts.hoursValue },
    {
      label: permanent.facts.onDisplay,
      value: copy.permanent.facts.onDisplayValue
        .replace("{from}", String(page.iconCount.from))
        .replace("{to}", String(page.iconCount.to)),
    },
    { label: permanent.facts.admission, value: copy.permanent.facts.admissionValue },
  ];

  const titleSource = annualActive ? latestAnnual : lastFinished;
  const titleSentence = titleSource
    ? (annualActive ? copy.annual.titleSentenceCurrent : copy.annual.titleSentencePast)
        .replace("{year}", String(getAnnualExhibitionYear(titleSource.seasonSlug)))
        .replace("{theme}", getLectureSeasonShortTheme(titleSource.seasonSlug))
    : "";

  const vernissage = resolveAnnualVernissage(latestAnnual);
  const monthYear = vernissage ? formatPolishMonthYearLocative(vernissage) : "";
  const scheduleNext =
    monthYear.length > 0
      ? copy.annual.scheduleNext.replace("{monthYear}", monthYear)
      : copy.annual.scheduleNextMissing;

  // Curated photos from several years (K-154), never a given exhibition's own photos. The tiles
  // open one lightbox list: the tiles first, then the rest of the gallery.
  const annualTilePhotos = page.annualImages ?? [];
  const annualGallery = [...annualTilePhotos, ...(page.annualGallery ?? [])];

  // Media paths are trusted here; `npm run check:media` verifies the files exist at build (D9).
  const { heroImage, permanentImage, permanentImage2 } = page;
  const permanentPhotos = [permanentImage, permanentImage2].filter(
    (photo): photo is NonNullable<typeof photo> => Boolean(photo),
  );

  return (
    <SectionPageShell path={path}>
      <ExhibitionHashScroll>
      <header>
        <div className="exhibition-hero-grid">
          <p
            className="exhibition-hero-grid__eyebrow font-serif text-size-body text-accent-text"
          >
            {copy.page.eyebrow}
          </p>
          <PageHeading level="page" className="exhibition-hero-grid__h1">
            {copy.page.title}
          </PageHeading>
          <p
            className="exhibition-hero-grid__lead text-size-lead-m md:text-size-lead leading-body text-text-secondary max-w-measure-lead"
          >
            {copy.page.lead}
          </p>
          <ExhibitionNowNext state={nowNext} className="exhibition-hero-grid__now" />
          <ExhibitionPageNav className="exhibition-hero-grid__nav" />
        </div>
      </header>

      <LightboxProvider>
        {heroImage ? (
          <div className="exhibition-hero-frame mb-space-6">
            <ExhibitionFrame image={heroImage} />
          </div>
        ) : null}

        <section
          id={annual.sectionId}
          className="exhibition-section scroll-mt-space-6"
          aria-labelledby="exhibition-annual-heading"
        >
          <div className="exhibition-section-grid exhibition-section-grid--text-facts mb-space-6">
            <div className="exhibition-section-grid__main min-w-0">
              <p
                className="exhibition-section-eyebrow text-size-caption uppercase tracking-caption-wide text-text-tertiary"
              >
                {copy.annual.eyebrow}
              </p>
              <PageHeading level="section" id="exhibition-annual-heading" className="exhibition-section-h2">
                {copy.annual.title}
              </PageHeading>
              <p className="exhibition-section-copy">
                {titleSentence ? `${copy.annual.intro1} ${titleSentence}` : copy.annual.intro1}
              </p>
              <p className="exhibition-section-copy">{copy.annual.intro3}</p>
              <p className="exhibition-section-copy">
                {copy.annual.scheduleSince.replace("{firstYear}", String(firstAnnualYear))}{" "}
                {scheduleNext}
              </p>
            </div>
            <div className="exhibition-section-grid__facts min-w-0">
              <ExhibitionFactsPanel rows={annualFactRows} />
            </div>
          </div>

          <ExhibitionAnnualTiles photos={annualTilePhotos} gallery={annualGallery} />
        </section>

        <section
          id={permanent.sectionId}
          className="exhibition-section scroll-mt-space-6"
          aria-labelledby="exhibition-permanent-heading"
        >
          <div className="exhibition-permanent-layout">
            <div className="exhibition-permanent-layout__facts min-w-0">
              <ExhibitionFactsPanel rows={permanentFactRows} />
            </div>
            <div className="exhibition-permanent-layout__main min-w-0">
              <p
                className="exhibition-section-eyebrow text-size-caption uppercase tracking-caption-wide text-text-tertiary"
              >
                {copy.permanent.eyebrow}
              </p>
              <PageHeading level="section" id="exhibition-permanent-heading" className="exhibition-section-h2">
                {page.title}
              </PageHeading>
              {page.descriptionParagraphs.map((paragraph) => (
                <p key={paragraph} className="exhibition-section-copy">
                  {paragraph}
                </p>
              ))}
            </div>
            {permanentPhotos.length > 0 ? (
              // Photos keep their own proportions; columns follow the ratios so both share one height.
              <div
                className="exhibition-permanent-layout__media exhibition-permanent-layout__media--photos"
                style={
                  {
                    "--permanent-photo-cols": permanentPhotos
                      .map((photo) => `${photo.width / photo.height}fr`)
                      .join(" "),
                  } as CSSProperties
                }
              >
                {permanentPhotos.map((photo) => (
                  <figure key={photo.src} className="m-0">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="block h-auto w-full"
                    />
                  </figure>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <ExhibitionToursSection />

        <ExhibitionTravelingSection
          mailtoHref={travelingMailtoHref}
          places={page.travelingPlaces}
          photos={page.travelingImages ?? []}
          gallery={page.travelingGallery ?? []}
        />
      </LightboxProvider>

      <footer className="exhibition-page-footer">
        <span className="exhibition-page-footer-label">{pageLabels.startHere}</span>
        <TextLink standalone href="/ikony">{pageLabels.galleryLink}</TextLink>
        <TextLink standalone href="/warsztaty">{pageLabels.workshopsLink}</TextLink>
      </footer>
      </ExhibitionHashScroll>
    </SectionPageShell>
  );
}
