// Single source of truth for the main menu, SectionNav per section, and the
// footer sitemap — labels and hrefs come verbatim from brief-claude-code.md §3,
// with the Wykłady/SectionNav label resolved per the document hierarchy in
// CLAUDE.md (brief wins over the makieta — see docs/archive/plans/01-skeleton.md).
// Pages never look labels up themselves: `resolveNav(path)` derives the nav state
// and `navTitle(path)` the document title from the route path.

import { pl } from "@/i18n/pl";

export type NavLink = { label: string; href: string };

export type MainNavItem = NavLink & {
  // Sub-links shown in the mobile menu accordion for this section.
  // Sections without `children` render as a flat link (O Akademii, Aktualności, Kontakt).
  children?: NavLink[];
};

export type SectionKey = "o-akademii" | "warsztaty" | "wyklady" | "ikony";

// Each list's first item is the section hub itself and stands in for the
// breadcrumb (see design/README §4 — Breadcrumb).
export const sectionNav: Record<SectionKey, NavLink[]> = {
  "o-akademii": [
    { label: "O Akademii", href: "/o-akademii" },
    { label: "Pracownia", href: "/pracownia" },
  ],
  warsztaty: [
    { label: "Przegląd", href: "/warsztaty" },
    { label: "Kurs roczny i trzyletni", href: "/warsztaty/kurs-roczny-i-trzyletni" },
    { label: "Letnia Szkoła Światła", href: "/warsztaty/letnia-szkola-swiatla" },
  ],
  wyklady: [
    { label: "Bieżący sezon", href: "/wyklady" },
    { label: "Archiwum", href: "/wyklady/archiwum" },
    { label: "Wykładowcy", href: "/wyklady/wykladowcy" },
  ],
  ikony: [
    { label: "Galeria", href: "/ikony" },
    { label: "Wystawy", href: "/ikony/wystawy" },
    { label: "Ikony na zamówienie", href: "/ikony/na-zamowienie" },
  ],
};

const sectionKeys = Object.keys(sectionNav) as SectionKey[];

export const mainNav: MainNavItem[] = [
  { label: "O Akademii", href: "/o-akademii" },
  // The hub link is the section heading itself, so the accordion skips it —
  // except in Ikony, where the hub item has its own label (Galeria).
  { label: "Warsztaty", href: "/warsztaty", children: sectionNav.warsztaty.slice(1) },
  { label: "Wykłady", href: "/wyklady", children: sectionNav.wyklady.slice(1) },
  { label: "Ikony", href: "/ikony", children: sectionNav.ikony },
  { label: "Aktualności", href: "/aktualnosci" },
  { label: "Kontakt", href: "/kontakt" },
];

/** Section outside the main menu — footer sitemap and the mobile menu's bottom row. */
export const publicationsLink: NavLink = { label: "Publikacje", href: "/publikacje" };

export const footerLegalLink: NavLink = {
  label: "Polityka prywatności",
  href: "/polityka-prywatnosci",
};

/** Main menu item by href — a typo fails the build instead of rendering a blank label. */
export function navItem(href: string): MainNavItem {
  const item = mainNav.find((link) => link.href === href);
  if (!item) {
    throw new Error(`navigation.ts: no main nav item with href "${href}"`);
  }
  return item;
}

/** SectionNav item by href, from any section. */
export function sectionLink(href: string): NavLink {
  const link = sectionKeys.flatMap((key) => sectionNav[key]).find((item) => item.href === href);
  if (!link) {
    throw new Error(`navigation.ts: no section nav item with href "${href}"`);
  }
  return link;
}

// Footer sitemap (mockup 9e) — four equal columns of sections with subpages.
// Hub headings link to section routes; children include routes omitted from mainNav.
export const footerSitemapGroups: MainNavItem[] = [
  { ...navItem("/o-akademii"), children: sectionNav["o-akademii"].slice(1) },
  navItem("/warsztaty"),
  { ...navItem("/wyklady"), children: sectionNav.wyklady },
  { ...navItem("/ikony"), children: sectionNav.ikony },
];

// Sections without subpages — the row under the hairline, same grid as the groups.
export const footerSitemapFlat: NavLink[] = [navItem("/aktualnosci"), publicationsLink, navItem("/kontakt")];

export type NavState = {
  /** Main nav item underlined gold in the Header. */
  active?: MainNavItem;
  /** Section whose SectionNav the page renders. */
  section?: SectionKey;
  /** Current SectionNav item. */
  sectionActive?: NavLink;
};

function isWithin(href: string, path: string): boolean {
  return path === href || path.startsWith(`${href}/`);
}

function longestMatch<T extends NavLink>(links: T[], path: string): T | undefined {
  return links
    .filter((link) => isWithin(link.href, path))
    .reduce<T | undefined>((best, link) => (!best || link.href.length > best.href.length ? link : best), undefined);
}

/**
 * Nav state from the route path: the section is the one whose SectionNav holds the
 * path; the main item is that section's hub, otherwise the longest main nav prefix
 * (`/aktualnosci/[slug]` → Aktualności, `/publikacje` → none).
 */
export function resolveNav(path?: string): NavState {
  if (!path) {
    return {};
  }

  const section =
    sectionKeys.find((key) => sectionNav[key].some((link) => link.href === path)) ??
    sectionKeys.find((key) => longestMatch(sectionNav[key], path));

  if (!section) {
    return { active: longestMatch(mainNav, path) };
  }

  return {
    active: navItem(sectionNav[section][0].href),
    section,
    sectionActive: longestMatch(sectionNav[section], path),
  };
}

/** `page` only on the link to the current page; `true` on its parent section link. */
export function navAriaCurrent(href: string, activeHref: string | undefined, path: string | undefined) {
  if (href === path) {
    return "page";
  }
  return href === activeHref ? "true" : undefined;
}

/**
 * Document title of a page reached from the nav (D4): the main item for a hub,
 * "subpage · section" for a SectionNav subpage, the link label elsewhere.
 * The layout template appends the site brand.
 */
export function navTitle(path: string): string {
  const { active, section, sectionActive } = resolveNav(path);

  if (section && active && sectionActive?.href === path) {
    return sectionActive === sectionNav[section][0]
      ? active.label
      : `${sectionActive.label}${pl.meta.titleSeparator}${active.label}`;
  }

  const link = [...mainNav, publicationsLink, footerLegalLink].find((item) => item.href === path);
  if (!link) {
    throw new Error(`navigation.ts: no nav link for "${path}" — title it from its data instead`);
  }
  return link.label;
}
