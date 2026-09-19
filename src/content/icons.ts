import iconsData from "../../content/icons.json";
import { pl } from "@/i18n/pl";
import type { IconWork } from "@/content/types";

export const FEATURED_ICON_SLUGS = [
  "matka-boza-krzew-gorejacy",
  "chrystus-pantokrator",
  "archaniol-michal",
  "trojca-swieta",
] as const;

/**
 * Theme taxonomy (K-43): the fixed order of the filter chips; slugs go into `?temat=`.
 * Every work needs at least one of these tags, every theme at least one work
 * (checked by validateIconTaxonomy below).
 */
export const ICON_THEMES = ["chrystus", "matka-bozy", "aniolowie", "swieci", "sceny-i-swieta"] as const;

export type IconFilters = {
  tag?: string;
};

/** Section ids double as URL hashes (`/ikony#uczniowie`). */
export type IconSectionId = "ejk" | "uczniowie";

export type IconSection = {
  id: IconSectionId;
  works: IconWork[];
};

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

/** Theme slugs in taxonomy order — safe to render as chips, each has at least one work. */
export function getIconTags(): string[] {
  return [...ICON_THEMES];
}

export function getIconTagLabel(tag: string): string {
  const labels = pl.gallery.tagLabels as Record<string, string>;
  return labels[tag] ?? tag;
}

export function parseIconFilters(
  params: Record<string, string | string[] | undefined>
): IconFilters {
  const filters: IconFilters = {};

  // Other params (including the retired `autor`) are ignored.
  // Unknown slugs are dropped, so the view falls back to "no theme filter".
  const temat = params.temat;
  if (typeof temat === "string" && getIconTags().includes(temat)) {
    filters.tag = temat;
  }

  return filters;
}

export function filterIconWorks(works: IconWork[], filters: IconFilters): IconWork[] {
  const { tag } = filters;
  if (!tag) {
    return works;
  }
  return works.filter((work) => work.tags?.includes(tag));
}

/**
 * K-41: the gallery is a fixed split — Elżbieta's works first, then the students'.
 * Works keep the order they have in icons.json (manual curation); a section with
 * no works (e.g. under a theme filter) is dropped together with its anchor.
 */
export function groupIconSections(works: IconWork[]): IconSection[] {
  const sections: IconSection[] = [
    { id: "ejk", works: works.filter((work) => work.author === "ejk") },
    { id: "uczniowie", works: works.filter((work) => work.author === "student") },
  ];
  return sections.filter((section) => section.works.length > 0);
}

/** K-42: unique student names generated from the works, alphabetical by surname (last word). */
export function getStudentNames(works: IconWork[]): string[] {
  const names = new Set(works.flatMap((work) => (work.authorName ? [work.authorName] : [])));
  const surname = (name: string) => name.split(/\s+/).pop() ?? name;
  return Array.from(names).sort(
    (a, b) => surname(a).localeCompare(surname(b), "pl") || a.localeCompare(b, "pl")
  );
}

/**
 * Fails loudly (at build, and on first import in dev) when icons.json and the
 * theme taxonomy drift apart: untagged works vanish under every theme filter,
 * unknown tags and empty themes would render dead chips.
 */
function validateIconTaxonomy(works: IconWork[]): void {
  const themes: readonly string[] = ICON_THEMES;
  const untagged = works.filter((work) => !work.tags || work.tags.length === 0);
  const unknown = works.flatMap((work) =>
    (work.tags ?? []).filter((tag) => !themes.includes(tag)).map((tag) => `${work.slug} → ${tag}`)
  );
  const emptyThemes = themes.filter((theme) => !works.some((work) => work.tags?.includes(theme)));

  const problems = [
    untagged.length > 0 ? `works without tags: ${untagged.map((work) => work.slug).join(", ")}` : null,
    unknown.length > 0 ? `tags outside the taxonomy: ${unknown.join(", ")}` : null,
    emptyThemes.length > 0 ? `themes without works: ${emptyThemes.join(", ")}` : null,
  ].filter((problem): problem is string => problem !== null);

  if (problems.length > 0) {
    throw new Error(`content/icons.json does not match the theme taxonomy — ${problems.join("; ")}`);
  }
}

validateIconTaxonomy(getIconWorks());
