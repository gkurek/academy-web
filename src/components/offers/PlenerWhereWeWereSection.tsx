import { pl } from "@/i18n/pl";

export type PlenerWhereWeWereEntry = {
  place: string;
  year: string;
};

export interface PlenerWhereWeWereSectionProps {
  entries: PlenerWhereWeWereEntry[];
}

export function PlenerWhereWeWereSection({ entries }: PlenerWhereWeWereSectionProps) {
  return (
    <section
      className="rule-gold-t mt-space-8 pt-space-7"
      aria-labelledby="plener-where-we-were-heading"
    >
      <h2
        id="plener-where-we-were-heading"
        className="font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2 mb-space-5"
      >
        {pl.offers.whereWeWereHeading}
      </h2>
      <ul className="grid gap-space-3 text-size-body-lg leading-body text-text-secondary md:text-size-body md:leading-prose">
        {entries.map((entry) => (
          <li key={entry.place}>
            {entry.place} · {entry.year}
          </li>
        ))}
      </ul>
    </section>
  );
}
