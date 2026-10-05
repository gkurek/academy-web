import { WorkshopPage } from "@/components/text/WorkshopPage";
import { getWorkshopPage } from "@/content/pages";

export default function StudioPage() {
  const page = getWorkshopPage();

  return <WorkshopPage page={page} />;
}
