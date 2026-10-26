import type { Metadata } from "next";

import { JsonLd } from "@/components/core/JsonLd";
import { LecturesHubPage } from "@/components/lectures/LecturesHubPage";
import { getCurrentSeason, getHubArchiveIntro } from "@/content/lectures";
import { getEnrollmentState, requireOffer } from "@/content/offers";
import { getPageSeo } from "@/content/seo";
import { pageMetadata } from "@/lib/metadata";
import { lectureEventNodes } from "@/lib/structured-data/events";
import { navTitle } from "@/navigation";

const path = "/wyklady";

export const metadata: Metadata = pageMetadata({ path, title: navTitle(path), ...getPageSeo(path) });

export default function LecturesPage() {
  const offer = requireOffer("wyklady");
  const season = getCurrentSeason();

  return (
    <>
      <JsonLd data={lectureEventNodes(season, offer.facts, path, getPageSeo(path).image.src)} />
      <LecturesHubPage
        season={season}
        archiveIntro={getHubArchiveIntro()}
        facts={offer.facts}
        enrollment={getEnrollmentState(offer)}
        path={path}
      />
    </>
  );
}
