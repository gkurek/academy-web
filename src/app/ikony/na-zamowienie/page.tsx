import type { Metadata } from "next";

import { OfferPage } from "@/components/content/OfferPage";
import { OrderExamples } from "@/components/offers/OrderExamples";
import { ReadyIconsNote } from "@/components/offers/ReadyIconsNote";
import { requireOffer } from "@/content/offers";
import { navTitle } from "@/navigation";

const path = "/ikony/na-zamowienie";

export const metadata: Metadata = {
  title: navTitle(path),
};

export default function CustomIconsPage() {
  const offer = requireOffer("zamowienie");

  return (
    <OfferPage
      offer={offer}
      path={path}
      afterBodySlot={<OrderExamples />}
      footerBand={<ReadyIconsNote email={offer.facts.enrollmentEmail} />}
    />
  );
}
