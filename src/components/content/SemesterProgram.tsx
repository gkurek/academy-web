import { useId } from "react";

import type { SemesterItem } from "@/content/offers";
import { pl } from "@/i18n/pl";
import { PageHeading } from "@/components/core/PageHeading";

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI"] as const;

export interface SemesterProgramProps {
  semesters: SemesterItem[];
}

export function SemesterProgram({ semesters }: SemesterProgramProps) {
  const headingId = useId();
  if (semesters.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={headingId} className="not-prose">
      <PageHeading level="section" id={headingId} className="mt-section-gap mb-heading-gap first:mt-0">
        {pl.offers.semesterProgramHeading}
      </PageHeading>
      <p className="text-size-body leading-body text-text-secondary mb-space-6">
        {pl.offers.semesterProgramIntro}
      </p>
      <div className="hairline-grid-2">
        {semesters.map((semester, index) => (
          <article
            key={`${index}-${semester.title}`}
            className="bg-surface-tile flex gap-offer-semester-gap-m md:gap-offer-semester-gap px-offer-semester-x-m py-offer-semester-y-m md:px-offer-semester-x md:py-offer-semester-y"
          >
            <div
              aria-hidden="true"
              className="font-serif text-size-offer-semester-num-m md:text-size-offer-semester-num leading-none text-accent-text shrink-0 w-offer-semester-num-width-m md:w-offer-semester-num-width text-left"
            >
              {ROMAN_NUMERALS[index] ?? String(index + 1)}
            </div>
            <div className="min-w-0">
              <PageHeading level="sub" className="mb-space-2">
                {pl.offers.semesterTileHeadings[index] ?? pl.offers.semesterTileFallback.replace("{n}", String(index + 1))}
              </PageHeading>
              <p className="text-size-body leading-body text-text-secondary mb-space-2">{semester.title}</p>
              {semester.topics && semester.topics.length > 0 ? (
                <ul className="text-size-body leading-body text-text-tertiary list-disc ps-space-5 space-y-space-1">
                  {semester.topics.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
              ) : semester.body ? (
                <p className="text-size-body leading-body text-text-tertiary">{semester.body}</p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
