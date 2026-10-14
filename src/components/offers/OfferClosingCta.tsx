import { Fragment } from "react";

import { TextLink } from "@/components/core/TextLink";
import type { EnrollmentState } from "@/content/enrollment";
import { getOfferDateValues } from "@/content/offers";
import type { OfferFacts } from "@/content/types";
import { pl } from "@/i18n/pl";
import { fillRequiredTemplate } from "@/lib/fillTemplate";
import { getEnrollmentMailtoHref } from "@/lib/mailto";

export interface OfferClosingCtaProps {
  facts: OfferFacts;
  kind: keyof typeof pl.offers.closingCta;
  /** Same state as FactsBox (`getEnrollmentState`), so both CTAs always agree. */
  enrollment: EnrollmentState;
}

/**
 * Closing line of an offer page: one sentence with the FactsBox enrollment mailto as an inline
 * link, for readers who reached the end of the page. Deliberately quiet — no card, no button.
 */
export function OfferClosingCta({ facts, kind, enrollment }: OfferClosingCtaProps) {
  const copy = pl.offers.closingCta[kind][enrollment];
  const values = getOfferDateValues(facts);
  // Split on {link} first so the link renders between the filled parts.
  const parts = copy.text
    .split("{link}")
    .map((part) => fillRequiredTemplate(part, values, `OfferClosingCta ${kind}`));

  return (
    <p className="mt-section-gap body-copy text-text-secondary">
      {parts.map((part, index) => (
        <Fragment key={index}>
          {index > 0 && (
            <TextLink href={getEnrollmentMailtoHref(facts, kind, enrollment)}>{copy.link}</TextLink>
          )}
          {part}
        </Fragment>
      ))}
    </p>
  );
}
