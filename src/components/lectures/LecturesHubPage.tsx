import { FactsBox } from "@/components/content/FactsBox";
import { LectureList } from "@/components/content/LectureList";
import { TextLink } from "@/components/core/TextLink";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import type { LoadedLectureSeason } from "@/content/lectures";
import type { OfferFacts } from "@/content/types";
import { pl } from "@/i18n/pl";
import type { SectionKey } from "@/navigation";

export interface LecturesHubPageProps {
  season: LoadedLectureSeason;
  archiveIntro: string;
  facts: OfferFacts;
  section: SectionKey;
  sectionActive: string;
  active: string;
}

export function LecturesHubPage({
  season,
  archiveIntro,
  facts,
  section,
  sectionActive,
  active,
}: LecturesHubPageProps) {
  const eyebrow = pl.lectures.eyebrow.replace("{seasonLabel}", season.label);
  const programLead = pl.lectures.programLead
    .replace("{count}", String(season.lectures.length))
    .replace("{seasonLabel}", season.label);

  return (
    <SectionPageShell active={active} section={section} sectionActive={sectionActive}>
      <div
        id="zapisy"
        className="scroll-mt-space-6 grid grid-cols-1 lg:grid-cols-offer-main gap-offer-main-gap items-start mb-space-7"
      >
        <div className="min-w-0">
          <p className="font-serif text-size-lectures-eyebrow text-accent mb-lectures-eyebrow-mb">
            {eyebrow}
          </p>
          <h1 className="font-serif text-size-h1-m md:text-size-h1 leading-tight text-text-h1 mb-space-5">
            {season.cycleTitle}
          </h1>

          {season.intro ? (
            <p className="text-size-lead-m md:text-size-lead leading-body text-text-secondary max-w-measure mb-space-5">
              {season.intro}
            </p>
          ) : null}

          {season.introSecondary ? (
            <p className="text-size-offer-intro-secondary leading-intro-secondary text-text-secondary max-w-measure">
              {season.introSecondary}
            </p>
          ) : null}

          <div className="mt-space-6 lg:hidden">
            <FactsBox facts={facts} kind="wyklady" />
          </div>
        </div>

        <div className="hidden lg:block">
          <FactsBox facts={facts} kind="wyklady" />
        </div>
      </div>

      <section aria-labelledby="lectures-program-heading">
        <h2
          id="lectures-program-heading"
          className="font-serif text-size-h2-m md:text-size-h2 leading-heading text-text-h2 mb-lectures-program-heading-mb"
        >
          {pl.lectures.programHeading}
        </h2>
        <p className="text-size-body leading-body text-text-secondary mb-lectures-program-lead-mb max-w-measure">
          {programLead}
        </p>
        <LectureList items={season.lectures} />
      </section>

      <section aria-labelledby="lectures-archive-heading" className="pt-lectures-archive-section-pt">
        <div className="flex flex-wrap items-baseline justify-between gap-x-space-4 gap-y-space-2 mb-space-2">
          <h2
            id="lectures-archive-heading"
            className="font-serif text-size-h2-m md:text-size-h2 leading-heading text-text-h2"
          >
            {pl.lectures.archiveHeading}
          </h2>
          <TextLink href="/wyklady/archiwum" className="text-size-body">
            {pl.lectures.archiveFullLink}
          </TextLink>
        </div>
        <p className="text-size-body leading-body text-text-secondary max-w-measure">
          {archiveIntro}
        </p>
      </section>
    </SectionPageShell>
  );
}
