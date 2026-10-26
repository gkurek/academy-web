import type { Metadata } from "next";

import { WorkshopPage } from "@/components/text/WorkshopPage";
import { getWorkshopPage } from "@/content/pages";
import { getPageSeo } from "@/content/seo";
import { pageMetadata } from "@/lib/metadata";
import { navTitle } from "@/navigation";

const path = "/pracownia";

export const metadata: Metadata = pageMetadata({ path, title: navTitle(path), ...getPageSeo(path) });

export default function StudioPage() {
  return <WorkshopPage page={getWorkshopPage()} path={path} />;
}
