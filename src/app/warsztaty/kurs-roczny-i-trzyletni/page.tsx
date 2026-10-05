import type { Metadata } from "next";

import { OfferPage } from "@/components/content/OfferPage";
import { requireOffer } from "@/content/offers";
import { navTitle } from "@/navigation";

// Enrollment state depends on the date — rebuild daily like `/` so both agree (D5, K-85).
export const revalidate = 86400;

const path = "/warsztaty/kurs-roczny-i-trzyletni";

export const metadata: Metadata = {
  title: navTitle(path),
};

export default function AnnualAndThreeYearCoursePage() {
  return <OfferPage offer={requireOffer("kurs-roczny-i-trzyletni")} path={path} />;
}
