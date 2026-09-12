import { PagePlaceholder } from "@/components/PagePlaceholder";
import { sectionNav } from "@/navigation";

const item = sectionNav.ikony.find((link) => link.href === "/ikony/na-zamowienie")!;

export default function CustomIconsPage() {
  return (
    <PagePlaceholder title={item.label} active="Ikony" section="ikony" sectionActive={item.label} />
  );
}
