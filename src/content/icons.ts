import iconsData from "../../content/icons.json";
import { pl } from "@/i18n/pl";
import type { IconWork } from "@/content/types";

export const FEATURED_ICON_SLUGS = [
  "matka-boza-znaku",
  "przemienienie",
  "mandylion",
  "sw-antoni",
] as const;

export type IconAuthorFilter = "ejk" | "uczniowie";

export type IconFilters = {
  author?: IconAuthorFilter;
  tag?: string;
};

export type IconCounts = {
  total: number;
  ejk: number;
  students: number;
};

const AUTHOR_QUERY_VALUES: IconAuthorFilter[] = ["ejk", "uczniowie"];

export function getIconWorks(): IconWork[] {
  return iconsData as IconWork[];
}

export function getFeaturedIconWorks(): IconWork[] {
  return getIconWorksBySlugs([...FEATURED_ICON_SLUGS]);
}

export function getIconWorksBySlugs(slugs: string[]): IconWork[] {
  const icons = getIconWorks();
  return slugs
    .map((slug) => icons.find((icon) => icon.slug === slug))
    .filter((icon): icon is IconWork => icon !== undefined);
}

export function getIconTags(): string[] {
  const tags = new Set<string>();
  getIconWorks().forEach((icon) => {
    icon.tags?.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort((a, b) => a.localeCompare(b, "pl"));
}

export function getIconTagLabel(tag: string): string {
  const labels = pl.gallery.tagLabels as Record<string, string>;
  return labels[tag] ?? tag;
}

export function parseIconFilters(
  params: Record<string, string | string[] | undefined>
): IconFilters {
  const filters: IconFilters = {};
  const autor = params.autor;

  if (typeof autor === "string" && AUTHOR_QUERY_VALUES.includes(autor as IconAuthorFilter)) {
    filters.author = autor as IconAuthorFilter;
  }

  const temat = params.temat;
  if (typeof temat === "string" && temat.length > 0) {
    filters.tag = temat;
  }

  return filters;
}

export function filterIconWorks(works: IconWork[], filters: IconFilters): IconWork[] {
  return works.filter((work) => {
    if (filters.author === "ejk" && work.author !== "ejk") {
      return false;
    }

    if (filters.author === "uczniowie" && work.author !== "student") {
      return false;
    }

    if (filters.tag && (!work.tags || !work.tags.includes(filters.tag))) {
      return false;
    }

    return true;
  });
}

export function getIconCounts(works: IconWork[]): IconCounts {
  return works.reduce<IconCounts>(
    (counts, work) => {
      counts.total += 1;
      if (work.author === "ejk") {
        counts.ejk += 1;
      }
      if (work.author === "student") {
        counts.students += 1;
      }
      return counts;
    },
    { total: 0, ejk: 0, students: 0 }
  );
}

export function formatIconCount(counts: IconCounts): string {
  return pl.gallery.count
    .replace("{total}", String(counts.total))
    .replace("{ejk}", String(counts.ejk))
    .replace("{students}", String(counts.students));
}
