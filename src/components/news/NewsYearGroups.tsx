import { NewsCard } from "@/components/news/NewsCard";
import type { NewsYearGroup } from "@/content/news";

export interface NewsYearGroupsProps {
  groups: NewsYearGroup[];
  className?: string;
}

export function NewsYearGroups({ groups, className }: NewsYearGroupsProps) {
  return (
    <ol className={className ?? "news-list"}>
      {groups.flatMap((group) =>
        group.entries.map((entry, index) => {
          const isYearStart = index === 0;

          return (
            <li
              key={entry.slug}
              id={isYearStart ? group.year : undefined}
              className={isYearStart ? "news-list-item news-year-start" : "news-list-item"}
              data-year-start={isYearStart ? group.year : undefined}
            >
              <NewsCard entry={entry} />
            </li>
          );
        }),
      )}
    </ol>
  );
}
