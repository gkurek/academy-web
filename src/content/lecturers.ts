import lecturersPageMeta from "../../content/lecturers-page.json";
import lecturersData from "../../content/lecturers.json";
import { getTotalSeasonCount } from "@/content/lectures";
import type { Lecturer } from "@/content/types";

const lecturers = lecturersData as Lecturer[];

/** ~7 lines of body text at typical card width; heuristic, not exact line-clamp overflow. */
const LECTURER_BIO_EXPAND_THRESHOLD = 400;

type LecturersPageMeta = {
  intro: string;
};

export function getLecturers(): Lecturer[] {
  return lecturers;
}

export function getLecturer(slug: string): Lecturer | undefined {
  return lecturers.find((lecturer) => lecturer.slug === slug);
}

export function getLecturersPageIntro(): string {
  const { intro } = lecturersPageMeta as LecturersPageMeta;
  return intro.replace("{totalSeasons}", String(getTotalSeasonCount()));
}

export function formatLecturerTitles(titles: string): string {
  return titles.charAt(0).toUpperCase() + titles.slice(1);
}

export function formatLecturerDisplayName(lecturer: Pick<Lecturer, "name" | "titles">): string {
  const titles = lecturer.titles ? formatLecturerTitles(lecturer.titles) : undefined;
  return titles ? `${titles} ${lecturer.name}` : lecturer.name;
}

export function isLongLecturerBio(bio: string): boolean {
  return bio.length > LECTURER_BIO_EXPAND_THRESHOLD;
}
