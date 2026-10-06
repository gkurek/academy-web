import type { Metadata } from "next";

import { OfferPage } from "@/components/content/OfferPage";
import { OfferQuoteGrid } from "@/components/offers/OfferQuoteGrid";
import { requireOffer } from "@/content/offers";
import { getPlenerTestimonials } from "@/content/testimonials";
import { pl } from "@/i18n/pl";
import { navTitle } from "@/navigation";

// Enrollment state depends on the date — rebuild daily like `/` so both agree (D5, K-85).
export const revalidate = 86400;

const path = "/warsztaty/letnia-szkola-swiatla";

export const metadata: Metadata = {
  title: navTitle(path),
};

export default function SummerSchoolOfLightPage() {
  return (
    <OfferPage
      offer={requireOffer("letnia-szkola-swiatla")}
      path={path}
      quoteSlot={
        <OfferQuoteGrid heading={pl.offers.plenerQuotesHeading} quotes={getPlenerTestimonials()} columns={2} />
      }
    />
  );
}
