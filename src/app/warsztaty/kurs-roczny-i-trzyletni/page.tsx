import { notFound } from "next/navigation";

import { OfferPage } from "@/components/content/OfferPage";
import { OfferQuote } from "@/components/offers/OfferQuote";
import { getOffer } from "@/content/offers";
import { mainNav, sectionNav } from "@/navigation";

const slug = "kurs-roczny-i-trzyletni";
const mainNavActive = mainNav.find((item) => item.href === "/warsztaty")!.label;
const sectionItem = sectionNav.warsztaty.find((link) => link.href === `/warsztaty/${slug}`)!;

export default function AnnualAndThreeYearCoursePage() {
  const offer = getOffer(slug);
  if (!offer) {
    notFound();
  }

  const quoteSlot = offer.quote ? (
    <OfferQuote
      quote={offer.quote.quote}
      author={offer.quote.author}
      role={offer.quote.role}
      image={offer.quote.image}
    />
  ) : undefined;

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
