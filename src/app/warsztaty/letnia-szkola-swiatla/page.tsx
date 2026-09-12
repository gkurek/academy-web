import { PagePlaceholder } from "@/components/PagePlaceholder";
import { sectionNav } from "@/navigation";

const item = sectionNav.warsztaty.find((link) => link.href === "/warsztaty/letnia-szkola-swiatla")!;

export default function SummerSchoolOfLightPage() {
  return (
    <PagePlaceholder title={item.label} active="Warsztaty" section="warsztaty" sectionActive={item.label} />
  );
}
