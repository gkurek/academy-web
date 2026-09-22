import type { ExhibitionEdition } from "@/content/types";
import { formatDateRange } from "@/lib/formatDateRange";
import { pl } from "@/i18n/pl";

export interface ExhibitionTourListProps {
  edition: ExhibitionEdition;
  state: "zapowiedz" | "biezaca";
}

export function ExhibitionTourList({ edition, state }: ExhibitionTourListProps) {
  const tours = edition.tours ?? [];
  if (tours.length === 0) {
    return null;
  }

  const stateLabel =
    state === "zapowiedz" ? pl.exhibition.tours.newEditionLabel : pl.exhibition.tours.currentEditionLabel;

  return (
    <section id="oprowadzania" className="exhibition-section" aria-labelledby="exhibition-tours-heading">
      <h2
        id="exhibition-tours-heading"
        className="font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2 mb-space-5"
      >
        {pl.exhibition.tours.title}
      </h2>
      <p className="text-size-body md:text-size-body-lg leading-body md:leading-prose text-text-secondary max-w-measure-prose mb-space-6">
        {pl.exhibition.tours.intro}
      </p>
      <p className="exhibition-tours-label">{stateLabel.replace("{year}", String(edition.year))}</p>
      <ul className="exhibition-tour-list">
        {tours.map((tour) => {
          const dateLabel = tour.date
            ? formatDateRange(tour.date, undefined, { withYear: true })
            : pl.exhibition.tours.dateFallback;

          return (
            <li key={`${tour.date}-${tour.topic}`} className="exhibition-tour-row">
              <span className="exhibition-tour-date">{dateLabel}</span>
              <span className="exhibition-tour-topic">{tour.topic}</span>
            </li>
          );
        })}
      </ul>
      <p className="exhibition-tours-footnote">{pl.exhibition.tours.footnote}</p>
    </section>
  );
}
