import type { ComponentType } from "react";
import type { Image, NewsKind } from "@/content/types";
import newsManifest from "../../content/news/manifest.json";
import { newsModules } from "@/content/news-registry";
import { pl } from "@/i18n/pl";

export type NewsFrontmatter = {
  slug: string;
  title: string;
  date: string;
  dateEnd?: string;
  kind: NewsKind;
  excerpt?: string;
  sample?: boolean;
  cover?: Image;
  images?: Image[];
  poster?: Image;
};

export type NewsListEntry = NewsFrontmatter;

export type LoadedNews = NewsListEntry & {
  body: string;
  Content: ComponentType;
};

const monthNamesGenitive = [
  "stycznia",
  "lutego",
  "marca",
  "kwietnia",
  "maja",
  "czerwca",
  "lipca",
  "sierpnia",
  "września",
  "października",
  "listopada",
  "grudnia",
] as const;

function formatNewsDatePart(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  const monthIndex = Number(month) - 1;
  const dayNumber = Number(day);

  if (monthIndex < 0 || monthIndex > 11 || Number.isNaN(dayNumber)) {
    return isoDate;
  }

  return `${dayNumber} ${monthNamesGenitive[monthIndex]} ${year}`;
}

/** Display date for list cards and article meta — full date, optional range via `dateEnd`. */
export function formatNewsDate(date: string, dateEnd?: string): string {
  if (dateEnd && dateEnd !== date) {
    return `${formatNewsDatePart(date)} – ${formatNewsDatePart(dateEnd)}`;
  }

  return formatNewsDatePart(date);
}

const allNewsEntries = newsManifest as NewsListEntry[];

function compareByDateDesc(a: NewsListEntry, b: NewsListEntry): number {
  return b.date.localeCompare(a.date);
}

/** All news entries, newest first (D-07-06). */
export function getNews(): NewsListEntry[] {
  return [...allNewsEntries].sort(compareByDateDesc);
}

export function getNewsBySlug(slug: string): NewsListEntry | undefined {
  return allNewsEntries.find((entry) => entry.slug === slug);
}

/** Full article with MDX body component — undefined when slug is unknown. */
export function loadNewsBySlug(slug: string): LoadedNews | undefined {
  const newsModule = newsModules[slug];
  if (!newsModule) {
    return undefined;
  }

  return {
    ...newsModule.frontmatter,
    body: "",
    Content: newsModule.Content,
  };
}

export type NewsYearGroup = {
  year: string;
  entries: NewsListEntry[];
};

/** Groups entries by calendar year of `date` (D-07-10), years descending. */
export function getNewsGroupedByYear(): NewsYearGroup[] {
  const groups = new Map<string, NewsListEntry[]>();

  getNews().forEach((entry) => {
    const year = entry.date.slice(0, 4);
    const bucket = groups.get(year);
    if (bucket) {
      bucket.push(entry);
    } else {
      groups.set(year, [entry]);
    }
  });

  return [...groups.entries()]
    .sort(([yearA], [yearB]) => yearB.localeCompare(yearA))
    .map(([year, entries]) => ({ year, entries }));
}

export type NewsNeighbors = {
  previous?: NewsListEntry;
  next?: NewsListEntry;
};

/** Prev = newer, next = older (D-07-06). */
export function getNewsNeighbors(slug: string): NewsNeighbors {
  const sorted = getNews();
  const index = sorted.findIndex((entry) => entry.slug === slug);
  if (index === -1) {
    return {};
  }

  return {
    previous: index > 0 ? sorted[index - 1] : undefined,
    next: index < sorted.length - 1 ? sorted[index + 1] : undefined,
  };
}

/** UI label for a news `kind` — keys from `pl.news.kind`. */
export function getNewsKindLabel(kind: NewsKind): string {
  return pl.news.kind[kind];
}
