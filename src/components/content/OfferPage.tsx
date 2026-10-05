import type { ReactNode } from "react";

import { FactsBox } from "@/components/content/FactsBox";
import { MdxLink } from "@/components/content/MdxLink";
import { OfferContentProvider } from "@/components/content/OfferContentContext";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { getEnrollmentState, getOfferDateValues, type LoadedOffer } from "@/content/offers";
import type { OfferFacts } from "@/content/types";
import { pl } from "@/i18n/pl";
import { fillRequiredTemplate } from "@/lib/fillTemplate";
import type { SectionKey } from "@/navigation";

// Links are styled only in offer MDX (LY5); news, contact and articles keep their own `a` styles.
const offerMdxComponents = { a: MdxLink };

function getOfferEyebrow(kind: LoadedOffer["kind"], seasonLabel?: string): string | null {
  if (!seasonLabel) {
    return null;
  }

  if (kind === "kurs") {
    return pl.offers.eyebrowKurs.replace("{seasonLabel}", seasonLabel);
  }

  if (kind === "plener") {
    return pl.offers.eyebrowPlener.replace("{seasonLabel}", seasonLabel);
  }

  return null;
}

export interface OfferPageProps {
  offer: LoadedOffer;
  section: SectionKey;
  sectionActive: string;
  /** Main nav item to underline gold in the Header — read from navigation.ts. */
  active: string;
  quoteSlot?: ReactNode;
  afterBodySlot?: ReactNode;
  /** Extra heading + copy rendered in the left column, below leadSecondary — fills tall FactsBox columns. */
  leadExtraSlot?: ReactNode;
}

function EnrollmentSection({ facts, quoteSlot }: { facts: OfferFacts; quoteSlot?: ReactNode }) {
  const dateValues = getOfferDateValues(facts);
  const paragraphs = pl.offers.enrollmentByKind.kurs.paragraphs.map((paragraph) =>
    fillRequiredTemplate(paragraph, dateValues, "offers.enrollmentByKind.kurs"),
  );

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
            className="font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2 mb-space-5"
          >
            {pl.offers.enrollmentSectionTitle}
          </h2>
          {paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-size-body-lg leading-prose text-text-secondary max-w-measure-prose mb-space-4 last:mb-space-5"
            >
              {paragraph}
            </p>
          ))}
          <p className="text-size-caption leading-body text-text-tertiary max-w-measure-prose pt-space-5 border-t border-line-neutral">
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
  leadExtraSlot,
}: OfferPageProps) {
  const { Content, title, lead, leadSecondary, facts, kind, semesters, steps } = offer;
  const eyebrow = getOfferEyebrow(kind, facts.seasonLabel);
  const showEnrollment = kind === "kurs";
  const enrollmentQuoteSlot = showEnrollment ? quoteSlot : undefined;
  const trailingQuoteSlot = !showEnrollment ? quoteSlot : undefined;

  return (
    <SectionPageShell active={active} section={section} sectionActive={sectionActive}>
      {/* Single FactsBox instance: stacks below the lead column on mobile, sidebar on lg. */}
      <div className="grid grid-cols-1 lg:grid-cols-offer-main gap-space-6 lg:gap-offer-main-gap items-start mb-space-7">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="font-serif text-size-body text-accent-text mb-lectures-eyebrow-mb">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-serif text-size-h1-m md:text-size-h1 leading-tight text-text-h1 mb-space-5">
            {title}
          </h1>

          {lead && (
            <p className="text-size-lead-m md:text-size-lead leading-body text-text-secondary max-w-measure-lead mb-space-5">
              {lead}
            </p>
          )}

          {leadSecondary && (
            <p className="text-size-body-lg leading-prose text-text-secondary max-w-measure-prose">
              {leadSecondary}
            </p>
          )}

          {leadExtraSlot && <div className="mt-space-6">{leadExtraSlot}</div>}
        </div>

        <FactsBox facts={facts} kind={kind} enrollment={getEnrollmentState(offer)} />
      </div>

      <OfferContentProvider semesters={semesters} steps={steps}>
        <div className="offer-mdx">
          <Content components={offerMdxComponents} />
        </div>
      </OfferContentProvider>

      {afterBodySlot}

      {showEnrollment && <EnrollmentSection facts={facts} quoteSlot={enrollmentQuoteSlot} />}

      {trailingQuoteSlot && <div className="mt-space-8">{trailingQuoteSlot}</div>}
    </SectionPageShell>
  );
}
