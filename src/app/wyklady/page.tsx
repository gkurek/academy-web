import { LecturesHubPage } from "@/components/lectures/LecturesHubPage";
import { getCurrentSeason, getHubArchiveIntro } from "@/content/lectures";
import { getEnrollmentState, requireOffer } from "@/content/offers";
import { mainNav, sectionNav } from "@/navigation";

const mainNavActive = mainNav.find((item) => item.href === "/wyklady")!.label;
const sectionActive = sectionNav.wyklady[0].label;

export default function LecturesPage() {
  const season = getCurrentSeason();
  const archiveIntro = getHubArchiveIntro();
  const offer = requireOffer("wyklady");

  return (
    <LecturesHubPage
      season={season}
      archiveIntro={archiveIntro}
      facts={offer.facts}
      enrollment={getEnrollmentState(offer)}
      section="wyklady"
      sectionActive={sectionActive}
      active={mainNavActive}
    />
  );
}
