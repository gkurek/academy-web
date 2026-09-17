import { notFound } from "next/navigation";

import { OfferPage } from "@/components/content/OfferPage";
import { OrderExamples } from "@/components/offers/OrderExamples";
import { ReadyIconsNote } from "@/components/offers/ReadyIconsNote";
import { getIconWorksBySlugs } from "@/content/icons";
import { getOffer } from "@/content/offers";
import { mainNav, sectionNav } from "@/navigation";

const slug = "zamowienie";
const mainNavActive = mainNav.find((item) => item.href === "/ikony")!.label;
const sectionItem = sectionNav.ikony.find((link) => link.href === "/ikony/na-zamowienie")!;

export default function CustomIconsPage() {
  const offer = getOffer(slug);
  if (!offer) {
    notFound();
  }

  const exampleIcons = getIconWorksBySlugs(offer.exampleSlugs);

  return (
    <OfferPage
      offer={offer}
      section="ikony"
      sectionActive={sectionItem.label}
      active={mainNavActive}
      afterBodySlot={
        <>
          <OrderExamples items={exampleIcons} />
          <ReadyIconsNote email={offer.facts.enrollmentEmail} />
        </>
      }
    />
  );
}
