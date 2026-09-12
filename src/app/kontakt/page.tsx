import { PagePlaceholder } from "@/components/PagePlaceholder";
import { mainNav } from "@/navigation";

const title = mainNav.find((item) => item.href === "/kontakt")!.label;

export default function ContactPage() {
  return <PagePlaceholder title={title} active={title} />;
}
