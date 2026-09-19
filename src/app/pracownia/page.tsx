import { PagePlaceholder } from "@/components/PagePlaceholder";
import { footerSitemap } from "@/navigation";

const title = footerSitemap.find((item) => item.href === "/pracownia")!.label;

export default function StudioPage() {
  return <PagePlaceholder title={title} />;
}
