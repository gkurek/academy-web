import { LecturesHubPage } from "@/components/lectures/LecturesHubPage";
import { getCurrentSeason, getHubArchiveIntro } from "@/content/lectures";
import { getOffer } from "@/content/offers";
import { mainNav, sectionNav } from "@/navigation";
import { notFound } from "next/navigation";

const mainNavActive = mainNav.find((item) => item.href === "/wyklady")!.label;
const sectionActive = sectionNav.wyklady[0].label;

export default function LecturesPage() {
  const season = getCurrentSeason();
  const archiveIntro = getHubArchiveIntro();
  const offer = getOffer("wyklady");

  if (!offer) {
    notFound();
  }

  return (
    <LecturesHubPage
      season={season}
      archiveIntro={archiveIntro}
      facts={offer.facts}
      section="wyklady"
      sectionActive={sectionActive}
      active={mainNavActive}
    />
  );
}
