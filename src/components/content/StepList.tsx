import { useId, type CSSProperties } from "react";

import type { StepItem } from "@/content/offers";
import { pl } from "@/i18n/pl";

export interface StepListProps {
  steps: StepItem[];
}

export function StepList({ steps }: StepListProps) {
  const headingId = useId();
  if (steps.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={headingId} className="not-prose">
      <h2
        id={headingId}
        className="font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2 mt-section-gap mb-heading-gap first:mt-0"
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
            className="bg-surface-tile grid grid-cols-step-row lg:grid-cols-1 gap-offer-step-gap-m lg:gap-offer-step-gap px-offer-step-x py-offer-step-y items-baseline lg:items-start"
          >
            <span
              aria-hidden="true"
              className="font-serif text-size-offer-step-num leading-none text-accent-text shrink-0"
            >
              {index + 1}
            </span>
            <div className="min-w-0">
              <div className="font-serif text-size-role-row-title-m md:text-size-role-row-title leading-heading text-text-list-title mb-space-2">
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
