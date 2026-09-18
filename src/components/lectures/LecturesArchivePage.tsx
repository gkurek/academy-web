import { SeasonAccordion } from "@/components/content/SeasonAccordion";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import type { LoadedLectureSeason } from "@/content/lectures";
import { pl } from "@/i18n/pl";
import type { SectionKey } from "@/navigation";

export interface LecturesArchivePageProps {
  seasons: LoadedLectureSeason[];
  intro: string;
  section: SectionKey;
  sectionActive: string;
  active: string;
}

export function LecturesArchivePage({
  seasons,
  intro,
  section,
  sectionActive,
  active,
}: LecturesArchivePageProps) {
  return (
    <SectionPageShell active={active} section={section} sectionActive={sectionActive}>
      <h1 className="font-serif text-size-h1-m md:text-size-h1 leading-tight text-text-h1 mb-space-5">
        {pl.lectures.archiveHeading}
      </h1>
      <p className="text-size-lead-m md:text-size-lead leading-body text-text-secondary mb-space-6">
        {intro}
      </p>
      <SeasonAccordion seasons={seasons} />
    </SectionPageShell>
  );
}
