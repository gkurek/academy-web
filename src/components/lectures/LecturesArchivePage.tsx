import { SeasonAccordion } from "@/components/content/SeasonAccordion";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { LecturesGalleryLink } from "@/components/lectures/LecturesGalleryLink";
import type { LoadedLectureSeason } from "@/content/lectures";
import type { Image as ContentImage } from "@/content/types";
import { pl } from "@/i18n/pl";
import { PageHeading } from "@/components/core/PageHeading";

export interface LecturesArchivePageProps {
  seasons: LoadedLectureSeason[];
  intro: string;
  galleryPhotos: ContentImage[];
  /** Route path — see SectionPageShellProps["path"]. */
  path: string;
}

export function LecturesArchivePage({
  seasons,
  intro,
  galleryPhotos,
  path,
}: LecturesArchivePageProps) {
  return (
    <SectionPageShell path={path}>
      <PageHeading level="page" className="mb-space-5">
        {pl.lectures.archiveHeading}
      </PageHeading>
      <div className="mb-space-6 flex flex-col items-start gap-space-3 md:flex-row md:items-end md:justify-between md:gap-space-6">
        <p className="text-size-lead-m md:text-size-lead leading-body text-text-secondary max-w-measure-lead">
          {intro}
        </p>
        <LecturesGalleryLink label={pl.lectures.archiveGalleryLink} photos={galleryPhotos} />
      </div>
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
