import type { Metadata } from "next";

import { LecturesHubPage } from "@/components/lectures/LecturesHubPage";
import { getCurrentSeason, getHubArchiveIntro } from "@/content/lectures";
import { getEnrollmentState, requireOffer } from "@/content/offers";
import { navTitle } from "@/navigation";

const path = "/wyklady";

export const metadata: Metadata = {
  title: navTitle(path),
};

export default function LecturesPage() {
  const offer = requireOffer("wyklady");

  return (
    <LecturesHubPage
      season={getCurrentSeason()}
      archiveIntro={getHubArchiveIntro()}
      facts={offer.facts}
      enrollment={getEnrollmentState(offer)}
      path={path}
    />
  );
}
