import { useId } from "react";

import type { SemesterItem } from "@/content/offers";
import { pl } from "@/i18n/pl";
import { PageHeading } from "@/components/core/PageHeading";
import { SemesterTile } from "@/components/content/SemesterTile";

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
      {/* Same heading gap as the MDX h2s of offer prose (.prose-offer > h2). */}
      <PageHeading level="section" id={headingId} className="mt-section-gap mb-space-4 first:mt-0">
        {pl.offers.semesterProgramHeading}
      </PageHeading>
      <p className="body-copy text-text-secondary mb-space-6">
        {pl.offers.semesterProgramIntro}
      </p>
      <div className="hairline-grid-2">
        {semesters.map((semester, index) => (
          <SemesterTile
            key={`${index}-${semester.title}`}
            semester={semester}
            numeral={ROMAN_NUMERALS[index] ?? String(index + 1)}
            ordinal={
              pl.offers.semesterTileHeadings[index] ??
              pl.offers.semesterTileFallback.replace("{n}", String(index + 1))
            }
          />
        ))}
      </div>
    </section>
  );
}
