import { TextLink } from "@/components/core/TextLink";
import { getExhibitionUpcomingHighlight } from "@/content/exhibition";
import { getSiteSettings } from "@/content/settings";
import { pl } from "@/i18n/pl";

/** "Najbliższe" — two tiles from SiteSettings.upcoming plus optional exhibition tile (D-08-07, K-85). */
export function UpcomingHighlights() {
  const { upcoming } = getSiteSettings();
  const exhibitionTile = getExhibitionUpcomingHighlight();
  const tiles = exhibitionTile ? [...upcoming, exhibitionTile] : upcoming;

  return (
    <section aria-labelledby="upcoming-heading" className="md:px-page-margin">
      <h2
        id="upcoming-heading"
        className="font-serif text-size-role-row-title-m md:text-size-role-row-title leading-heading text-text-h2 mb-space-5 px-page-margin-mobile md:px-0"
      >
        {pl.home.upcomingHeading}
      </h2>
      <div
        className={`grid gap-hairline-gap bg-line-gold ${tiles.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}
      >
        {tiles.map((item) => (
          <div
            key={item.href + item.title}
            className="bg-surface-tile py-tile-py-m px-page-margin-mobile md:py-tile-py md:px-tile-px"
          >
            <div className="font-serif text-size-body text-accent-text mb-space-2">{item.text}</div>
            <div className="font-serif text-size-role-row-title-m md:text-size-role-row-title leading-heading text-text-list-title">
              {item.title}
            </div>
            <TextLink
              href={item.href}
              className="inline-block mt-tile-link-mt-m md:mt-tile-link-mt text-size-ui-m md:text-size-ui"
            >
              {item.linkLabel}
            </TextLink>
          </div>
        ))}
      </div>
    </section>
  );
}
