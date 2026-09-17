"use client";

import type { CSSProperties } from "react";

import { pl } from "@/i18n/pl";

import { useOfferContent } from "./OfferContentContext";

export function StepList() {
  const { steps } = useOfferContent();

  if (steps.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="order-steps-heading" className="not-prose">
      <h2
        id="order-steps-heading"
        className="font-serif text-size-h2-m md:text-size-h2-sm leading-heading text-text-h2 mt-space-8 mb-space-2 first:mt-0"
      >
        {pl.offers.orderStepsHeading}
      </h2>
      <p className="text-size-body leading-body text-text-secondary mb-space-6">
        {pl.offers.orderStepsIntro}
      </p>
      <ol
        className="offer-step-grid"
        style={{ "--step-count": steps.length } as CSSProperties}
      >
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="bg-surface-tile grid grid-cols-[minmax(0,auto)_1fr] lg:grid-cols-1 gap-offer-step-gap-m lg:gap-offer-step-gap px-offer-step-x py-offer-step-y items-baseline lg:items-start"
          >
            <span
              aria-hidden="true"
              className="font-serif text-size-offer-step-num leading-none text-accent shrink-0"
            >
              {index + 1}
            </span>
            <div className="min-w-0">
              <div className="text-size-body-lg leading-body text-text-list-title mb-space-2">
                {step.title}
              </div>
              {step.body ? (
                <p className="text-size-body leading-body text-text-tertiary m-0">{step.body}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
