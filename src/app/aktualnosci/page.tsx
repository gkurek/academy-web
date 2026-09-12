import { PagePlaceholder } from "@/components/PagePlaceholder";
import { footerSitemap } from "@/navigation";

const title = footerSitemap.find((item) => item.href === "/aktualnosci")!.label;

export default function NewsPage() {
  return <PagePlaceholder title={title} />;
}
