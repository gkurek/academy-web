import { Button } from "@/components/core/Button";
import { PageHeading } from "@/components/core/PageHeading";
import { TextLink } from "@/components/core/TextLink";
import { FeaturedIconsGallery } from "@/components/home/FeaturedIconsGallery";
import type { IconWork } from "@/content/types";
import { pl } from "@/i18n/pl";

export interface WorkshopsStudentIconsProps {
  icons: IconWork[];
  intro: string;
}

const galleryHref = "/ikony#uczniowie";

/** „Ikony naszych uczniów” on /warsztaty — same layout as „Wybrane ikony” on the home page. */
export function WorkshopsStudentIcons({ icons, intro }: WorkshopsStudentIconsProps) {
  const { studentIconsHeading, studentIconsLink } = pl.workshopsHub;

  return (
    <section aria-labelledby="workshops-student-icons-heading">
      <div className="flex items-baseline justify-between mb-space-2">
        <PageHeading level="section" id="workshops-student-icons-heading">
          {studentIconsHeading}
        </PageHeading>
        <TextLink href={galleryHref} className="hidden md:inline text-size-body">
          {studentIconsLink}
        </TextLink>
      </div>
      <p className="body-copy text-text-secondary mb-heading-gap">{intro}</p>
      <FeaturedIconsGallery icons={icons} />
      <Button href={galleryHref} variant="secondary" size="lg" block className="mt-space-5 md:hidden">
        {studentIconsLink}
      </Button>
    </section>
  );
}
