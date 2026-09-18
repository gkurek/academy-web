import { LecturesArchivePage } from "@/components/lectures/LecturesArchivePage";
import { getArchiveIntro, getArchiveSeasons } from "@/content/lectures";
import { mainNav, sectionNav } from "@/navigation";

const mainNavActive = mainNav.find((item) => item.href === "/wyklady")!.label;
const sectionActive = sectionNav.wyklady.find((link) => link.href === "/wyklady/archiwum")!.label;

export default function LecturesArchiveRoutePage() {
  const seasons = getArchiveSeasons();
  const intro = getArchiveIntro();

  return (
    <LecturesArchivePage
      seasons={seasons}
      intro={intro}
      section="wyklady"
      sectionActive={sectionActive}
      active={mainNavActive}
    />
  );
}
