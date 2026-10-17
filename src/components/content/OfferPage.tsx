import { Fragment, useId, type ReactNode } from "react";

import { FactsBox } from "@/components/content/FactsBox";
import { MdxLink } from "@/components/content/MdxLink";
import { SemesterProgram } from "@/components/content/SemesterProgram";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { OfferClosingCta } from "@/components/offers/OfferClosingCta";
import { OfferLeadExtra } from "@/components/offers/OfferLeadExtra";
import { OfferQuote } from "@/components/offers/OfferQuote";
import {
  getEnrollmentState,
  getOfferDateValues,
  isCourseSeasonRunning,
  type LoadedOffer,
} from "@/content/offers";
import type { OfferFacts } from "@/content/types";
import { pl } from "@/i18n/pl";
import { fillRequiredTemplate } from "@/lib/fillTemplate";
import { getEnrollmentMailtoHref } from "@/lib/mailto";
import { PageHeading } from "@/components/core/PageHeading";
import { Prose } from "@/components/core/Prose";
import { TextLink } from "@/components/core/TextLink";

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
  /** Repeats the enrollment CTA at the end of the page (OfferClosingCta); plener only for now. */
  closingCta?: boolean;
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
  mailtoHref,
  quoteSlot,
}: {
  facts: OfferFacts;
  copy: EnrollmentCopy;
  mailtoHref: string;
  quoteSlot?: ReactNode;
}) {
  const headingId = useId();
  const values = getOfferDateValues(facts);
  // Split on {enrollmentEmail} first so the address can be rendered as a link between the parts.
  const paragraphs = copy.paragraphs.map((paragraph) =>
    paragraph
      .split("{enrollmentEmail}")
      .map((part) => fillRequiredTemplate(part, values, "offers.enrollmentByKind")),
  );

  const copyBlock = (
    <>
      <PageHeading level="section" id={headingId} className="mb-space-4">
        {pl.offers.enrollmentSectionTitle}
      </PageHeading>
      {paragraphs.map((parts) => (
        <p key={parts.join("")} className="body-copy text-text-secondary mb-space-4 last:mb-0">
          {parts.map((part, index) => (
            <Fragment key={index}>
              {index > 0 && <TextLink href={mailtoHref}>{facts.enrollmentEmail}</TextLink>}
              {part}
            </Fragment>
          ))}
        </p>
      ))}
    </>
  );

  return (
    <section
      aria-labelledby={headingId}
      className={
        quoteSlot
          ? "mt-section-gap-tight md:mt-section-gap"
          : "mt-section-gap"
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

export function OfferPage({ offer, path, quoteSlot, closingCta = false }: OfferPageProps) {
  const { Content, title, lead, leadSecondary, facts, kind, semesters, leadExtra, quote } = offer;
  const eyebrow = getOfferEyebrow(kind, facts.seasonLabel);
  const enrollment = getEnrollmentState(offer);
  // Once the course season runs, the first meeting is history — drop that FactsBox row.
  const factsBoxFacts = isCourseSeasonRunning(offer) ? { ...facts, firstMeeting: undefined } : facts;
  const enrollmentCopy = getEnrollmentCopy(kind);
  const offerQuote =
    quoteSlot ??
    (quote ? <OfferQuote quote={quote.quote} author={quote.author} role={quote.role} image={quote.image} /> : undefined);
  /** Single featured quote beside enrollment (kurs); grids and offers without enrollment stay full width below. */
  const enrollmentQuoteSlot = enrollmentCopy && offerQuote && !quoteSlot ? offerQuote : undefined;
  const trailingQuoteSlot = offerQuote && !enrollmentQuoteSlot ? offerQuote : undefined;

  return (
    <SectionPageShell path={path}>
      {/* Single FactsBox instance: right under the lead on mobile (key facts before the long copy),
          sidebar spanning the lead and leadExtra rows on lg. */}
      <div className="offer-main-grid grid grid-cols-1 lg:grid-cols-offer-main lg:gap-x-offer-main-gap items-start mb-section-gap-tight">
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
        </div>

        <div className="mt-space-6 lg:mt-0 lg:col-start-2 lg:row-start-1 lg:row-span-2">
          <FactsBox facts={factsBoxFacts} kind={kind} enrollment={enrollment} />
        </div>

        {/* Extra copy below the lead — a section of its own, so it takes the section gap. */}
        {leadExtra && (
          <div className="min-w-0 mt-section-gap">
            <OfferLeadExtra leadExtra={leadExtra} />
          </div>
        )}
      </div>

      <Prose variant="offer">
        <Content
          components={{
            ...offerMdxLinks,
            SemesterProgram: () => <SemesterProgram semesters={semesters} />,
            // Placed by the MDX where an offer wants it (kurs dropped it — enrollment lives in FactsBox).
            OfferEnrollment: () =>
              enrollmentCopy ? (
                <EnrollmentSection
                  facts={facts}
                  copy={enrollmentCopy}
                  mailtoHref={getEnrollmentMailtoHref(facts, kind, enrollment)}
                  quoteSlot={enrollmentQuoteSlot}
                />
              ) : null,
          }}
        />
      </Prose>

      {/* Offer ending (V2-01): plener — quote grid; enrollment only where the MDX places <OfferEnrollment />. */}

      {trailingQuoteSlot && <div className="mt-section-gap">{trailingQuoteSlot}</div>}

      {closingCta && kind === "plener" && (
        <OfferClosingCta facts={facts} kind={kind} enrollment={enrollment} />
      )}
    </SectionPageShell>
  );
}
