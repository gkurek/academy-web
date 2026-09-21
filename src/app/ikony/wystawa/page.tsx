import { PagePlaceholder } from "@/components/PagePlaceholder";
import { mainNav, sectionNav } from "@/navigation";

const mainNavActive = mainNav.find((item) => item.href === "/ikony")!.label;
const sectionItem = sectionNav.ikony.find((link) => link.href === "/ikony/wystawa")!;

export default function ExhibitionPage() {
  return (
    <PagePlaceholder
      title={sectionItem.label}
      active={mainNavActive}
      section="ikony"
      sectionActive={sectionItem.label}
    />
  );
}
