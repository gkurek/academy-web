import { nbspDeep } from "@/lib/typography";
import lecturersPageMeta from "../../content/lecturers-page.json";
import lecturerDirectoryData from "../../content/lecturer-directory.json";
import lecturersData from "../../content/lecturers.json";
import type { Lecturer, LecturerDirectoryEntry } from "@/content/types";

const lecturers = nbspDeep(lecturersData as Lecturer[]);
const directory = nbspDeep(lecturerDirectoryData as LecturerDirectoryEntry[]);

/** Fields a lecturer shows in programs and mentions: the profile page's values, else the directory's. */
export type ResolvedLecturer = Pick<Lecturer, "slug" | "name" | "titles" | "affiliation">;

const SHARED_FIELDS = ["name", "titles", "affiliation"] as const;

function assertUniqueSlugs(entries: { slug: string }[], file: string): void {
  const seen = new Set<string>();
  entries.forEach(({ slug }) => {
    if (seen.has(slug)) {
      throw new Error(`${file}: duplicate lecturer slug "${slug}"`);
    }
    seen.add(slug);
  });
}

/** The two registries may overlap, but the shared fields must agree — the profile is the source of truth. */
function assertRegistriesAgree(): void {
  assertUniqueSlugs(lecturers, "content/lecturers.json");
  assertUniqueSlugs(directory, "content/lecturer-directory.json");

  directory.forEach((entry) => {
    const profile = lecturers.find((lecturer) => lecturer.slug === entry.slug);
    const mismatched = SHARED_FIELDS.filter((field) => profile && profile[field] !== entry[field]);

    if (mismatched.length > 0) {
      throw new Error(
        `lecturer "${entry.slug}": ${mismatched.join(", ")} differ between content/lecturers.json and content/lecturer-directory.json — fix the directory entry to match the profile`,
      );
    }
  });
}

assertRegistriesAgree();

/** ~7 lines of body text at typical card width; heuristic, not exact line-clamp overflow. */
const LECTURER_BIO_EXPAND_THRESHOLD = 400;

type LecturersPageMeta = {
  intro: string;
};

export function getLecturers(): Lecturer[] {
  return lecturers;
}

/** Profile (bio page) of a lecturer, when they have one. */
export function getLecturer(slug: string): Lecturer | undefined {
  return lecturers.find((lecturer) => lecturer.slug === slug);
}

/** The one lookup for a lecturer slug: profile first, directory second; an unknown slug is an error, not a guess. */
export function resolveLecturer(slug: string): ResolvedLecturer {
  const resolved = getLecturer(slug) ?? directory.find((entry) => entry.slug === slug);

  if (!resolved) {
    throw new Error(`unknown lecturer slug "${slug}" — add it to content/lecturer-directory.json`);
  }

  return resolved;
}

export function getLecturerProfileHref(slug: string): string | undefined {
  const lecturer = getLecturer(slug);
  if (!lecturer?.bio) {
    return undefined;
  }

  return `/wyklady/wykladowcy#${slug}`;
}

export function getLecturersPageIntro(totalSeasons: number): string {
  const { intro } = nbspDeep(lecturersPageMeta as LecturersPageMeta);
  return intro.replace("{totalSeasons}", String(totalSeasons));
}

function formatLecturerTitles(titles: string): string {
  return titles.charAt(0).toUpperCase() + titles.slice(1);
}

/** Religious-order postnominals (SJ, OP, OFM…): all-caps tokens without a dot, placed after the name. */
const POSTNOMINAL_PATTERN = /^[A-Z]{2,}$/;

export function formatLecturerDisplayName(lecturer: Pick<Lecturer, "name" | "titles">): string {
  const tokens = lecturer.titles?.split(" ").filter(Boolean) ?? [];
  const prefix = tokens.filter((token) => !POSTNOMINAL_PATTERN.test(token)).join(" ");
  const suffix = tokens.filter((token) => POSTNOMINAL_PATTERN.test(token)).join(" ");

  return [prefix ? formatLecturerTitles(prefix) : "", lecturer.name, suffix]
    .filter(Boolean)
    .join(" ");
}

export function isLongLecturerBio(bio: string): boolean {
  return bio.length > LECTURER_BIO_EXPAND_THRESHOLD;
}
