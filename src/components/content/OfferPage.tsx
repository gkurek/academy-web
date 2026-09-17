import type { ReactNode } from "react";

import { FactsBox } from "@/components/content/FactsBox";
import { OfferContentProvider } from "@/components/content/OfferContentContext";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import type { LoadedOffer } from "@/content/offers";
import { pl } from "@/i18n/pl";
import type { SectionKey } from "@/navigation";

export interface OfferPageProps {
  offer: LoadedOffer;
  section: SectionKey;
  sectionActive: string;
  /** Main nav item to underline gold in the Header — read from navigation.ts. */
  active: string;
  quoteSlot?: ReactNode;
  afterBodySlot?: ReactNode;
}

function EnrollmentSection({ quoteSlot }: { quoteSlot?: ReactNode }) {
  const enrollment = pl.offers.enrollmentByKind.kurs;

  const hasQuoteColumn = Boolean(quoteSlot);

  return (
    <section
      aria-labelledby="offer-enrollment-heading"
      className="rule-gold-t mt-space-8 pt-space-7 pb-space-9"
    >
      <div
        className={
          hasQuoteColumn
            ? "grid grid-cols-1 lg:grid-cols-2 gap-offer-enrollment-gap items-start"
            : undefined
        }
      >
        <div>
          <h2
            id="offer-enrollment-heading"
            className="font-serif text-size-h2-m md:text-size-h2-sm leading-heading text-text-h2 mb-space-5"
          >
            {pl.offers.enrollmentSectionTitle}
          </h2>
          {enrollment.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-size-body-lg leading-loose text-text-secondary max-w-measure mb-space-4 last:mb-space-5"
            >
              {paragraph}
            </p>
          ))}
          <p className="text-size-caption leading-body text-text-tertiary max-w-measure pt-space-5 border-t border-line-neutral">
            {pl.offers.legalNote}
          </p>
        </div>
        {quoteSlot}
      </div>
    </section>
  );
}

export function OfferPage({
  offer,
  section,
  sectionActive,
  active,
  quoteSlot,
  afterBodySlot,
}: OfferPageProps) {
  const { Content, title, lead, leadSecondary, facts, kind, semesters, steps } = offer;
  const showEnrollment = kind === "kurs";
  const enrollmentQuoteSlot = showEnrollment ? quoteSlot : undefined;
  const trailingQuoteSlot = !showEnrollment ? quoteSlot : undefined;

  return (
    <SectionPageShell active={active} section={section} sectionActive={sectionActive}>
      <div className="grid grid-cols-1 lg:grid-cols-offer-main gap-offer-main-gap items-start mb-space-7">
        <div className="min-w-0">
          <h1 className="font-serif text-size-h1-m md:text-size-h1 leading-tight text-text-h1 mb-space-5">
            {title}
          </h1>

          {lead && (
            <p className="text-size-lead-m md:text-size-lead leading-body text-text-secondary max-w-measure mb-space-5">
              {lead}
            </p>
          )}

          {leadSecondary && (
            <p className="text-size-offer-intro-secondary leading-intro-secondary text-text-secondary max-w-measure">
              {leadSecondary}
            </p>
          )}

          <div className="mt-space-6 lg:hidden">
            <FactsBox facts={facts} kind={kind} />
          </div>
        </div>

        <div className="hidden lg:block">
          <FactsBox facts={facts} kind={kind} />
        </div>
      </div>

      <OfferContentProvider semesters={semesters} steps={steps}>
        <div className="offer-mdx">
          <Content />
        </div>
      </OfferContentProvider>

      {afterBodySlot}

      {showEnrollment && <EnrollmentSection quoteSlot={enrollmentQuoteSlot} />}

      {trailingQuoteSlot && <div className="mt-space-8">{trailingQuoteSlot}</div>}
    </SectionPageShell>
  );
}
