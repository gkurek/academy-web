import { notFound } from "next/navigation";

import { WorkshopPage } from "@/components/text/WorkshopPage";
import { getWorkshopPage } from "@/content/pages";

export default function StudioPage() {
  const page = getWorkshopPage();
  if (!page) {
    notFound();
  }

  return <WorkshopPage page={page} />;
}
