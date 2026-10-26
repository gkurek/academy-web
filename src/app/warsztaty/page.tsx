import type { Metadata } from "next";

import { WorkshopsHubPage } from "@/components/workshops/WorkshopsHubPage";
import { getWorkshopOffers } from "@/content/offers";
import { getPageSeo } from "@/content/seo";
import { pageMetadata } from "@/lib/metadata";
import { navTitle } from "@/navigation";

const path = "/warsztaty";

export const metadata: Metadata = pageMetadata({ path, title: navTitle(path), ...getPageSeo(path) });

export default function WorkshopsPage() {
  return <WorkshopsHubPage path={path} offers={getWorkshopOffers()} />;
}
