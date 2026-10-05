import type { MDXProps } from "mdx/types";
import type { ComponentType } from "react";
import type { News, NewsKind, NewsLayout, NewsRelatedLink } from "@/content/types";
import { newsManifestEntries } from "@/content/news-manifest";
import { newsModules } from "@/content/news-registry";
import { NEWS_ARCHIVE_UNTIL_YEAR } from "@/config/news";
import { todayInWarsaw } from "@/lib/isoDate";
import { getLectureSeasonHref, getSeason, isCurrentLectureSeason } from "@/content/lectures";
import { pl } from "@/i18n/pl";

/** Manifest / MDX frontmatter entry: the `News` model minus the MDX body, plus build-time fields. */
export type NewsFrontmatter = Omit<News, "body"> & {
  sample?: boolean;
  /** Stripped MDX body — manifest only, for fallback excerpts (K-63). */
  bodyText?: string;
};

const NEWS_LAYOUTS: NewsLayout[] = ["wydarzenie", "galeria", "tekst", "program"];

export type NewsListEntry = NewsFrontmatter & {
  displayExcerpt?: string;
};

export type LoadedNews = NewsListEntry & {
  Content: ComponentType<MDXProps>;
};

const EXCERPT_MAX_CHARS = 180;
const EXCERPT_MIN_CHARS = 40;
const EXCERPT_UPPERCASE_RATIO = 0.5;
const PROGRAM_DATE_PATTERN = /^\d{1,2}\.\d{1,2}/;

const photoPluralRules = new Intl.PluralRules("pl");

function validateFeaturedEntries(entries: NewsFrontmatter[]): void {
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

validateFeaturedEntries(newsManifestEntries);

function validateNewsLayouts(entries: NewsFrontmatter[]): void {
  entries.forEach((entry) => {
    if (!entry.layout) {
      throw new Error(`News entry "${entry.slug}" is missing required layout`);
    }
    if (!NEWS_LAYOUTS.includes(entry.layout)) {
      throw new Error(`News entry "${entry.slug}" has unknown layout: ${entry.layout}`);
    }
    if (entry.facts && entry.facts.length > 0 && entry.layout !== "wydarzenie") {
      throw new Error(`News entry "${entry.slug}" has facts but layout is not wydarzenie`);
    }
    if (entry.layout === "galeria" && (!entry.images || entry.images.length === 0)) {
      console.warn(
        `[news] "${entry.slug}": layout galeria without images — effective layout tekst`,
      );
    }
    if (entry.lectureSeason !== undefined && !getSeason(entry.lectureSeason)) {
      throw new Error(`News entry "${entry.slug}": unknown lectureSeason "${entry.lectureSeason}"`);
    }
    if (entry.columnImageIndex !== undefined) {
      const index = entry.columnImageIndex;
      const count = entry.images?.length ?? 0;
      if (!Number.isInteger(index) || index < 0 || index >= count) {
        throw new Error(
          `News entry "${entry.slug}": columnImageIndex ${index} is out of range for images (${count})`,
        );
      }
    }
  });
}

validateNewsLayouts(newsManifestEntries);

/** Layout with build-time fallback when galeria has no images (D5). */
export function getEffectiveNewsLayout(entry: NewsFrontmatter): NewsLayout {
  if (entry.layout === "galeria" && (!entry.images || entry.images.length === 0)) {
    return "tekst";
  }
  return entry.layout;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/[*_#>`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const TYPOGRAPHIC_QUOTES_PATTERN = /[\u201C\u201D\u201E\u201F\u00AB\u00BB\u2018\u2019\u201A\u201B\u2039\u203A"']/g;

/** Normalize text for F11 lead vs body comparison (manifest `bodyText`, K-63). */
function normalizeTextForLeadComparison(text: string): string {
  const withoutTags = text.replace(/<[^>]+>/g, " ");
  return stripMarkdown(withoutTags)
    .replace(TYPOGRAPHIC_QUOTES_PATTERN, "")
    .toLowerCase();
}

/**
 * Whether the article page should render the lead (`excerpt` / fallback excerpt).
 * F11: hidden when normalized lead is a prefix of normalized `bodyText`; `hideLead` wins.
 */
export function shouldShowLead(entry: NewsFrontmatter): boolean {
  if (entry.hideLead) {
    return false;
  }

  const leadText = getExcerpt(entry);
  if (!leadText) {
    return false;
  }

  const bodySource = entry.bodyText;
  if (!bodySource) {
    return true;
  }

  const normalizedLead = normalizeTextForLeadComparison(leadText);
  if (!normalizedLead) {
    return false;
  }

  const normalizedBody = normalizeTextForLeadComparison(bodySource);
  return !normalizedBody.startsWith(normalizedLead);
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

/** All news entries, newest first (D-07-06) — enriched once at module load. */
const sortedNews: NewsListEntry[] = newsManifestEntries.map(enrichListEntry);

export function getNews(): NewsListEntry[] {
  return sortedNews;
}

export function getNewsBySlug(slug: string): NewsListEntry | undefined {
  return sortedNews.find((item) => item.slug === slug);
}

/** Featured list entry — at most one active; undefined when none (K-62, K-73). */
export function getFeaturedNews(): NewsListEntry | undefined {
  return sortedNews.find((item) => item.featured);
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

function getNewsEventEndDate(entry: NewsFrontmatter): string {
  return entry.dateEnd ?? entry.date;
}

/** True when `today` (Warsaw) is after the event end (E7: `dateEnd` = koniec wydarzenia). */
function isNewsEventEnded(entry: NewsFrontmatter, today: string = todayInWarsaw()): boolean {
  return today > getNewsEventEndDate(entry);
}

export type NewsEventPhase = "zapowiedz" | "relacja" | "po-terminie";

/** Phase for `layout: wydarzenie` only (README §5, E3). */
export function getNewsEventPhase(
  entry: NewsFrontmatter,
  today: string = todayInWarsaw(),
): NewsEventPhase | null {
  if (getEffectiveNewsLayout(entry) !== "wydarzenie") {
    return null;
  }

  const imageCount = entry.images?.length ?? 0;
  if (!isNewsEventEnded(entry, today)) {
    return "zapowiedz";
  }
  if (imageCount > 0) {
    return "relacja";
  }
  return "po-terminie";
}

const DEFAULT_RELATED_BY_KIND: Partial<Record<NewsKind, NewsRelatedLink>> = {
  warsztaty: { label: pl.news.relatedDefaults.warsztaty, href: "/warsztaty/kurs-roczny-i-trzyletni" },
  wyklady: { label: pl.news.relatedDefaults.wyklady, href: "/wyklady" },
  wystawa: { label: pl.news.relatedDefaults.wystawa, href: "/ikony/wystawy" },
  wyjazd: { label: pl.news.relatedDefaults.wyjazd, href: "/warsztaty/letnia-szkola-swiatla" },
};

/** Link to a lecture season's program — hub while current, archive anchor afterwards (LK1). */
export function getLectureSeasonLink(seasonSlug: string): NewsRelatedLink {
  return {
    label: isCurrentLectureSeason(seasonSlug)
      ? pl.news.relatedDefaults.wyklady
      : pl.news.relatedLectureArchive,
    href: getLectureSeasonHref(seasonSlug),
  };
}

/** Default „Powiązane” from `lectureSeason` or `kind` (D7), max 2 links. */
export function getNewsRelatedLinks(entry: NewsFrontmatter): NewsRelatedLink[] {
  if (entry.related && entry.related.length > 0) {
    return entry.related.slice(0, 2);
  }

  if (entry.lectureSeason) {
    return [getLectureSeasonLink(entry.lectureSeason)];
  }

  const fallback = DEFAULT_RELATED_BY_KIND[entry.kind];
  return fallback ? [fallback] : [];
}

export type NewsEventCtaLink = {
  label: string;
  href: string;
};

/** Primary CTA in `wydarzenie` zapowiedź — same destinations as related defaults where defined. */
export function getNewsEventCta(kind: NewsKind): NewsEventCtaLink | undefined {
  const related = DEFAULT_RELATED_BY_KIND[kind];
  if (!related) {
    return undefined;
  }

  const ctaLabels = pl.news.eventCta as Partial<Record<NewsKind, string>>;
  const ctaLabel = ctaLabels[kind];
  if (!ctaLabel) {
    return undefined;
  }

  return { label: ctaLabel, href: related.href };
}

