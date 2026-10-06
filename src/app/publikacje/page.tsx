import type { Metadata } from "next";

import { PublicationsHubPage } from "@/components/publications/PublicationsHubPage";
import { getArticles } from "@/content/articles";
import { requirePublication } from "@/content/publications";
import { navTitle } from "@/navigation";

const path = "/publikacje";

export const metadata: Metadata = {
  title: navTitle(path),
};

export default function PublicationsPage() {
  return <PublicationsHubPage path={path} publication={requirePublication()} articles={getArticles()} />;
}
