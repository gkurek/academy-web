import { OfferPage } from "@/components/content/OfferPage";
import { OfferLeadExtra } from "@/components/offers/OfferLeadExtra";
import { OfferQuoteGrid } from "@/components/offers/OfferQuoteGrid";
import { requireOffer } from "@/content/offers";
import { getPlenerTestimonials } from "@/content/testimonials";
import { pl } from "@/i18n/pl";
import { mainNav, sectionNav } from "@/navigation";

// Enrollment state depends on the date — rebuild daily like `/` so both agree (D5, K-85).
export const revalidate = 86400;

const slug = "letnia-szkola-swiatla";
const mainNavActive = mainNav.find((item) => item.href === "/warsztaty")!.label;
const sectionItem = sectionNav.warsztaty.find((link) => link.href === `/warsztaty/${slug}`)!;

export default function SummerSchoolOfLightPage() {
  const offer = requireOffer(slug);

  const quotes = getPlenerTestimonials();

  const quoteSlot = (
    <OfferQuoteGrid
      heading={pl.offers.plenerQuotesHeading}
      quotes={quotes}
      columns={2}
    />
  );

  return (
    <OfferPage
      offer={offer}
      section="warsztaty"
      sectionActive={sectionItem.label}
      active={mainNavActive}
      quoteSlot={quoteSlot}
      leadExtraSlot={offer.leadExtra ? <OfferLeadExtra leadExtra={offer.leadExtra} /> : undefined}
    />
  );
}
