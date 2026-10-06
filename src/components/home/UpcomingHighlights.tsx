import { TextLink } from "@/components/core/TextLink";
import { getUpcomingOfferFacts } from "@/content/offers";
import { getUpcomingTiles } from "@/content/upcoming";
import { pl } from "@/i18n/pl";

/** "Najbliższe" — always three tiles (Warsztaty · Wykłady · Ikony) above matching `Pillars` (plan 10-k4 N1). */
export function UpcomingHighlights() {
  const tiles = getUpcomingTiles(getUpcomingOfferFacts());

  return (
    <section aria-labelledby="upcoming-heading" className="md:px-page-margin">
      <h2
        id="upcoming-heading"
        className="font-serif text-size-role-row-title-m md:text-size-role-row-title leading-heading text-text-h2 mb-heading-gap px-page-margin-mobile md:px-0"
      >
        {pl.home.upcomingHeading}
      </h2>
      <div className="hairline-grid-3">
        {tiles.map((item) => (
          <div
            key={item.slot}
            className="bg-surface-tile py-tile-py-m px-page-margin-mobile md:py-tile-py md:px-tile-px"
          >
            <div className="font-serif text-size-body text-accent-text mb-space-2">{item.text}</div>
            <div className="font-serif text-size-role-row-title-m md:text-size-role-row-title leading-heading text-text-list-title">
              {item.title}
            </div>
            <TextLink
              standalone
              href={item.href}
              className="mt-tile-link-mt-m md:mt-tile-link-mt text-size-ui-m md:text-size-ui"
            >
              {item.linkLabel}
            </TextLink>
          </div>
        ))}
      </div>
    </section>
  );
}
