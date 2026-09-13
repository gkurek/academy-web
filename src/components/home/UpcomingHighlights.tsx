import { TextLink } from "@/components/core/TextLink";
import { getSiteSettings } from "@/content/settings";
import { pl } from "@/i18n/pl";

/** "Najbliższe" — three tiles fed by SiteSettings.upcoming, each with a TextLink CTA. */
export function UpcomingHighlights() {
  const { upcoming } = getSiteSettings();

  return (
    <section aria-label={pl.home.upcomingAriaLabel} className="md:px-page-margin">
      <div className="grid gap-hairline-gap bg-line-gold md:grid-cols-3">
        {upcoming.map((item) => (
          <div
            key={item.href}
            className="bg-surface-tile py-tile-py-m px-page-margin-mobile md:py-tile-py md:px-tile-px"
          >
            <div className="font-serif text-size-nav text-accent mb-space-2">{item.text}</div>
            <div className="text-size-tile-title leading-tile-title text-text-list-title">{item.title}</div>
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
