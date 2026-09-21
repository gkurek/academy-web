import { NewsListPage } from "@/components/news/NewsListPage";
import { getNewsGroupedByYear } from "@/content/news";
import { pl } from "@/i18n/pl";

export default function NewsPage() {
  const groups = getNewsGroupedByYear();
  const years = groups.map((group) => group.year);

  return <NewsListPage groups={groups} years={years} active={pl.header.newsLink} />;
}
