import { TextLink } from "@/components/core/TextLink";
import { FeaturedIconsGallery } from "@/components/home/FeaturedIconsGallery";
import { getFeaturedIconWorks } from "@/content/icons";
import { pl } from "@/i18n/pl";

/** Same curated set and gallery UX as home „Wybrane ikony” (justified rows, lightbox). */
export function OrderExamples() {
  const icons = getFeaturedIconWorks();

  return (
    <section
      aria-labelledby="order-examples-heading"
      className="mt-space-8 pb-offer-examples-pb"
    >
      <h2
        id="order-examples-heading"
        className="font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2 mb-offer-examples-heading-mb"
      >
        {pl.offers.orderExamplesHeading}
      </h2>
      <FeaturedIconsGallery icons={icons} />
      <TextLink href="/ikony" className="inline-block mt-offer-examples-link-mt text-size-body">
        {pl.home.icons.seeAllLabel}
      </TextLink>
    </section>
  );
}
