import type { Metadata } from "next";

import { JsonLd } from "@/components/core/JsonLd";
import { OfferPage } from "@/components/content/OfferPage";
import { requireOffer } from "@/content/offers";
import { getPageSeo } from "@/content/seo";
import { pageMetadata } from "@/lib/metadata";
import { courseNode } from "@/lib/structured-data/course";
import { navTitle } from "@/navigation";

const path = "/warsztaty/kurs-roczny-i-trzyletni";

export const metadata: Metadata = pageMetadata({ path, title: navTitle(path), ...getPageSeo(path) });

export default function AnnualAndThreeYearCoursePage() {
  const offer = requireOffer("kurs-roczny-i-trzyletni");

  return (
    <>
      <JsonLd
        data={courseNode({ name: offer.title, description: getPageSeo(path).description, path, atVenue: true })}
      />
      <OfferPage offer={offer} path={path} />
    </>
  );
}
