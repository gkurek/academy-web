import { LecturersPage } from "@/components/lectures/LecturersPage";
import { getLecturers, getLecturersPageIntro } from "@/content/lecturers";
import { getTotalSeasonCount } from "@/content/lectures";
import { mainNav, sectionNav } from "@/navigation";

const mainNavActive = mainNav.find((item) => item.href === "/wyklady")!.label;
const sectionActive = sectionNav.wyklady.find((link) => link.href === "/wyklady/wykladowcy")!.label;

export default function LecturersRoutePage() {
  const lecturers = getLecturers();
  const intro = getLecturersPageIntro(getTotalSeasonCount());

  return (
    <LecturersPage
      lecturers={lecturers}
      intro={intro}
      section="wyklady"
      sectionActive={sectionActive}
      active={mainNavActive}
    />
  );
}