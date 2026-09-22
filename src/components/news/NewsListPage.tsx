import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { NewsArchive } from "@/components/news/NewsArchive";
import { NewsFeatured } from "@/components/news/NewsFeatured";
import { NewsListScrollRestore } from "@/components/news/NewsListScrollRestore";
import { NewsYearGroups } from "@/components/news/NewsYearGroups";
import { YearNav } from "@/components/news/YearNav";
import type { NewsListEntry, NewsYearGroup } from "@/content/news";
import { pl } from "@/i18n/pl";

export interface NewsListPageProps {
  visibleGroups: NewsYearGroup[];
  archiveGroups: NewsYearGroup[];
  archiveYearRange: string;
  years: string[];
  archiveYears: string[];
  active: string;
  featured?: NewsListEntry;
}

export function NewsListPage({
  visibleGroups,
  archiveGroups,
  archiveYearRange,
  years,
  archiveYears,
  active,
  featured,
}: NewsListPageProps) {
  return (
    <SectionPageShell active={active}>
      <NewsListScrollRestore years={years} archiveYears={archiveYears} />
      <h1 className="font-serif text-size-h1-m md:text-size-h1 leading-tight text-text-h1 mb-space-5">
        {pl.news.title}
      </h1>
      <p className="text-size-lead-m md:text-size-lead leading-body text-text-secondary max-w-measure-lead mb-space-6">
        {pl.news.lead}
      </p>
      {featured ? <NewsFeatured entry={featured} /> : null}
      <YearNav years={years} archiveYears={archiveYears} />
      <NewsYearGroups groups={visibleGroups} />
      <NewsArchive groups={archiveGroups} yearRange={archiveYearRange} />
    </SectionPageShell>
  );
}
