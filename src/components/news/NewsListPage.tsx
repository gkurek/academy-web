import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { NewsArchive } from "@/components/news/NewsArchive";
import { NewsFeatured } from "@/components/news/NewsFeatured";
import { NewsListScrollRestore } from "@/components/news/NewsListScrollRestore";
import { NewsYearGroups } from "@/components/news/NewsYearGroups";
import { YearNav } from "@/components/news/YearNav";
import type { NewsListEntry, NewsYearGroup } from "@/content/news";
import { pl } from "@/i18n/pl";
import { PageHeading } from "@/components/core/PageHeading";

export interface NewsListPageProps {
  visibleGroups: NewsYearGroup[];
  archiveGroups: NewsYearGroup[];
  archiveYearRange: string;
  years: string[];
  archiveYears: string[];
  /** Route path — see SectionPageShellProps["path"]. */
  path: string;
  featured?: NewsListEntry;
}

export function NewsListPage({
  visibleGroups,
  archiveGroups,
  archiveYearRange,
  years,
  archiveYears,
  path,
  featured,
}: NewsListPageProps) {
  return (
    <SectionPageShell path={path}>
      <NewsListScrollRestore years={years} archiveYears={archiveYears} />
      <PageHeading level="page" className="mb-space-5">
        {pl.news.title}
      </PageHeading>
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
