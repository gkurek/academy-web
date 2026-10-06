import type { OfferLeadIntroSection } from "@/content/offers";
import { PageHeading } from "@/components/core/PageHeading";

export interface OfferLeadIntroProps {
  sections: OfferLeadIntroSection[];
}

export function OfferLeadIntro({ sections }: OfferLeadIntroProps) {
  return (
    <div className="mt-space-6 max-w-measure-prose space-y-space-7">
      {/* First block is the section (H2); the rest are its subsections (H3), like the course "Dalsza droga" (V2-06). */}
      {sections.map((section, sectionIndex) => {
        const headingId = `offer-lead-intro-${section.heading.replace(/\s+/g, "-").toLowerCase()}`;

        return (
          <section key={section.heading} aria-labelledby={headingId}>
            <PageHeading level={sectionIndex === 0 ? "section" : "sub"} id={headingId} className="mb-space-4">
              {section.heading}
            </PageHeading>
            {section.paragraphs.map((paragraph, index) => (
              <p key={paragraph} className={index > 0 ? "body-copy text-text-body mt-space-5" : "body-copy text-text-body"}>
                {paragraph}
              </p>
            ))}
          </section>
        );
      })}
    </div>
  );
}
