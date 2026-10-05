import type { Metadata } from "next";

import { WorkshopsHubPage } from "@/components/workshops/WorkshopsHubPage";
import { getWorkshopOffers } from "@/content/offers";
import { getWorkshopTestimonials } from "@/content/testimonials";
import { navTitle } from "@/navigation";

const path = "/warsztaty";

export const metadata: Metadata = {
  title: navTitle(path),
};

export default function WorkshopsPage() {
  return <WorkshopsHubPage path={path} offers={getWorkshopOffers()} quotes={getWorkshopTestimonials()} />;
}
