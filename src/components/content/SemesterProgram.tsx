"use client";

import { pl } from "@/i18n/pl";

import { useOfferContent } from "./OfferContentContext";

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI"] as const;

export function SemesterProgram() {
  const { semesters } = useOfferContent();

  if (semesters.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="semester-program-heading" className="not-prose">
      <h2
        id="semester-program-heading"
        className="font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2 mt-space-8 mb-space-2 first:mt-0"
      >
        {pl.offers.semesterProgramHeading}
      </h2>
      <p className="text-size-body leading-body text-text-secondary mb-space-6">
        {pl.offers.semesterProgramIntro}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-hairline-gap bg-line-gold">
        {semesters.map((semester, index) => (
          <article
            key={semester.title}
            className="bg-surface-tile flex gap-offer-semester-gap-m md:gap-offer-semester-gap px-offer-semester-x-m py-offer-semester-y-m md:px-offer-semester-x md:py-offer-semester-y"
          >
            <div
              aria-hidden="true"
              className="font-serif text-size-offer-semester-num-m md:text-size-offer-semester-num leading-none text-accent-text shrink-0 w-offer-semester-num-width-m md:w-offer-semester-num-width text-left"
            >
              {ROMAN_NUMERALS[index] ?? String(index + 1)}
            </div>
            <div className="min-w-0">
              <h3 className="font-serif text-size-role-row-title-m md:text-size-role-row-title leading-heading text-text-list-title mb-space-2">
                {semester.title}
              </h3>
              <p className="text-size-body leading-body text-text-tertiary">{semester.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
