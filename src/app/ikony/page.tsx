import type { Metadata } from "next";

import { GalleryPage } from "@/components/gallery/GalleryPage";
import { getIconTags, getIconWorks } from "@/content/icons";
import { getPageSeo } from "@/content/seo";
import { pageMetadata } from "@/lib/metadata";
import { navTitle } from "@/navigation";

const path = "/ikony";

export const metadata: Metadata = pageMetadata({ path, title: navTitle(path), ...getPageSeo(path) });

export default function IconsPage() {
  return <GalleryPage path={path} works={getIconWorks()} tags={getIconTags()} />;
}
