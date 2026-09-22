import { TextLink } from "@/components/core/TextLink";
import type { ExhibitionEdition } from "@/content/types";
import { getSiteSettings } from "@/content/settings";
import { pl } from "@/i18n/pl";

export interface ExhibitionFactsProps {
  currentEdition: ExhibitionEdition;
}

export function ExhibitionFacts({ currentEdition }: ExhibitionFactsProps) {
  const settings = getSiteSettings();
  const { facts } = pl.exhibition;

  const rows = [
    {
      label: facts.where,
      value: `${settings.place}, ${settings.address}`,
    },
    {
      label: facts.when,
      value: facts.whenValue,
    },
    {
      label: facts.admission,
      value: facts.admissionValue,
    },
    {
      label: facts.currentEdition,
      value: String(currentEdition.year),
    },
    {
      label: facts.newEdition,
      value: facts.newEditionValue,
    },
  ];

  return (
    <aside
      aria-labelledby="exhibition-facts-heading"
      className="exhibition-facts bg-surface-card border-t-offer-facts-top border-accent px-offer-facts-x pt-offer-facts-y pb-offer-facts-pb"
    >
      <h2 id="exhibition-facts-heading" className="sr-only">
        {facts.srHeading}
      </h2>
      <dl className="exhibition-facts-list text-size-body leading-facts">
        {rows.map((row) => (
          <div key={row.label} className="exhibition-facts-row">
            <dt className="text-size-caption text-text-tertiary">{row.label}</dt>
            <dd className="mt-offer-facts-dd-mt mb-offer-facts-dd-mb text-text-body">{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-space-5">
        <TextLink href="/kontakt">{facts.contactLink}</TextLink>
      </div>
    </aside>
  );
}
