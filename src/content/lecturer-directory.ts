import directoryData from "../../content/lecturer-directory.json";
import type { LecturerDirectoryEntry } from "@/content/types";

const directory = directoryData as LecturerDirectoryEntry[];

export function getLecturerDirectoryEntry(
  slug: string,
): LecturerDirectoryEntry | undefined {
  return directory.find((entry) => entry.slug === slug);
}
