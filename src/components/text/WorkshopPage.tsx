import { Interview } from "@/components/text/Interview";
import { LearningForms } from "@/components/text/LearningForms";
import { TextPageShell } from "@/components/text/TextPageShell";
import { WorkshopGallerySection } from "@/components/text/WorkshopGallerySection";
import type { LoadedWorkshopPage } from "@/content/pages";
import { PageHeading } from "@/components/core/PageHeading";
import { Prose } from "@/components/core/Prose";

export interface WorkshopPageProps {
  page: LoadedWorkshopPage;
  /** Route path — see SectionPageShellProps["path"]. */
  path: string;
}

export function WorkshopPage({ page, path }: WorkshopPageProps) {
  const { title, lead, toc, learningForms, interview, curriculum, curriculumParagraphs, gallery } =
    page;

  return (
    <TextPageShell
      title={title}
      lead={lead}
      toc={toc}
      path={path}
    >
      <section id="formy-nauki" className="workshop-section scroll-mt-space-6">
        <PageHeading level="section" className="mb-heading-gap">{learningForms.heading}</PageHeading>
        <LearningForms rows={learningForms.rows} contact={learningForms.contact} />
      </section>

      <Interview heading={interview.heading} interview={interview} />

      <section id="czego-sie-uczymy" className="workshop-section scroll-mt-space-6">
        <PageHeading level="section" className="mb-heading-gap">{curriculum.heading}</PageHeading>
        <Prose variant="text">
          {curriculumParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </Prose>
      </section>

      <WorkshopGallerySection
        heading={gallery.heading}
        mobileCaption={gallery.mobileCaption}
        photos={gallery.photos}
      />
    </TextPageShell>
  );
}
