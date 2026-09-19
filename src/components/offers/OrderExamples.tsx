import { TextLink } from "@/components/core/TextLink";
import { IconGrid } from "@/components/gallery/IconGrid";
import type { IconWork } from "@/content/types";
import { pl } from "@/i18n/pl";

export interface OrderExamplesProps {
  items: IconWork[];
}

export function OrderExamples({ items }: OrderExamplesProps) {
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
      <IconGrid items={items} />
      <TextLink href="/ikony" className="inline-block mt-offer-examples-link-mt text-size-body">
        {pl.home.icons.seeAllLabel}
      </TextLink>
    </section>
  );
}
