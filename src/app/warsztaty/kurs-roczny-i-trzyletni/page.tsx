import { PagePlaceholder } from "@/components/PagePlaceholder";
import { sectionNav } from "@/navigation";

const item = sectionNav.warsztaty.find((link) => link.href === "/warsztaty/kurs-roczny-i-trzyletni")!;

export default function AnnualAndThreeYearCoursePage() {
  return (
    <PagePlaceholder title={item.label} active="Warsztaty" section="warsztaty" sectionActive={item.label} />
  );
}
