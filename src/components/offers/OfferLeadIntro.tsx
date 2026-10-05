import type { OfferLeadIntroSection } from "@/content/offers";
import { PageHeading } from "@/components/core/PageHeading";

export interface OfferLeadIntroProps {
  sections: OfferLeadIntroSection[];
}

export function OfferLeadIntro({ sections }: OfferLeadIntroProps) {
  return (
    <div className="mt-space-6 max-w-measure-prose space-y-space-7">
      {sections.map((section) => {
        const headingId = `offer-lead-intro-${section.heading.replace(/\s+/g, "-").toLowerCase()}`;

        return (
          <section key={section.heading} aria-labelledby={headingId}>
            <PageHeading level="section" id={headingId} className="mb-space-4">
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
