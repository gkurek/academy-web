import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { NewsCard } from "@/components/news/NewsCard";
import { YearHeading } from "@/components/news/YearHeading";
import { YearNav } from "@/components/news/YearNav";
import type { NewsYearGroup } from "@/content/news";
import { pl } from "@/i18n/pl";

export interface NewsListPageProps {
  groups: NewsYearGroup[];
  years: string[];
  active: string;
}

export function NewsListPage({ groups, years, active }: NewsListPageProps) {
  return (
    <SectionPageShell active={active}>
      <h1 className="font-serif text-size-h1-m md:text-size-h1 leading-tight text-text-h1 mb-space-5">
        {pl.news.title}
      </h1>
      <p className="text-size-lead-m md:text-size-lead leading-body text-text-secondary max-w-measure-lead mb-space-6">
        {pl.news.lead}
      </p>
      <YearNav years={years} />
      <div className="news-year-groups">
        {groups.map((group) => (
          <section key={group.year} className="news-year-group" aria-labelledby={group.year}>
            <YearHeading year={group.year} />
            <div className="news-list">
              {group.entries.map((entry) => (
                <NewsCard key={entry.slug} entry={entry} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </SectionPageShell>
  );
}
