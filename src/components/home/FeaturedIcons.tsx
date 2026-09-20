import { Button } from "@/components/core/Button";
import { TextLink } from "@/components/core/TextLink";
import { IconGrid } from "@/components/gallery/IconGrid";
import { getFeaturedIconWorks } from "@/content/icons";
import { pl } from "@/i18n/pl";

/**
 * "Wybrane ikony" — curated preview of the gallery. Desktop shows all 4 with
 * a "Cała galeria" link next to the heading; mobile shows only the first 2
 * (per the resolved mockup DOM) plus a full-width "Cała galeria" button below.
 */
export function FeaturedIcons() {
  const icons = getFeaturedIconWorks();

  return (
    <section className="px-page-margin-mobile md:px-page-margin py-space-7 md:py-space-8">
      <div className="flex items-baseline justify-between mb-space-5 md:mb-space-6">
        <h2 className="font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2">
          {pl.home.icons.heading}
        </h2>
        <TextLink href="/ikony" className="hidden md:inline text-size-body">
          {pl.home.icons.seeAllLabel}
        </TextLink>
      </div>
      <IconGrid items={icons} mobileCount={2} />
      <Button href="/ikony" variant="secondary" size="lg" block className="mt-space-5 md:hidden">
        {pl.home.icons.seeAllLabel}
      </Button>
    </section>
  );
}
