import { Button } from "@/components/core/Button";
import { TextLink } from "@/components/core/TextLink";
import { ExhibitionAnnualTiles } from "@/components/exhibition/ExhibitionAnnualTiles";
import { ExhibitionFactsPanel } from "@/components/exhibition/ExhibitionFactsPanel";
import { ExhibitionHashScroll } from "@/components/exhibition/ExhibitionHashScroll";
import { ExhibitionFrame } from "@/components/exhibition/ExhibitionFrame";
import { ExhibitionLightboxProvider } from "@/components/exhibition/ExhibitionLightboxProvider";
import { ExhibitionNowNextBlock } from "@/components/exhibition/ExhibitionNowNext";
import { ExhibitionPageNav } from "@/components/exhibition/ExhibitionPageNav";
import {
  ExhibitionToursSection,
  ExhibitionTravelingSection,
} from "@/components/exhibition/ExhibitionToursSection";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import {
  getAnnualExhibitionYear,
  getExhibitionNowNext,
  getExhibitionPage,
  getFirstAnnualExhibitionYear,
  getLastFinishedAnnualExhibition,
  getLatestAnnualExhibition,
  getLatestAnnualExhibitionWithPhotos,
  isAnnualExhibitionActive,
  resolveAnnualVernissage,
} from "@/content/exhibition";
import { getLectureSeasonShortTheme } from "@/content/lectures";
import { getSiteSettings } from "@/content/settings";
import { pl } from "@/i18n/pl";
import { buildMailtoHref } from "@/lib/mailto";
import { filterExistingPhotos } from "@/lib/mediaFileExists";
import { formatPolishMonthYearLocative } from "@/lib/polishMonth";

export interface ExhibitionPageProps {
  active: string;
  sectionActive: string;
}

export function ExhibitionPage({ active, sectionActive }: ExhibitionPageProps) {
  const page = getExhibitionPage();
  const settings = getSiteSettings();
  const latestAnnual = getLatestAnnualExhibition();
  const annualActive = isAnnualExhibitionActive(latestAnnual);
  const lastFinished = getLastFinishedAnnualExhibition();
  const latestWithPhotos = getLatestAnnualExhibitionWithPhotos();
  const nowNext = getExhibitionNowNext();
  const {
    page: pageCopy,
    permanent,
    annual,
    facts,
    frames,
    tours,
    traveling,
  } = pl.exhibition;
  const enrollmentEmail = settings.emails[0]?.address ?? "akademiaikony@gmail.com";
  const toursMailtoHref = buildMailtoHref(enrollmentEmail, tours.mailtoSubject);
  const travelingMailtoHref = buildMailtoHref(enrollmentEmail, traveling.mailtoSubject);

  const annualFactRows = [
    { label: facts.where, value: facts.whereValue },
    { label: annual.facts.when, value: annual.facts.whenValue },
    { label: annual.facts.vernissage, value: annual.facts.vernissageValue },
    { label: annual.facts.onDisplay, value: annual.facts.onDisplayValue },
    { label: annual.facts.admission, value: annual.facts.admissionValue },
  ];

  const permanentFactRows = [
    { label: facts.where, value: facts.whereValue },
    { label: permanent.facts.when, value: permanent.facts.whenValue },
    { label: permanent.facts.hours, value: permanent.facts.hoursValue },
    {
      label: permanent.facts.onDisplay,
      value: permanent.facts.onDisplayValue
        .replace("{from}", String(page.iconCount.from))
        .replace("{to}", String(page.iconCount.to)),
    },
    { label: permanent.facts.admission, value: permanent.facts.admissionValue },
  ];

  const titleSource = annualActive ? latestAnnual : lastFinished;
  const titleSentence = titleSource
    ? (annualActive ? annual.titleSentenceCurrent : annual.titleSentencePast)
        .replace("{year}", String(getAnnualExhibitionYear(titleSource.seasonSlug)))
        .replace("{theme}", getLectureSeasonShortTheme(titleSource.seasonSlug))
    : "";

  const vernissage = resolveAnnualVernissage(latestAnnual);
  const monthYear = vernissage ? formatPolishMonthYearLocative(vernissage) : "";
  const scheduleNext =
    monthYear.length > 0
      ? annual.scheduleNext.replace("{monthYear}", monthYear)
      : annual.scheduleNextMissing;

  const annualPhotos = filterExistingPhotos(latestAnnual.photos ?? []);
  const tilesCaption =
    latestWithPhotos && (latestWithPhotos.photos?.length ?? 0) > 0
      ? annual.tilesCaption
          .replace("{year}", String(getAnnualExhibitionYear(latestWithPhotos.seasonSlug)))
          .replace("{count}", String(latestWithPhotos.photos?.length ?? 0))
      : undefined;

  const heroImage = page.heroImage ? filterExistingPhotos([page.heroImage])[0] : undefined;
  const permanentImage = page.permanentImage
    ? filterExistingPhotos([page.permanentImage])[0]
    : undefined;
  const permanentImage2 = page.permanentImage2
    ? filterExistingPhotos([page.permanentImage2])[0]
    : undefined;
  const closingImage = page.closingImage ? filterExistingPhotos([page.closingImage])[0] : undefined;

  return (
    <SectionPageShell active={active} section="ikony" sectionActive={sectionActive}>
      <ExhibitionHashScroll>
      <header>
        <div className="exhibition-hero-grid">
          <p
            className="exhibition-hero-grid__eyebrow text-size-caption uppercase tracking-caption-wide text-text-tertiary"
          >
            {pageCopy.eyebrow}
          </p>
          <h1
            className="exhibition-hero-grid__h1 font-serif text-size-h1-m md:text-size-h1 leading-tight text-text-h1"
          >
            {pageCopy.title}
          </h1>
          <p
            className="exhibition-hero-grid__lead text-size-lead-m md:text-size-lead leading-body text-text-secondary max-w-measure-lead"
          >
            {pageCopy.lead}
          </p>
          <ExhibitionNowNextBlock state={nowNext} className="exhibition-hero-grid__now" />
          <ExhibitionPageNav className="exhibition-hero-grid__nav" />
        </div>
      </header>

      <ExhibitionLightboxProvider>
        <div className="exhibition-hero-frame mb-space-6">
          <ExhibitionFrame
            image={heroImage}
            aspect="wide"
            placeholderLabel={frames.heroWide}
          />
        </div>

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
                {frames.annualHeroEyebrow}
              </p>
              <h2
                id="exhibition-annual-heading"
                className="exhibition-section-h2 font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2"
              >
                {annual.title}
              </h2>
              <p className="exhibition-section-copy">
                {titleSentence ? `${annual.intro1} ${titleSentence}` : annual.intro1}
              </p>
              <p className="exhibition-section-copy">{annual.intro3}</p>
              <p className="exhibition-section-copy">
                {annual.scheduleSince.replace("{firstYear}", String(getFirstAnnualExhibitionYear()))}{" "}
                {scheduleNext}
              </p>
              <p className="exhibition-section-copy">
                <TextLink href="/aktualnosci">{annual.photoArchiveLink}</TextLink>
              </p>
            </div>
            <div className="exhibition-section-grid__facts min-w-0">
              <ExhibitionFactsPanel
                rows={annualFactRows}
                footerLink={
                  <Button href="/wyklady" variant="secondary" block size="lg">
                    {annual.facts.lecturesProgramLink}
                  </Button>
                }
              />
            </div>
          </div>

          <ExhibitionAnnualTiles
            photos={annualPhotos}
            placeholderLabels={frames.tilePlaceholders}
            caption={tilesCaption}
          />
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
                {frames.permanentEyebrow}
              </p>
              <h2
                id="exhibition-permanent-heading"
                className="exhibition-section-h2 font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2"
              >
                {page.title}
              </h2>
              {page.descriptionParagraphs.map((paragraph) => (
                <p key={paragraph} className="exhibition-section-copy">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="exhibition-permanent-layout__media">
              <ExhibitionFrame
                image={permanentImage}
                aspect="tilePairLead"
                placeholderLabel={frames.permanentStandard}
              />
              <ExhibitionFrame
                image={permanentImage2}
                aspect="tile"
                placeholderLabel={frames.permanentStandard2}
              />
            </div>
          </div>
        </section>

        <ExhibitionToursSection mailtoHref={toursMailtoHref} />

        <ExhibitionTravelingSection
          mailtoHref={travelingMailtoHref}
          places={page.travelingPlaces}
        />

        <div className="exhibition-section exhibition-closing-frame">
          <ExhibitionFrame
            image={closingImage}
            aspect="wide"
            placeholderLabel={frames.closingWide}
          />
        </div>
      </ExhibitionLightboxProvider>

      <footer className="exhibition-page-footer">
        <span className="exhibition-page-footer-label">{pageCopy.startHere}</span>
        <TextLink href="/ikony">{pageCopy.galleryLink}</TextLink>
        <TextLink href="/warsztaty">{pageCopy.workshopsLink}</TextLink>
      </footer>
      </ExhibitionHashScroll>
    </SectionPageShell>
  );
}
