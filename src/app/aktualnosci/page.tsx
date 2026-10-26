import type { Metadata } from "next";

import { NewsListPage } from "@/components/news/NewsListPage";
import { getFeaturedNews, getNewsGroupedByYear, splitNewsGroupsByArchive } from "@/content/news";
import { getNewsListPage } from "@/content/pages";
import { getPageSeo } from "@/content/seo";
import { pageMetadata } from "@/lib/metadata";
import { navTitle } from "@/navigation";

const path = "/aktualnosci";

export const metadata: Metadata = pageMetadata({ path, title: navTitle(path), ...getPageSeo(path) });

export default function NewsPage() {
  const groups = getNewsGroupedByYear();
  const { visibleGroups, archiveGroups, archiveYearRange } = splitNewsGroupsByArchive(groups);

  return (
    <NewsListPage
      visibleGroups={visibleGroups}
      archiveGroups={archiveGroups}
      archiveYearRange={archiveYearRange}
      years={groups.map((group) => group.year)}
      archiveYears={archiveGroups.map((group) => group.year)}
      path={path}
      lead={getNewsListPage().lead}
      featured={getFeaturedNews()}
    />
  );
}
