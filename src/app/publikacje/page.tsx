import { PagePlaceholder } from "@/components/PagePlaceholder";
import { footerSitemap } from "@/navigation";

const title = footerSitemap.find((item) => item.href === "/publikacje")!.label;

export default function PublicationsPage() {
  return <PagePlaceholder title={title} />;
}
