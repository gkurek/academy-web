import { PagePlaceholder } from "@/components/PagePlaceholder";
import { mainNav, sectionNav } from "@/navigation";

const title = mainNav.find((item) => item.href === "/wydarzenia")!.label;

export default function EventsPage() {
  return (
    <PagePlaceholder
      title={title}
      active={title}
      section="wydarzenia"
      sectionActive={sectionNav.wydarzenia[0].label}
    />
  );
}
