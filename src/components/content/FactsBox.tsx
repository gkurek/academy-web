import { Button } from "@/components/core/Button";

import type { OfferFacts } from "@/content/types";

import { pl } from "@/i18n/pl";



export interface FactsBoxProps {

  facts: OfferFacts;

  kind: keyof typeof pl.factsBox.ctaByKind;

}



type FactsRowKey =

  | "when"

  | "where"

  | "audience"

  | "enrollmentDeadline"

  | "enrollmentStart"

  | "enrollmentRule"

  | "firstMeeting"

  | "price"

  | "leadTime";



const rowKeysByKind: Record<FactsBoxProps["kind"], FactsRowKey[]> = {

  kurs: ["when", "where", "audience", "enrollmentDeadline", "firstMeeting", "price"],

  plener: ["when", "where", "audience", "enrollmentStart", "enrollmentRule", "price"],

  wyklady: ["when", "where", "audience", "enrollmentDeadline", "price"],

  zamowienie: ["when", "where", "audience", "leadTime", "price"],

};



function buildMailtoHref(email: string, subject: string): string {

  const params = new URLSearchParams({ subject });

  return `mailto:${email}?${params.toString()}`;

}



function getRowLabel(kind: FactsBoxProps["kind"], key: FactsRowKey): string {
  const { rows, rowsByKind } = pl.factsBox;
  const kindRows = kind in rowsByKind ? rowsByKind[kind as keyof typeof rowsByKind] : undefined;
  if (kindRows && key in kindRows) {
    return kindRows[key as keyof typeof kindRows];
  }

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



function getDesktopContactLine(

  kind: FactsBoxProps["kind"],

  enrollmentOpen: boolean,

  email: string,

): string {

  if (!enrollmentOpen && kind === "plener") {

    return pl.factsBox.contactClosedPlener.replace("{email}", email);

  }

  return pl.factsBox.phoneOr;

}



export function FactsBox({ facts, kind }: FactsBoxProps) {

  const { factsBox } = pl;

  const enrollmentState = facts.enrollmentOpen ? "open" : "closed";

  const cta = factsBox.ctaByKind[kind][enrollmentState];

  const mailtoHref = buildMailtoHref(facts.enrollmentEmail, facts.enrollmentSubject);

  const desktopContact = getDesktopContactLine(kind, facts.enrollmentOpen, facts.enrollmentEmail);

  const ctaNote = "note" in cta ? cta.note : undefined;



  const rows = rowKeysByKind[kind]

    .filter((key) => {

      const value = facts[key as keyof OfferFacts];

      return typeof value === "string" && value.trim().length > 0;

    })

    .map((key) => ({

      key,

      label: getRowLabel(kind, key),

      value: facts[key as keyof OfferFacts] as string,

    }));

  const contactRow =
    kind === "zamowienie"
      ? {
          label: pl.factsBox.rowsByKind.zamowienie.contact,
          value: (
            <>
              {facts.enrollmentEmail}
              <br />
              {facts.enrollmentPhone}
            </>
          ),
        }
      : null;



  return (

    <aside

      aria-labelledby="facts-box-heading"

      className="bg-surface-card px-offer-facts-x pt-offer-facts-y pb-offer-facts-pb border-t-offer-facts-top border-accent"

    >

      <h2

        id="facts-box-heading"

        className="font-serif text-size-offer-facts-heading leading-heading text-text-h2 mb-space-5"

      >

        {getHeading(kind, facts.seasonLabel)}

      </h2>



      <dl className="text-size-body leading-facts mb-space-6">

        {rows.map((row) => (

          <div key={row.key}>

            <dt className="text-size-caption text-text-tertiary">{row.label}</dt>

            <dd className="mt-offer-facts-dd-mt pb-space-6 text-text-body">{row.value}</dd>

          </div>

        ))}

        {contactRow ? (
          <div>
            <dt className="text-size-caption text-text-tertiary">{contactRow.label}</dt>
            <dd className="mt-offer-facts-dd-mt mb-0 text-text-body">{contactRow.value}</dd>
          </div>
        ) : null}

      </dl>



      <div className="space-y-space-3">

        {ctaNote && (

          <p className="text-size-caption leading-body text-text-secondary">{ctaNote}</p>

        )}



        <Button

          href={mailtoHref}

          variant={facts.enrollmentOpen ? "primary" : "secondary"}

          block

          size="lg"

        >

          {cta.mailtoLabel}

        </Button>



        <Button href={factsBox.phoneTel} variant="secondary" block size="lg" className="md:hidden">

          {cta.telLabel}

        </Button>



        <p className="hidden md:block text-size-ui text-text-tertiary text-center">{desktopContact}</p>

      </div>

    </aside>

  );

}


