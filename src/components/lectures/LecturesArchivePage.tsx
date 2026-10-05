import { SeasonAccordion } from "@/components/content/SeasonAccordion";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import type { LoadedLectureSeason } from "@/content/lectures";
import { pl } from "@/i18n/pl";

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
      <h1 className="font-serif text-size-h1-m md:text-size-h1 leading-tight text-text-h1 mb-space-5">
        {pl.lectures.archiveHeading}
      </h1>
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
