import { OfferPage } from "@/components/content/OfferPage";
import { OfferLeadIntro } from "@/components/offers/OfferLeadIntro";
import { OrderExamples } from "@/components/offers/OrderExamples";
import { ReadyIconsNote } from "@/components/offers/ReadyIconsNote";
import { requireOffer } from "@/content/offers";
import { mainNav, sectionNav } from "@/navigation";

const slug = "zamowienie";
const mainNavActive = mainNav.find((item) => item.href === "/ikony")!.label;
const sectionItem = sectionNav.ikony.find((link) => link.href === "/ikony/na-zamowienie")!;

export default function CustomIconsPage() {
  const offer = requireOffer(slug);

  return (
    <OfferPage
      offer={offer}
      section="ikony"
      sectionActive={sectionItem.label}
      active={mainNavActive}
      leadExtraSlot={
        offer.leadIntro ? <OfferLeadIntro sections={offer.leadIntro} /> : undefined
      }
      afterBodySlot={
        <>
          <OrderExamples />
          <ReadyIconsNote email={offer.facts.enrollmentEmail} />
        </>
      }
    />
  );
}
