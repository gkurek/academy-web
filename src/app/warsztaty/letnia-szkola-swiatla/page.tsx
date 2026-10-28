import type { Metadata } from "next";

import { JsonLd } from "@/components/core/JsonLd";
import { OfferPage } from "@/components/content/OfferPage";
import { OfferQuoteGrid } from "@/components/offers/OfferQuoteGrid";
import { requireOffer } from "@/content/offers";
import { getPlenerTestimonials } from "@/content/testimonials";
import { pl } from "@/i18n/pl";
import { getPageSeo } from "@/content/seo";
import { pageMetadata } from "@/lib/metadata";
import { courseNode } from "@/lib/structured-data/course";
import { navTitle } from "@/navigation";

const path = "/warsztaty/letnia-szkola-swiatla";

export const metadata: Metadata = pageMetadata({ path, title: navTitle(path), ...getPageSeo(path) });

export default function SummerSchoolOfLightPage() {
  const offer = requireOffer("letnia-szkola-swiatla");

  return (
    <>
      <JsonLd
        data={courseNode({ name: offer.title, description: getPageSeo(path).description, path, atVenue: false })}
      />
      <OfferPage
        offer={offer}
        path={path}
        closingCta
        quoteSlot={
          <OfferQuoteGrid heading={pl.offers.plenerQuotesHeading} quotes={getPlenerTestimonials()} columns={2} />
        }
      />
    </>
  );
}
