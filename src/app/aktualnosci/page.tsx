import type { Metadata } from "next";

import { NewsListPage } from "@/components/news/NewsListPage";
import { getFeaturedNews, getNewsGroupedByYear, splitNewsGroupsByArchive } from "@/content/news";
import { navTitle } from "@/navigation";

const path = "/aktualnosci";

export const metadata: Metadata = {
  title: navTitle(path),
};

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
      featured={getFeaturedNews()}
    />
  );
}
