import type { Author } from "@/content/types";
import { formatLecturerDisplayName, getLecturer } from "@/content/lecturers";

export function assertLecturerSlugExists(author: Author, context: string): void {
  if (!author.lecturerSlug) {
    return;
  }

  if (!getLecturer(author.lecturerSlug)) {
    throw new Error(`${context}: unknown lecturer slug "${author.lecturerSlug}"`);
  }
}

export function getAuthorDisplayName(author: Author): string {
  if (author.lecturerSlug) {
    const lecturer = getLecturer(author.lecturerSlug);
    if (lecturer) {
      return formatLecturerDisplayName(lecturer);
    }
  }

  return author.name;
}

export function getAuthorProfileHref(author: Author): string | undefined {
  return author.lecturerSlug ? `/wyklady/wykladowcy#${author.lecturerSlug}` : undefined;
}
