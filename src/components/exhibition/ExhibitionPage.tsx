import type { ReactNode } from "react";

import { TextLink } from "@/components/core/TextLink";
import { ExhibitionFactsPanel } from "@/components/exhibition/ExhibitionFactsPanel";
import { ExhibitionLightboxProvider } from "@/components/exhibition/ExhibitionLightboxProvider";
import { ExhibitionPageNav } from "@/components/exhibition/ExhibitionPageNav";
import { ExhibitionPhotoGrid } from "@/components/exhibition/ExhibitionPhotoGrid";
import { ExhibitionPreviousSection } from "@/components/exhibition/ExhibitionPreviousSection";
import {
  ExhibitionToursSection,
  ExhibitionTravelingSection,
} from "@/components/exhibition/ExhibitionToursSection";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import {
  getAnnualExhibitions,
  getAnnualExhibitionYear,
  getAnnualIconCountLabel,
  getAnnualOpenPeriodLabel,
  getExhibitionArchiveBlock,
  getExhibitionPage,
  getLatestAnnualExhibition,
  isAnnualExhibitionActive,
  resolveAnnualVernissage,
} from "@/content/exhibition";
import { getTravelingExhibitions } from "@/content/news";
import { getSiteSettings } from "@/content/settings";
import { pl } from "@/i18n/pl";
import { formatDateRange } from "@/lib/formatDateRange";
import { buildMailtoHref } from "@/lib/mailto";
import { filterExistingPhotos } from "@/lib/mediaFileExists";

export interface ExhibitionPageProps {
  active: string;
  sectionActive: string;
}

function ExhibitionSectionLayout({
  sectionId,
  eyebrow,
  heading,
  headingId,
  copy,
  facts,
  photos,
}: {
  sectionId: string;
  eyebrow?: string;
  heading: string;
  headingId: string;
  copy: ReactNode;
  facts: ReactNode;
  photos: ReactNode;
}) {
  return (
    <section id={sectionId} className="exhibition-section scroll-mt-space-6" aria-labelledby={headingId}>
      {eyebrow ? (
        <p className="text-size-caption uppercase tracking-caption-wide text-text-tertiary mb-space-3">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={headingId}
        className="font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2 mb-space-5"
      >
        {heading}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-offer-main gap-offer-main-gap items-start mb-space-6">
        <div className="min-w-0">{copy}</div>
        <div className="hidden lg:block">{facts}</div>
      </div>

      <div className="mb-space-6 lg:hidden">{facts}</div>
      {photos}
    </section>
  );
}

export function ExhibitionPage({ active, sectionActive }: ExhibitionPageProps) {
  const page = getExhibitionPage();
  const settings = getSiteSettings();
  const latestAnnual = getLatestAnnualExhibition();
  const allAnnual = getAnnualExhibitions();
  const annualActive = isAnnualExhibitionActive(latestAnnual);
  const vernissage = resolveAnnualVernissage(latestAnnual);
  const latestYear = getAnnualExhibitionYear(latestAnnual.seasonSlug);
  const archiveBlock = getExhibitionArchiveBlock();
  const interiorPhotos = filterExistingPhotos(page.interiorPhotos);
  const { page: pageCopy, permanent, annual, previous, facts, tours, traveling } = pl.exhibition;
  const enrollmentEmail = settings.emails[0]?.address ?? "akademiaikony@gmail.com";

  const permanentFactRows = [
    {
      label: facts.where,
      value: `${settings.place}, ${settings.address}`,
    },
    {
      label: facts.when,
      value: facts.whenValue,
    },
    {
      label: facts.admission,
      value: facts.admissionValue,
    },
    {
      label: permanent.iconCountLabel,
      value: permanent.iconCountValue
        .replace("{from}", String(page.iconCount.from))
        .replace("{to}", String(page.iconCount.to)),
    },
  ];

  const annualFactRows = annualActive
    ? [
        {
          label: annual.activeLabel,
          value: `„${latestAnnual.title}"`,
        },
        {
          label: annual.openUntilLabel,
          value: getAnnualOpenPeriodLabel(latestAnnual),
        },
      ]
    : [
        {
          label: annual.vernissageLabel,
          value: vernissage
            ? formatDateRange(vernissage, undefined, { withYear: true })
            : "[do uzupełnienia: data wernisażu]",
        },
        {
          label: annual.openUntilLabel,
          value: getAnnualOpenPeriodLabel(latestAnnual),
        },
        {
          label: annual.admissionLabel,
          value: annual.admissionValue,
        },
        {
          label: annual.onDisplayLabel,
          value: getAnnualIconCountLabel(latestAnnual),
        },
      ];

  const annualFooterLink = annualActive ? (
    latestAnnual.newsSlug ? (
      <TextLink href={`/aktualnosci/${latestAnnual.newsSlug}`}>
        {annual.vernissageNewsLink.replace("{year}", String(latestYear))}
      </TextLink>
    ) : (
      <TextLink href="/aktualnosci">
        {annual.vernissageNewsLink.replace("{year}", String(latestYear))}
      </TextLink>
    )
  ) : (
    <TextLink href="/wyklady">{annual.lecturesLink}</TextLink>
  );

  const annualPhotos = annualActive
    ? filterExistingPhotos(latestAnnual.photos)
    : filterExistingPhotos(archiveBlock?.photos ?? []);

  const previousExhibitions = allAnnual.map((exhibition) => ({
    seasonSlug: exhibition.seasonSlug,
    year: getAnnualExhibitionYear(exhibition.seasonSlug),
    title: exhibition.title,
    newsSlug: exhibition.newsSlug,
    photos: filterExistingPhotos(exhibition.photos),
  }));

  const toursMailtoHref = buildMailtoHref(enrollmentEmail, tours.mailtoSubject);
  const travelingMailtoHref = buildMailtoHref(enrollmentEmail, traveling.mailtoSubject);
  const travelingItems = getTravelingExhibitions();

  return (
    <SectionPageShell active={active} section="ikony" sectionActive={sectionActive}>
      <header className="mb-space-6">
        <p className="text-size-caption uppercase tracking-caption-wide text-text-tertiary mb-lectures-eyebrow-mb">
          {pageCopy.eyebrow}
        </p>
        <h1 className="font-serif text-size-h1-m md:text-size-h1 leading-tight text-text-h1 mb-space-5">
          {pageCopy.title}
        </h1>
        <p className="text-size-lead-m md:text-size-lead leading-body text-text-secondary max-w-measure-lead">
          {pageCopy.lead}
        </p>
        <ExhibitionPageNav />
      </header>

      <ExhibitionLightboxProvider>
        <ExhibitionSectionLayout
          sectionId={permanent.sectionId}
          eyebrow={permanent.eyebrow}
          heading={page.title}
          headingId="exhibition-permanent-heading"
          copy={
            <>
              {page.descriptionParagraphs.map((paragraph) => (
                <p key={paragraph} className="exhibition-section-copy mb-space-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </>
          }
          facts={
            <ExhibitionFactsPanel
              rows={permanentFactRows}
              footerLink={<TextLink href="/kontakt#dojazd">{facts.contactLink}</TextLink>}
            />
          }
          photos={
            <ExhibitionPhotoGrid
              photos={interiorPhotos}
              layout="pair"
              showCaptionNote
            />
          }
        />

        <ExhibitionSectionLayout
          sectionId={annual.sectionId}
          heading={annual.title}
          headingId="exhibition-annual-heading"
          copy={
            <>
              <p className="exhibition-section-copy mb-space-4">{annual.intro1}</p>
              <p className="exhibition-section-copy">{annual.intro2}</p>
            </>
          }
          facts={<ExhibitionFactsPanel rows={annualFactRows} footerLink={annualFooterLink} />}
          photos={
            <>
              {!annualActive && archiveBlock ? (
                <p className="exhibition-archive-label mb-space-4">
                  {previous.lastExhibitionLabel
                    .replace("{year}", String(archiveBlock.year))
                    .replace("{title}", archiveBlock.title)}
                </p>
              ) : null}
              <ExhibitionPhotoGrid photos={annualPhotos} layout="quad" maxCount={4} />
              {!annualActive && archiveBlock ? (
                <div className="exhibition-archive-footer">
                  <p className="exhibition-archive-note">
                    {annual.archivePhotosNote.replace("{year}", String(archiveBlock.year))}
                  </p>
                  {archiveBlock.newsSlug ? (
                    <TextLink href={`/aktualnosci/${archiveBlock.newsSlug}`}>
                      {annual.vernissageNewsLink.replace("{year}", String(archiveBlock.year))}
                    </TextLink>
                  ) : null}
                </div>
              ) : null}
            </>
          }
        />

        <ExhibitionToursSection mailtoHref={toursMailtoHref} />

        <ExhibitionPreviousSection exhibitions={previousExhibitions} />
      </ExhibitionLightboxProvider>

      <ExhibitionTravelingSection mailtoHref={travelingMailtoHref} items={travelingItems} />

      <footer className="exhibition-page-footer">
        <span className="exhibition-page-footer-label">{pageCopy.startHere}</span>
        <TextLink href="/ikony">{pageCopy.galleryLink}</TextLink>
        <TextLink href="/warsztaty">{pageCopy.workshopsLink}</TextLink>
      </footer>
    </SectionPageShell>
  );
}
