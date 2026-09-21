import { Interview } from "@/components/text/Interview";
import { LearningForms } from "@/components/text/LearningForms";
import { TextPageShell } from "@/components/text/TextPageShell";
import { WorkshopGallerySection } from "@/components/text/WorkshopGallerySection";
import type { LoadedWorkshopPage } from "@/content/pages";
import { mainNav, sectionNav } from "@/navigation";

const slug = "pracownia";

const mainNavActive = mainNav.find((item) => item.href === "/o-akademii")!.label;
const sectionActive = sectionNav["o-akademii"].find((link) => link.href === `/${slug}`)!.label;

export interface WorkshopPageProps {
  page: LoadedWorkshopPage;
}

export function WorkshopPage({ page }: WorkshopPageProps) {
  const { title, lead, toc, learningForms, interview, curriculum, curriculumParagraphs, gallery } =
    page;

  return (
    <TextPageShell
      title={title}
      lead={lead}
      toc={toc}
      active={mainNavActive}
      section="o-akademii"
      sectionActive={sectionActive}
    >
      <section id="formy-nauki" className="workshop-section scroll-mt-space-6">
        <h2 className="workshop-section-heading">{learningForms.heading}</h2>
        <LearningForms rows={learningForms.rows} contact={learningForms.contact} />
      </section>

      <Interview heading={interview.heading} interview={interview} />

      <section id="czego-sie-uczymy" className="workshop-section scroll-mt-space-6">
        <h2 className="workshop-section-heading">{curriculum.heading}</h2>
        <div className="text-page-mdx">
          {curriculumParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      </section>

      <WorkshopGallerySection
        heading={gallery.heading}
        mobileCaption={gallery.mobileCaption}
        photos={gallery.photos}
      />
    </TextPageShell>
  );
}
