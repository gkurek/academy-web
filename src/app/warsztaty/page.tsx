import { PagePlaceholder } from "@/components/PagePlaceholder";
import { mainNav, sectionNav } from "@/navigation";

const title = mainNav.find((item) => item.href === "/warsztaty")!.label;

export default function WorkshopsPage() {
  return (
    <PagePlaceholder
      title={title}
      active={title}
      section="warsztaty"
      sectionActive={sectionNav.warsztaty[0].label}
    />
  );
}
