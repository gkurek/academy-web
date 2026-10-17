import { useId } from "react";

import { Button } from "@/components/core/Button";
import type { EnrollmentState } from "@/content/enrollment";
import { getOfferDateValues } from "@/content/offers";
import { getPhoneHref, getSiteSettings } from "@/content/settings";
import type { OfferFacts } from "@/content/types";
import { pl } from "@/i18n/pl";
import { fillRequiredTemplate, fillTemplate } from "@/lib/fillTemplate";
import { getEnrollmentMailtoHref } from "@/lib/mailto";

export interface FactsBoxProps {
  facts: OfferFacts;
  kind: keyof typeof pl.factsBox.ctaByKind;
  /** Computed in the data layer (`getEnrollmentState`), never read from `facts.enrollmentOpen` here (D5). */
  enrollment: EnrollmentState;
}

type FactsRowKey =
  | "when"
  | "where"
  | "audience"
  | "enrollmentDeadline"
  | "enrollmentStart"
  | "enrollmentRule"
  | "firstMeeting"
  | "price";

const rowKeysByKind: Record<FactsBoxProps["kind"], FactsRowKey[]> = {
  kurs: ["when", "where", "audience", "enrollmentDeadline", "firstMeeting", "price"],
  plener: ["when", "where", "audience", "enrollmentStart", "enrollmentRule", "price"],
  wyklady: ["when", "where", "audience", "enrollmentDeadline", "price"],
};

function getRowLabel(kind: FactsBoxProps["kind"], key: FactsRowKey): string {
  const { rows } = pl.factsBox;

  if (key === "enrollmentDeadline" && kind === "kurs") {
    return rows.enrollment;
  }

  return rows[key];
}

function getHeading(kind: FactsBoxProps["kind"], seasonLabel?: string): string {
  if (!seasonLabel) {
    return pl.factsBox.headingFallback;
  }

  const template = kind === "plener" ? pl.factsBox.headingPlener : pl.factsBox.headingSeason;

  return template.replace("{seasonLabel}", seasonLabel);
}

const workshopChurchLabel = "Kościół Środowisk Twórczych";

/** Workshop and lectures offers: church name, patrons, and address on separate lines in „Gdzie”. */
function formatWhereValue(value: string, kind: FactsBoxProps["kind"]): string {
  if (kind !== "kurs" && kind !== "plener" && kind !== "wyklady") {
    return value;
  }
  if (!value.includes(workshopChurchLabel) || value.includes("pw.")) {
    return value;
  }

  const locationLine = value.slice(workshopChurchLabel.length).trim();
  const lines = [workshopChurchLabel, pl.footer.churchPatronsShort];
  if (locationLine.length > 0) {
    lines.push(locationLine);
  }

  return lines.join("\n");
}

export function FactsBox({ facts, kind, enrollment }: FactsBoxProps) {
  const headingId = useId();
  const { factsBox } = pl;
  const cta = factsBox.ctaByKind[kind][enrollment];
  const { phone } = getSiteSettings();
  const phoneHref = getPhoneHref();
  const mailtoHref = getEnrollmentMailtoHref(facts, kind, enrollment);
  const ctaNote =
    "note" in cta
      ? fillRequiredTemplate(cta.note, getOfferDateValues(facts), `FactsBox ${kind} note`)
      : undefined;

  const rows = rowKeysByKind[kind]
    .filter((key) => {
      const value = facts[key as keyof OfferFacts];
      return typeof value === "string" && value.trim().length > 0;
    })
    .map((key) => {
      const raw = facts[key as keyof OfferFacts] as string;
      const value = key === "where" ? formatWhereValue(raw, kind) : raw;

      return {
        key,
        label: getRowLabel(kind, key),
        value,
      };
    });

  return (
    <aside
      aria-labelledby={headingId}
      className="bg-surface-card px-offer-facts-x pt-offer-facts-y pb-offer-facts-pb border-t-offer-facts-top border-accent"
    >
      <h2
        id={headingId}
        className="font-serif text-size-role-box-title-m md:text-size-role-box-title leading-heading text-text-h2 mb-space-5"
      >
        {getHeading(kind, facts.seasonLabel)}
      </h2>

      <dl className="text-size-body leading-facts mb-space-6">
        {rows.map((row) => (
          <div key={row.key}>
            <dt className="text-size-caption text-text-tertiary">{row.label}</dt>
            <dd
              className={`mt-offer-facts-dd-mt pb-space-6 text-text-body${row.key === "where" ? " whitespace-pre-line" : ""}`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="space-y-space-3">
        {ctaNote && (
          <p className="text-size-caption leading-body text-text-secondary">{ctaNote}</p>
        )}

        <Button
          href={mailtoHref}
          variant={enrollment === "open" ? "primary" : "secondary"}
          block
          size="md"
        >
          {cta.mailtoLabel}
        </Button>

        {/* Closed enrollment states omit telLabel: no phone while there is nothing to sign up for. */}
        {"telLabel" in cta && (
          <>
            <Button href={phoneHref} variant="secondary" block size="md" className="md:hidden">
              {fillTemplate(cta.telLabel, { phone })}
            </Button>

            <p className="hidden md:block text-size-ui text-text-tertiary text-center">{fillTemplate(factsBox.phoneOr, { phone })}</p>
          </>
        )}
      </div>
    </aside>
  );
}
