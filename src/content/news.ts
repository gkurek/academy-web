import type { ComponentType } from "react";
import type { Image, NewsKind } from "@/content/types";
import newsManifest from "../../content/news/manifest.json";
import { newsModules } from "@/content/news-registry";
import { NEWS_ARCHIVE_UNTIL_YEAR } from "@/config/news";
import { formatDateRange } from "@/lib/formatDateRange";
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
  /** Traveling exhibition venue — drives the #wyjazdowe list (K-87). */
  venue?: string;
  featured?: boolean;
  /** After this date (YYYY-MM-DD) the entry loses featured status at build time (K-73). */
  featuredUntil?: string;
  /** Stripped MDX body — manifest only, for fallback excerpts (K-63). */
  bodyText?: string;
};

export type TravelingExhibitionEntry = {
  label: string;
  newsSlug: string;
};

export type NewsListEntry = NewsFrontmatter & {
  displayExcerpt?: string;
};

export type LoadedNews = NewsListEntry & {
  body: string;
  Content: ComponentType;
};

const EXCERPT_MAX_CHARS = 180;
const EXCERPT_MIN_CHARS = 40;
const EXCERPT_UPPERCASE_RATIO = 0.5;
const PROGRAM_DATE_PATTERN = /^\d{1,2}\.\d{1,2}/;

const photoPluralRules = new Intl.PluralRules("pl");

const allNewsEntries = newsManifest as NewsFrontmatter[];

function compareByDateDesc(a: NewsFrontmatter, b: NewsFrontmatter): number {
  return b.date.localeCompare(a.date);
}

function getBuildDateIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function isFeaturedActive(entry: NewsFrontmatter): boolean {
  if (!entry.featured) {
    return false;
  }

  if (entry.featuredUntil && entry.featuredUntil < getBuildDateIso()) {
    return false;
  }

  return true;
}

function validateFeaturedEntries(entries: NewsFrontmatter[]): void {
  entries.forEach((entry) => {
    if (entry.featuredUntil && !entry.featured) {
      throw new Error(
        `News entry "${entry.slug}" has featuredUntil but featured is not true`,
      );
    }
  });

  const featuredEntries = entries.filter((entry) => entry.featured);

  if (featuredEntries.length > 1) {
    const slugs = featuredEntries.map((entry) => entry.slug).join(", ");
    throw new Error(`At most one news entry may have featured: true (found: ${slugs})`);
  }

  const featured = featuredEntries[0];
  if (featured && !featured.cover) {
    throw new Error(`Featured news entry "${featured.slug}" must have a cover image`);
  }
}

validateFeaturedEntries(allNewsEntries);

function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/[*_#>`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function uppercaseLetterRatio(text: string): number {
  const letters = text.replace(/[^a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, "");
  if (letters.length === 0) {
    return 0;
  }

  const uppercaseLetters = letters.replace(/[^A-ZĄĆĘŁŃÓŚŹŻ]/g, "");
  return uppercaseLetters.length / letters.length;
}

function takeFullSentences(text: string, maxChars: number): string {
  const sentences = text.split(/(?<=[.!?…])\s+/).filter(Boolean);

  return sentences.reduce<{ text: string; complete: boolean }>(
    (state, sentence) => {
      if (state.complete) {
        return state;
      }

      const candidate = state.text ? `${state.text} ${sentence}` : sentence;
      if (candidate.length <= maxChars) {
        return { text: candidate, complete: false };
      }

      return { text: state.text, complete: true };
    },
    { text: "", complete: false },
  ).text;
}

/**
 * Fallback excerpt rules (K-63). Manual `excerpt` in frontmatter wins unchanged.
 *
 * Manual verification targets (no test runner in repo):
 * - noc-swiatyn-2019 — manual excerpt with markdown link stays as-is
 * - wyklady-2019-2020, ikona-korzenie-i-owoce-wiary-mistyka-dzis-wyklady-2026-2027 — program dumps → no fallback
 * - pracujemy — short body → no fallback or short clean text
 * - nabor-kursu-2026-2027 — manual excerpt wins
 */
export function getExcerpt(entry: NewsFrontmatter, bodyText?: string): string | undefined {
  if (entry.excerpt) {
    return entry.excerpt;
  }

  const source = bodyText ?? entry.bodyText;
  if (!source) {
    return undefined;
  }

  const cleaned = stripMarkdown(source);
  if (!cleaned) {
    return undefined;
  }

  const excerpt = takeFullSentences(cleaned, EXCERPT_MAX_CHARS);
  if (!excerpt || excerpt.length < EXCERPT_MIN_CHARS) {
    return undefined;
  }

  if (uppercaseLetterRatio(excerpt) > EXCERPT_UPPERCASE_RATIO) {
    return undefined;
  }

  if (PROGRAM_DATE_PATTERN.test(excerpt.trim())) {
    return undefined;
  }

  return excerpt;
}

function enrichListEntry(entry: NewsFrontmatter): NewsListEntry {
  return {
    ...entry,
    displayExcerpt: getExcerpt(entry),
  };
}

function getPhotoWord(count: number): string {
  const rule = photoPluralRules.select(count);
  if (rule === "one") {
    return pl.news.galleryPhotoForms.one;
  }
  if (rule === "few") {
    return pl.news.galleryPhotoForms.few;
  }
  return pl.news.galleryPhotoForms.many;
}

/** “Galeria · N zdjęć” for list metadata (K-62). */
export function formatGalleryCount(imageCount: number): string | undefined {
  if (imageCount <= 0) {
    return undefined;
  }

  return pl.news.galleryCountLabel
    .replace("{count}", String(imageCount))
    .replace("{word}", getPhotoWord(imageCount));
}

/** Display date for list cards — with year (K-72). */
export function formatNewsListDate(date: string, dateEnd?: string): string {
  return formatDateRange(date, dateEnd, { withYear: true });
}

/** Display date for article and featured entry — with year (K-64). */
export function formatNewsDate(date: string, dateEnd?: string): string {
  return formatDateRange(date, dateEnd, { withYear: true });
}

/** All news entries, newest first (D-07-06). */
export function getNews(): NewsListEntry[] {
  return [...allNewsEntries].sort(compareByDateDesc).map(enrichListEntry);
}

export function getNewsBySlug(slug: string): NewsListEntry | undefined {
  const entry = allNewsEntries.find((item) => item.slug === slug);
  return entry ? enrichListEntry(entry) : undefined;
}

/** Featured list entry — at most one active; undefined when none (K-62, K-73). */
export function getFeaturedNews(): NewsListEntry | undefined {
  const entry = allNewsEntries.find((item) => isFeaturedActive(item));
  return entry ? enrichListEntry(entry) : undefined;
}

/** Full article with MDX body component — undefined when slug is unknown. */
export function loadNewsBySlug(slug: string): LoadedNews | undefined {
  const newsModule = newsModules[slug];
  if (!newsModule) {
    return undefined;
  }

  const entry = enrichListEntry(newsModule.frontmatter);

  return {
    ...entry,
    body: "",
    Content: newsModule.Content,
  };
}

export type NewsYearGroup = {
  year: string;
  entries: NewsListEntry[];
};

export type SplitNewsGroups = {
  visibleGroups: NewsYearGroup[];
  archiveGroups: NewsYearGroup[];
  archiveYearRange: string;
};

/** Splits year groups into always-visible and collapsed archive blocks (K-66). */
export function splitNewsGroupsByArchive(
  groups: NewsYearGroup[],
  untilYear: number = NEWS_ARCHIVE_UNTIL_YEAR,
): SplitNewsGroups {
  const visibleGroups = groups.filter((group) => Number(group.year) > untilYear);
  const archiveGroups = groups.filter((group) => Number(group.year) <= untilYear);

  const archiveYears = archiveGroups.map((group) => group.year);
  const archiveYearRange =
    archiveYears.length > 0
      ? `${archiveYears[archiveYears.length - 1]}–${archiveYears[0]}`
      : "";

  return { visibleGroups, archiveGroups, archiveYearRange };
}

/** Groups entries by calendar year of `date` (D-07-10), years descending; excludes featured (K-62). */
export function getNewsGroupedByYear(): NewsYearGroup[] {
  const featuredSlug = getFeaturedNews()?.slug;
  const groups = new Map<string, NewsListEntry[]>();

  getNews()
    .filter((entry) => entry.slug !== featuredSlug)
    .forEach((entry) => {
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

/** Traveling exhibitions for `#wyjazdowe` — `kind: "wystawa"` with `venue` (K-87). */
export function getTravelingExhibitions(): TravelingExhibitionEntry[] {
  return getNews()
    .filter((entry) => entry.kind === "wystawa" && entry.venue)
    .map((entry) => ({
      label: `${entry.venue} · ${entry.date.slice(0, 4)}`,
      newsSlug: entry.slug,
    }));
}
