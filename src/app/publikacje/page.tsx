import type { Metadata } from "next";

import { PublicationsHubPage } from "@/components/publications/PublicationsHubPage";
import { pl } from "@/i18n/pl";

export const metadata: Metadata = {
  title: pl.publications.title,
};

export default function PublicationsPage() {
  return <PublicationsHubPage />;
}
