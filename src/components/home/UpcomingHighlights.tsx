import { TextLink } from "@/components/core/TextLink";
import { getSiteSettings } from "@/content/settings";
import { pl } from "@/i18n/pl";

/** "Najbliższe" — three tiles fed by SiteSettings.upcoming, each with a TextLink CTA. */
export function UpcomingHighlights() {
  const { upcoming } = getSiteSettings();

  return (
    <section aria-labelledby="upcoming-heading" className="md:px-page-margin">
      <h2
        id="upcoming-heading"
        className="font-serif text-size-role-row-title-m md:text-size-role-row-title leading-heading text-text-h2 mb-space-5 px-page-margin-mobile md:px-0"
      >
        {pl.home.upcomingHeading}
      </h2>
      <div className="grid gap-hairline-gap bg-line-gold md:grid-cols-3">
        {upcoming.map((item) => (
          <div
            key={item.href}
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
