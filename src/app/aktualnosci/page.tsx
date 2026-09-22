import { NewsListPage } from "@/components/news/NewsListPage";
import { getFeaturedNews, getNewsGroupedByYear, splitNewsGroupsByArchive } from "@/content/news";
import { pl } from "@/i18n/pl";

export default function NewsPage() {
  const groups = getNewsGroupedByYear();
  const { visibleGroups, archiveGroups, archiveYearRange } = splitNewsGroupsByArchive(groups);
  const years = groups.map((group) => group.year);
  const archiveYears = archiveGroups.map((group) => group.year);
  const featured = getFeaturedNews();

  return (
    <NewsListPage
      visibleGroups={visibleGroups}
      archiveGroups={archiveGroups}
      archiveYearRange={archiveYearRange}
      years={years}
      archiveYears={archiveYears}
      active={pl.header.newsLink}
      featured={featured}
    />
  );
}
