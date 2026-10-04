import archiveMeta from "../../content/lectures/archive.json";
import season20122013Data from "../../content/lectures/2012-2013.json";
import season20132014Data from "../../content/lectures/2013-2014.json";
import season20142015Data from "../../content/lectures/2014-2015.json";
import season20152016Data from "../../content/lectures/2015-2016.json";
import season20162017Data from "../../content/lectures/2016-2017.json";
import season20172018Data from "../../content/lectures/2017-2018.json";
import season20182019Data from "../../content/lectures/2018-2019.json";
import season20192020Data from "../../content/lectures/2019-2020.json";
import season20202021Data from "../../content/lectures/2020-2021.json";
import season20212022Data from "../../content/lectures/2021-2022.json";
import season20222023Data from "../../content/lectures/2022-2023.json";
import season20232024Data from "../../content/lectures/2023-2024.json";
import season20242025Data from "../../content/lectures/2024-2025.json";
import season20252026Data from "../../content/lectures/2025-2026.json";
import currentSeasonData from "../../content/lectures/2026-2027.json";
import { getLecturerDirectoryEntry } from "@/content/lecturer-directory";
import { formatLecturerDisplayName, getLecturer, getLecturerProfileHref } from "@/content/lecturers";
import type { Lecture, LectureSeason } from "@/content/types";

const CURRENT_SEASON_SLUG = "2026-2027";
const LECTURE_TITLE_SEPARATOR = " · ";

type LectureSeasonFile = LectureSeason & { sample?: boolean };

const seasonModules: Record<string, LectureSeasonFile> = {
  "2026-2027": currentSeasonData as LectureSeasonFile,
  "2025-2026": season20252026Data as LectureSeasonFile,
  "2024-2025": season20242025Data as LectureSeasonFile,
  "2023-2024": season20232024Data as LectureSeasonFile,
  "2022-2023": season20222023Data as LectureSeasonFile,
  "2021-2022": season20212022Data as LectureSeasonFile,
  "2020-2021": season20202021Data as LectureSeasonFile,
  "2019-2020": season20192020Data as LectureSeasonFile,
  "2018-2019": season20182019Data as LectureSeasonFile,
  "2017-2018": season20172018Data as LectureSeasonFile,
  "2016-2017": season20162017Data as LectureSeasonFile,
  "2015-2016": season20152016Data as LectureSeasonFile,
  "2014-2015": season20142015Data as LectureSeasonFile,
  "2013-2014": season20132014Data as LectureSeasonFile,
  "2012-2013": season20122013Data as LectureSeasonFile,
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

export type LectureTalk = {
  title: string;
  lecturer?: string;
  lecturerHref?: string;
};

export type LectureListItem = {
  date: string;
  dateIso: string;
  talks: LectureTalk[];
  note?: string;
};

export type LoadedLectureSeason = Omit<LectureSeason, "lectures"> & {
  lectures: LectureListItem[];
  placeholder?: boolean;
};

type ArchiveMeta = {
  intro: string;
  firstSeason: string;
  lastSeason: string;
  archivalSeasonCount: number;
  totalSeasonCount: number;
};

export function formatLectureDate(isoDate: string): string {
  const [, month, day] = isoDate.split("-");
  const monthIndex = Number(month) - 1;
  const dayNumber = Number(day);

  if (monthIndex < 0 || monthIndex > 11 || Number.isNaN(dayNumber)) {
    return isoDate;
  }

  return `${dayNumber} ${monthNamesGenitive[monthIndex]}`;
}

function slugToDisplayName(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildLecturerLabel(entry: {
  name: string;
  titles?: string;
  affiliation?: string;
}): string {
  const label = formatLecturerDisplayName(entry);
  return entry.affiliation ? `${label}, ${entry.affiliation}` : label;
}

export function formatLecturerLabel(slug: string): string {
  const directoryEntry = getLecturerDirectoryEntry(slug);
  const profileEntry = getLecturer(slug);

  const name = directoryEntry?.name ?? profileEntry?.name;
  if (!name) {
    return slugToDisplayName(slug);
  }

  return buildLecturerLabel({
    name,
    titles: directoryEntry?.titles ?? profileEntry?.titles,
    affiliation: directoryEntry?.affiliation ?? profileEntry?.affiliation,
  });
}

function splitLectureTitles(title: string): string[] {
  return title
    .split(LECTURE_TITLE_SEPARATOR)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

function pairTitlesWithLecturers(
  titles: string[],
  slugs: string[],
): Array<{ title: string; slug?: string }> {
  if (titles.length === 0) {
    return [];
  }

  if (slugs.length === 0) {
    return titles.map((title) => ({ title }));
  }

  if (titles.length === slugs.length) {
    return titles.map((title, index) => ({ title, slug: slugs[index] }));
  }

  if (slugs.length === 1) {
    return titles.map((title) => ({ title, slug: slugs[0] }));
  }

  return titles.map((title, index) => ({
    title,
    slug: slugs[Math.min(index, slugs.length - 1)],
  }));
}

function toLectureListItem(lecture: Lecture): LectureListItem {
  const titles = splitLectureTitles(lecture.title);
  const pairs = pairTitlesWithLecturers(titles, lecture.lecturerSlugs);

  return {
    date: formatLectureDate(lecture.date),
    dateIso: lecture.date,
    talks: pairs.map(({ title, slug }) => ({
      title,
      lecturer: slug ? formatLecturerLabel(slug) : undefined,
      lecturerHref: slug ? getLecturerProfileHref(slug) : undefined,
    })),
    note: lecture.note,
  };
}

function toLoadedSeason(season: LectureSeasonFile): LoadedLectureSeason {
  return {
    slug: season.slug,
    label: season.label,
    cycleTitle: season.cycleTitle,
    intro: season.intro,
    introSecondary: season.introSecondary,
    gallery: season.gallery,
    lectures: season.lectures.map(toLectureListItem),
  };
}

function parseSeasonStartYear(slug: string): number {
  return Number(slug.split("-")[0]);
}

function buildSeasonSlug(startYear: number): string {
  return `${startYear}-${startYear + 1}`;
}

function slugToSeasonLabel(slug: string): string {
  const [startYear, endYear] = slug.split("-");
  return `${startYear}/${endYear}`;
}

function buildArchiveSlugs(firstSeason: string, lastSeason: string): string[] {
  const startYear = parseSeasonStartYear(firstSeason);
  const endYear = parseSeasonStartYear(lastSeason);
  const seasonCount = endYear - startYear + 1;

  return Array.from({ length: seasonCount }, (_, index) =>
    buildSeasonSlug(endYear - index),
  );
}

function buildPlaceholderSeason(slug: string): LoadedLectureSeason {
  return {
    slug,
    label: slugToSeasonLabel(slug),
    cycleTitle: "",
    lectures: [],
    placeholder: true,
  };
}

function getArchiveMeta(): ArchiveMeta {
  return archiveMeta as ArchiveMeta;
}

export function getArchiveIntro(): string {
  return getArchiveMeta().intro;
}

export function getTotalSeasonCount(): number {
  return getArchiveMeta().totalSeasonCount;
}

export function getCurrentSeason(): LoadedLectureSeason {
  const season = seasonModules[CURRENT_SEASON_SLUG];
  return toLoadedSeason(season);
}

export function getArchiveSeasons(): LoadedLectureSeason[] {
  const { firstSeason, lastSeason } = getArchiveMeta();

  return buildArchiveSlugs(firstSeason, lastSeason).map((slug) => {
    const season = seasonModules[slug];
    return season && season.slug !== CURRENT_SEASON_SLUG
      ? toLoadedSeason(season)
      : buildPlaceholderSeason(slug);
  });
}

export function getSeason(slug: string): LoadedLectureSeason | undefined {
  const season = seasonModules[slug];
  return season ? toLoadedSeason(season) : undefined;
}

export type SeasonLectureEntry = {
  seasonSlug: string;
  lecture: Lecture;
};

/** Raw lectures of every loaded season, sorted by date ascending (home „Najbliższe”, N5). */
export function getAllSeasonLectures(): SeasonLectureEntry[] {
  return Object.values(seasonModules)
    .flatMap((season) => season.lectures.map((lecture) => ({ seasonSlug: season.slug, lecture })))
    .sort((a, b) => a.lecture.date.localeCompare(b.lecture.date));
}

/** Short lecture-cycle theme for exhibition copy (suffix after ". " when cycleTitle has two parts). */
export function getLectureSeasonShortTheme(seasonSlug: string): string {
  const season = getSeason(seasonSlug);
  if (!season) {
    throw new Error(`lectures: unknown season "${seasonSlug}" for short theme`);
  }

  const cycleTitle = season.cycleTitle.trim();
  if (!cycleTitle) {
    throw new Error(`lectures: empty cycleTitle for season "${seasonSlug}"`);
  }

  const dotSpace = cycleTitle.indexOf(". ");
  if (dotSpace >= 0) {
    return cycleTitle.slice(dotSpace + 2).trim();
  }

  return cycleTitle;
}

/** ISO date and location for future JSON-LD Event emission (etap 7). */
export function getLectureEventData(season: LectureSeason): Array<{
  date: string;
  title: string;
  location: string;
}> {
  const location =
    "Kościół Środowisk Twórczych św. Andrzeja Apostoła i św. Brata Alberta Chmielowskiego, Plac Teatralny, Warszawa";

  return season.lectures.flatMap((lecture) =>
    splitLectureTitles(lecture.title).map((title) => ({
      date: lecture.date,
      title,
      location,
    })),
  );
}
