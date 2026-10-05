import { FactsBox } from "@/components/content/FactsBox";
import { LectureList } from "@/components/content/LectureList";
import { TextLink } from "@/components/core/TextLink";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import type { EnrollmentState } from "@/content/enrollment";
import type { LoadedLectureSeason } from "@/content/lectures";
import type { OfferFacts } from "@/content/types";
import { pl } from "@/i18n/pl";
import { PageHeading } from "@/components/core/PageHeading";

export interface LecturesHubPageProps {
  season: LoadedLectureSeason;
  archiveIntro: string;
  facts: OfferFacts;
  enrollment: EnrollmentState;
  /** Route path — see SectionPageShellProps["path"]. */
  path: string;
}

export function LecturesHubPage({
  season,
  archiveIntro,
  facts,
  enrollment,
  path,
}: LecturesHubPageProps) {
  const eyebrow = pl.lectures.eyebrow.replace("{seasonLabel}", season.label);
  const programLead = pl.lectures.programLead
    .replace("{count}", String(season.lectures.length))
    .replace("{seasonLabel}", season.label);

  return (
    <SectionPageShell path={path}>
      <div
        id="zapisy"
        className="scroll-mt-space-6 grid grid-cols-1 lg:grid-cols-offer-main gap-space-6 lg:gap-offer-main-gap items-start mb-section-gap-tight"
      >
        <div className="min-w-0">
          <p className="font-serif text-size-lectures-eyebrow text-accent-text mb-lectures-eyebrow-mb">
            {eyebrow}
          </p>
          <PageHeading level="page" className="mb-space-5">
            {season.cycleTitle}
          </PageHeading>

          {season.intro ? (
            <p className="text-size-lead-m md:text-size-lead leading-body text-text-secondary max-w-measure-lead mb-space-5">
              {season.intro}
            </p>
          ) : null}

          {season.introSecondary ? (
            <p className="body-copy text-text-secondary">
              {season.introSecondary}
            </p>
          ) : null}
        </div>

        <FactsBox facts={facts} kind="wyklady" enrollment={enrollment} />
      </div>

      <section aria-labelledby="lectures-program-heading">
        <PageHeading level="section" id="lectures-program-heading" className="mb-heading-gap">
          {pl.lectures.programHeading}
        </PageHeading>
        <p className="text-size-body leading-body text-text-secondary mb-lectures-program-lead-mb max-w-measure-prose">
          {programLead}
        </p>
        <LectureList items={season.lectures} />
      </section>

      <section aria-labelledby="lectures-archive-heading" className="mt-section-gap">
        <div className="flex flex-wrap items-baseline justify-between gap-x-space-4 gap-y-space-2 mb-heading-gap">
          <PageHeading level="section" id="lectures-archive-heading">
            {pl.lectures.archiveHeading}
          </PageHeading>
          <TextLink href="/wyklady/archiwum" className="text-size-body">
            {pl.lectures.archiveFullLink}
          </TextLink>
        </div>
        <p className="text-size-body leading-body text-text-secondary max-w-measure-prose">
          {archiveIntro}
        </p>
      </section>
    </SectionPageShell>
  );
}
