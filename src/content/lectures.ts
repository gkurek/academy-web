import archiveMeta from "../../content/lectures/archive.json";
import currentSeasonData from "../../content/lectures/2026-2027.json";
import sample20242025Data from "../../content/lectures/sample-2024-2025.json";
import sample20252026Data from "../../content/lectures/sample-2025-2026.json";
import { getLecturerDirectoryEntry } from "@/content/lecturer-directory";
import { formatLecturerTitles, getLecturer } from "@/content/lecturers";
import type { Lecture, LectureSeason } from "@/content/types";

const CURRENT_SEASON_SLUG = "2026-2027";
const LECTURE_TITLE_SEPARATOR = " · ";

type LectureSeasonFile = LectureSeason & { sample?: boolean };

const seasonModules: Record<string, LectureSeasonFile> = {
  "2026-2027": currentSeasonData as LectureSeasonFile,
  "2025-2026": sample20252026Data as LectureSeasonFile,
  "2024-2025": sample20242025Data as LectureSeasonFile,
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
  const nameParts: string[] = [];
  if (entry.titles) {
    nameParts.push(formatLecturerTitles(entry.titles));
  }
  nameParts.push(entry.name);

  const label = nameParts.join(" ");
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
