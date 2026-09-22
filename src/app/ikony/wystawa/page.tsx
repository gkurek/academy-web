import { ExhibitionPage } from "@/components/exhibition/ExhibitionPage";
import { mainNav, sectionNav } from "@/navigation";

const mainNavActive = mainNav.find((item) => item.href === "/ikony")!.label;
const sectionItem = sectionNav.ikony.find((link) => link.href === "/ikony/wystawa")!;

export default function ExhibitionRoutePage() {
  return <ExhibitionPage active={mainNavActive} sectionActive={sectionItem.label} />;
}
