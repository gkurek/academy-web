import type { OfferLeadIntroSection } from "@/content/offers";

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
            <h2
              id={headingId}
              className="font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2 mb-space-4"
            >
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-size-body-lg leading-prose text-text-secondary mb-space-4 last:mb-0"
              >
                {paragraph}
              </p>
            ))}
          </section>
        );
      })}
    </div>
  );
}
