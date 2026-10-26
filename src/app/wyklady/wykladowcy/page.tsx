import type { Metadata } from "next";

import { LecturersPage } from "@/components/lectures/LecturersPage";
import { getLecturers, getLecturersPageIntro } from "@/content/lecturers";
import { getTotalSeasonCount } from "@/content/lectures";
import { getPageSeo } from "@/content/seo";
import { pageMetadata } from "@/lib/metadata";
import { navTitle } from "@/navigation";

const path = "/wyklady/wykladowcy";

export const metadata: Metadata = pageMetadata({ path, title: navTitle(path), ...getPageSeo(path) });

export default function LecturersRoutePage() {
  return (
    <LecturersPage lecturers={getLecturers()} intro={getLecturersPageIntro(getTotalSeasonCount())} path={path} />
  );
}
