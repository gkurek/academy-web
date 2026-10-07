import { useId, type ReactNode } from "react";

import { FactsBox } from "@/components/content/FactsBox";
import { MdxLink } from "@/components/content/MdxLink";
import { SemesterProgram } from "@/components/content/SemesterProgram";
import { StepList } from "@/components/content/StepList";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { OfferLeadExtra } from "@/components/offers/OfferLeadExtra";
import { OfferLeadIntro } from "@/components/offers/OfferLeadIntro";
import { OfferQuote } from "@/components/offers/OfferQuote";
import { getEnrollmentState, getOfferDateValues, type LoadedOffer } from "@/content/offers";
import type { OfferFacts } from "@/content/types";
import { pl } from "@/i18n/pl";
import { fillRequiredTemplate } from "@/lib/fillTemplate";
import { PageHeading } from "@/components/core/PageHeading";
import { Prose } from "@/components/core/Prose";

// Links are styled only in offer MDX (LY5); news, contact and articles keep their own `a` styles.
const offerMdxLinks = { a: MdxLink };

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
  /** Route path — see SectionPageShellProps["path"]. */
  path: string;
  /** Replaces the quote from the offer's data (`quote` → OfferQuote), e.g. plener testimonials. */
  quoteSlot?: ReactNode;
  afterBodySlot?: ReactNode;
  /** See SectionPageShellProps["footerBand"]. */
  footerBand?: ReactNode;
}

type EnrollmentCopy = (typeof pl.offers.enrollmentByKind)[keyof typeof pl.offers.enrollmentByKind];

/** Enrollment copy of an offer kind; kinds without an entry have no "how to enroll" section. */
function getEnrollmentCopy(kind: LoadedOffer["kind"]): EnrollmentCopy | undefined {
  return kind in pl.offers.enrollmentByKind
    ? pl.offers.enrollmentByKind[kind as keyof typeof pl.offers.enrollmentByKind]
    : undefined;
}

function EnrollmentSection({
  facts,
  copy,
  quoteSlot,
}: {
  facts: OfferFacts;
  copy: EnrollmentCopy;
  quoteSlot?: ReactNode;
}) {
  const headingId = useId();
  const values = { ...getOfferDateValues(facts), enrollmentEmail: facts.enrollmentEmail };
  const paragraphs = copy.paragraphs.map((paragraph) =>
    fillRequiredTemplate(paragraph, values, "offers.enrollmentByKind"),
  );

  const copyBlock = (
    <>
      <PageHeading level="section" id={headingId} className="mb-heading-gap">
        {pl.offers.enrollmentSectionTitle}
      </PageHeading>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="body-copy text-text-body mb-space-5">
          {paragraph}
        </p>
      ))}
      <p className="text-size-caption leading-body text-text-tertiary max-w-measure-prose pt-space-5 border-t border-line-neutral">
        {pl.offers.legalNote}
      </p>
    </>
  );

  return (
    <section
      aria-labelledby={headingId}
      className={
        quoteSlot
          ? "mt-section-gap-tight md:mt-section-gap md:pt-space-7"
          : "mt-section-gap pt-space-7"
      }
    >
      {quoteSlot ? (
        <div className="offer-enrollment-grid gap-space-6 lg:gap-offer-main-gap">
          {quoteSlot}
          <div className="min-w-0">{copyBlock}</div>
        </div>
      ) : (
        copyBlock
      )}
    </section>
  );
}

export function OfferPage({ offer, path, quoteSlot, afterBodySlot, footerBand }: OfferPageProps) {
  const { Content, title, lead, leadSecondary, facts, kind, semesters, steps, leadIntro, leadExtra, quote } = offer;
  const eyebrow = getOfferEyebrow(kind, facts.seasonLabel);
  const enrollmentCopy = getEnrollmentCopy(kind);
  const offerQuote =
    quoteSlot ??
    (quote ? <OfferQuote quote={quote.quote} author={quote.author} role={quote.role} image={quote.image} /> : undefined);
  /** Single featured quote beside enrollment (kurs); grids and offers without enrollment stay full width below. */
  const enrollmentQuoteSlot = enrollmentCopy && offerQuote && !quoteSlot ? offerQuote : undefined;
  const trailingQuoteSlot = offerQuote && !enrollmentQuoteSlot ? offerQuote : undefined;

  return (
    <SectionPageShell path={path} footerBand={footerBand}>
      {/* Single FactsBox instance: stacks below the lead column on mobile, sidebar on lg. */}
      <div className="grid grid-cols-1 lg:grid-cols-offer-main gap-space-6 lg:gap-offer-main-gap items-start mb-section-gap-tight">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="font-serif text-size-body text-accent-text mb-lectures-eyebrow-mb">
              {eyebrow}
            </p>
          ) : null}
          <PageHeading level="page" className="mb-space-5">
            {title}
          </PageHeading>

          {lead && (
            <p className="text-size-lead-m md:text-size-lead leading-body text-text-secondary max-w-measure-lead mb-space-5">
              {lead}
            </p>
          )}

          {leadSecondary && (
            <p className="body-copy text-text-secondary">
              {leadSecondary}
            </p>
          )}

          {/* Extra copy below leadSecondary — fills the column beside a tall FactsBox. */}
          {(leadIntro || leadExtra) && (
            <div className="mt-space-6">
              {leadIntro && <OfferLeadIntro sections={leadIntro} />}
              {leadExtra && <OfferLeadExtra leadExtra={leadExtra} />}
            </div>
          )}
        </div>

        <FactsBox facts={facts} kind={kind} enrollment={getEnrollmentState(offer)} />
      </div>

      <Prose variant="offer">
        <Content
          components={{
            ...offerMdxLinks,
            SemesterProgram: () => <SemesterProgram semesters={semesters} />,
            StepList: () => <StepList steps={steps} />,
          }}
        />
      </Prose>

      {afterBodySlot}

      {/* Offer ending (V2-01): kurs — enrollment + quote in sidebar; plener — quote grid; zamówienie — footer band. */}
      {enrollmentCopy && (
        <EnrollmentSection facts={facts} copy={enrollmentCopy} quoteSlot={enrollmentQuoteSlot} />
      )}

      {trailingQuoteSlot && <div className="mt-section-gap">{trailingQuoteSlot}</div>}
    </SectionPageShell>
  );
}
