import { SeasonAccordion } from "@/components/content/SeasonAccordion";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import type { LoadedLectureSeason } from "@/content/lectures";
import { pl } from "@/i18n/pl";
import { PageHeading } from "@/components/core/PageHeading";

export interface LecturesArchivePageProps {
  seasons: LoadedLectureSeason[];
  intro: string;
  /** Route path — see SectionPageShellProps["path"]. */
  path: string;
}

export function LecturesArchivePage({
  seasons,
  intro,
  path,
}: LecturesArchivePageProps) {
  return (
    <SectionPageShell path={path}>
      <PageHeading level="page" className="mb-space-5">
        {pl.lectures.archiveHeading}
      </PageHeading>
      <p className="text-size-lead-m md:text-size-lead leading-body text-text-secondary max-w-measure-lead mb-space-6">
        {intro}
      </p>
      <SeasonAccordion
        seasons={seasons.map(({ slug, label, cycleTitle, lectures }) => ({
          slug,
          label,
          cycleTitle,
          lectures,
        }))}
      />
    </SectionPageShell>
  );
}
