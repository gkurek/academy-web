import { PagePlaceholder } from "@/components/PagePlaceholder";
import { sectionNav } from "@/navigation";

const item = sectionNav.wyklady.find((link) => link.href === "/wyklady/wykladowcy")!;

export default function LecturersPage() {
  return (
    <PagePlaceholder title={item.label} active="Wykłady" section="wyklady" sectionActive={item.label} />
  );
}
