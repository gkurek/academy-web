import { TextLink } from "@/components/core/TextLink";
import { FeaturedIconsGallery } from "@/components/home/FeaturedIconsGallery";
import { getFeaturedIconWorks } from "@/content/icons";
import { pl } from "@/i18n/pl";
import { PageHeading } from "@/components/core/PageHeading";

/** Same curated set and gallery UX as home „Wybrane ikony” (justified rows, lightbox). */
export function OrderExamples() {
  const icons = getFeaturedIconWorks();

  return (
    <section
      aria-labelledby="order-examples-heading"
      className="mt-section-gap"
    >
      <PageHeading level="section" id="order-examples-heading" className="mb-heading-gap">
        {pl.offers.orderExamplesHeading}
      </PageHeading>
      <FeaturedIconsGallery icons={icons} />
      <TextLink href="/ikony" className="inline-block mt-offer-examples-link-mt text-size-body">
        {pl.home.icons.seeAllLabel}
      </TextLink>
    </section>
  );
}
