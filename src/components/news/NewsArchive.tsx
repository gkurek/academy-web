import { NewsArchiveShell } from "@/components/news/NewsArchiveShell";
import { NewsYearGroups } from "@/components/news/NewsYearGroups";
import type { NewsYearGroup } from "@/content/news";

export interface NewsArchiveProps {
  groups: NewsYearGroup[];
  yearRange: string;
}

export function NewsArchive({ groups, yearRange }: NewsArchiveProps) {
  if (groups.length === 0) {
    return null;
  }

  const entryCount = groups.reduce((total, group) => total + group.entries.length, 0);
  const archiveYears = groups.map((group) => group.year);
  const firstYearId = groups[0].year;

  return (
    <NewsArchiveShell
      archiveYears={archiveYears}
      entryCount={entryCount}
      yearRange={yearRange}
      firstYearId={firstYearId}
    >
      <NewsYearGroups groups={groups} className="news-list" />
    </NewsArchiveShell>
  );
}
