import type { Metadata } from "next";

import { LecturesArchivePage } from "@/components/lectures/LecturesArchivePage";
import { getArchiveGalleryPhotos, getArchiveIntro, getArchiveSeasons } from "@/content/lectures";
import { navTitle } from "@/navigation";

const path = "/wyklady/archiwum";

export const metadata: Metadata = {
  title: navTitle(path),
};

export default function LecturesArchiveRoutePage() {
  return (
    <LecturesArchivePage
      seasons={getArchiveSeasons()}
      intro={getArchiveIntro()}
      galleryPhotos={getArchiveGalleryPhotos()}
      path={path}
    />
  );
}
