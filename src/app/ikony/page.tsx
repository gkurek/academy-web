import { PagePlaceholder } from "@/components/PagePlaceholder";
import { mainNav, sectionNav } from "@/navigation";

const title = mainNav.find((item) => item.href === "/ikony")!.label;

export default function IconsPage() {
  return (
    <PagePlaceholder
      title={title}
      active={title}
      section="ikony"
      sectionActive={sectionNav.ikony[0].label}
    />
  );
}
