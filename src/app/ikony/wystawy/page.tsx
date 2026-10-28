import type { Metadata } from "next";

import { JsonLd } from "@/components/core/JsonLd";
import { ExhibitionPage } from "@/components/exhibition/ExhibitionPage";
import {
  getExhibitionNowNext,
  getExhibitionPage,
  getFirstAnnualExhibitionYear,
  getLastFinishedAnnualExhibition,
  getLatestAnnualExhibition,
} from "@/content/exhibition";
import { getPageSeo } from "@/content/seo";
import { pageMetadata } from "@/lib/metadata";
import { annualExhibitionNode } from "@/lib/structured-data/events";
import { navTitle } from "@/navigation";

const path = "/ikony/wystawy";

export const metadata: Metadata = pageMetadata({ path, title: navTitle(path), ...getPageSeo(path) });

export default function ExhibitionRoutePage() {
  const latestAnnual = getLatestAnnualExhibition();
  const exhibitionEvent = annualExhibitionNode(latestAnnual, path, getPageSeo(path).image.src);

  return (
    <>
      {exhibitionEvent && <JsonLd data={exhibitionEvent} />}
      <ExhibitionPage
        path={path}
        page={getExhibitionPage()}
        latestAnnual={latestAnnual}
        lastFinished={getLastFinishedAnnualExhibition()}
        nowNext={getExhibitionNowNext()}
        firstAnnualYear={getFirstAnnualExhibitionYear()}
      />
    </>
  );
}
