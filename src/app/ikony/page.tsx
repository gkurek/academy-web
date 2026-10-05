import type { Metadata } from "next";

import { GalleryPage } from "@/components/gallery/GalleryPage";
import { getIconTags, getIconWorks } from "@/content/icons";
import { navTitle } from "@/navigation";

const path = "/ikony";

export const metadata: Metadata = {
  title: navTitle(path),
};

export default function IconsPage() {
  return <GalleryPage path={path} works={getIconWorks()} tags={getIconTags()} />;
}
