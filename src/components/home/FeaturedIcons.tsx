import { Button } from "@/components/core/Button";
import { TextLink } from "@/components/core/TextLink";
import { FeaturedIconsGallery } from "@/components/home/FeaturedIconsGallery";
import { getFeaturedIconWorks } from "@/content/icons";
import { pl } from "@/i18n/pl";
import { PageHeading } from "@/components/core/PageHeading";

/**
 * "Wybrane ikony" — curated preview of the gallery. Desktop shows all 4 with
 * a "Cała galeria" link next to the heading; mobile shows only the first 2
 * (per the resolved mockup DOM) plus a full-width "Cała galeria" button below.
 */
export function FeaturedIcons() {
  const icons = getFeaturedIconWorks();

  return (
    <section className="px-page-margin-mobile md:px-page-margin pt-section-gap pb-space-6">
      <div className="flex items-baseline justify-between mb-heading-gap">
        <PageHeading level="section">
          {pl.home.icons.heading}
        </PageHeading>
        <TextLink href="/ikony" className="hidden md:inline text-size-body">
          {pl.home.icons.seeAllLabel}
        </TextLink>
      </div>
      <FeaturedIconsGallery icons={icons} />
      <Button href="/ikony" variant="secondary" size="lg" block className="mt-space-5 md:hidden">
        {pl.home.icons.seeAllLabel}
      </Button>
    </section>
  );
}
