import type { Metadata } from "next";

import { WorkshopPage } from "@/components/text/WorkshopPage";
import { getWorkshopPage } from "@/content/pages";
import { navTitle } from "@/navigation";

const path = "/pracownia";

export const metadata: Metadata = {
  title: navTitle(path),
};

export default function StudioPage() {
  return <WorkshopPage page={getWorkshopPage()} path={path} />;
}
