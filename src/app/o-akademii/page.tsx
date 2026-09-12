import { PagePlaceholder } from "@/components/PagePlaceholder";
import { mainNav } from "@/navigation";

const title = mainNav.find((item) => item.href === "/o-akademii")!.label;

export default function AboutPage() {
  return <PagePlaceholder title={title} active={title} />;
}
