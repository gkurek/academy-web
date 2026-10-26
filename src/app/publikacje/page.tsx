import type { Metadata } from "next";

import { PublicationsHubPage } from "@/components/publications/PublicationsHubPage";
import { getArticles } from "@/content/articles";
import { getPublicationsHubPage } from "@/content/pages";
import { requirePublication } from "@/content/publications";
import { getPageSeo } from "@/content/seo";
import { pageMetadata } from "@/lib/metadata";
import { navTitle } from "@/navigation";

const path = "/publikacje";

export const metadata: Metadata = pageMetadata({ path, title: navTitle(path), ...getPageSeo(path) });

export default function PublicationsPage() {
  return (
    <PublicationsHubPage
      path={path}
      lead={getPublicationsHubPage().lead}
      publication={requirePublication()}
      articles={getArticles()}
    />
  );
}
