import { PagePlaceholder } from "@/components/PagePlaceholder";
import { mainNav, sectionNav } from "@/navigation";

const title = mainNav.find((item) => item.href === "/wyklady")!.label;

export default function LecturesPage() {
  return (
    <PagePlaceholder
      title={title}
      active={title}
      section="wyklady"
      sectionActive={sectionNav.wyklady[0].label}
    />
  );
}
