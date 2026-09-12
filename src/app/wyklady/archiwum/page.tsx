import { PagePlaceholder } from "@/components/PagePlaceholder";
import { sectionNav } from "@/navigation";

const item = sectionNav.wyklady.find((link) => link.href === "/wyklady/archiwum")!;

export default function LecturesArchivePage() {
  return (
    <PagePlaceholder title={item.label} active="Wykłady" section="wyklady" sectionActive={item.label} />
  );
}
