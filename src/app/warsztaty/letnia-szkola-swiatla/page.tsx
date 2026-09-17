import { notFound } from "next/navigation";

import { OfferPage } from "@/components/content/OfferPage";
import { OfferQuoteGrid } from "@/components/offers/OfferQuoteGrid";
import { getOffer } from "@/content/offers";
import { getPlenerTestimonials } from "@/content/testimonials";
import { pl } from "@/i18n/pl";
import { mainNav, sectionNav } from "@/navigation";

const slug = "letnia-szkola-swiatla";
const mainNavActive = mainNav.find((item) => item.href === "/warsztaty")!.label;
const sectionItem = sectionNav.warsztaty.find((link) => link.href === `/warsztaty/${slug}`)!;

export default function SummerSchoolOfLightPage() {
  const offer = getOffer(slug);
  if (!offer) {
    notFound();
  }

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
    />
  );
}
