// Single source of truth for the main menu, SectionNav per section, and the
// footer sitemap — labels and hrefs come verbatim from brief-claude-code.md §3,
// with the Wykłady/SectionNav label resolved per the document hierarchy in
// CLAUDE.md (brief wins over the makieta — see docs/plans/01-skeleton.md).

export type NavLink = { label: string; href: string };

export type MainNavItem = NavLink & {
  // Sub-links shown in the mobile menu accordion for this section.
  // Sections without `children` render as a flat link (O Akademii, Wydarzenia, Kontakt).
  children?: NavLink[];
};

export const mainNav: MainNavItem[] = [
  { label: "O Akademii", href: "/o-akademii" },
  {
    label: "Warsztaty",
    href: "/warsztaty",
    children: [
      { label: "Kurs roczny i trzyletni", href: "/warsztaty/kurs-roczny-i-trzyletni" },
      { label: "Letnia Szkoła Światła", href: "/warsztaty/letnia-szkola-swiatla" },
    ],
  },
  {
    label: "Wykłady",
    href: "/wyklady",
    children: [
      { label: "Archiwum", href: "/wyklady/archiwum" },
      { label: "Wykładowcy", href: "/wyklady/wykladowcy" },
    ],
  },
  {
    label: "Ikony",
    href: "/ikony",
    children: [{ label: "Ikony na zamówienie", href: "/ikony/na-zamowienie" }],
  },
  { label: "Wydarzenia", href: "/wydarzenia" },
  { label: "Kontakt", href: "/kontakt" },
];

export type SectionKey = "warsztaty" | "wyklady" | "ikony" | "wydarzenia";

// Each list's first item is the section hub itself and stands in for the
// breadcrumb (see design/README §4 — Breadcrumb).
export const sectionNav: Record<SectionKey, NavLink[]> = {
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
    { label: "Ikony na zamówienie", href: "/ikony/na-zamowienie" },
  ],
  // Category filters via query string — no separate /wydarzenia/* routes (brief §3).
  wydarzenia: [
    { label: "Wszystkie", href: "/wydarzenia" },
    { label: "Wystawy", href: "/wydarzenia?kategoria=wystawa" },
    { label: "Poświęcenia", href: "/wydarzenia?kategoria=poswiecenie" },
    { label: "Oprowadzania", href: "/wydarzenia?kategoria=oprowadzanie" },
    { label: "Wyjazdy studyjne", href: "/wydarzenia?kategoria=wyjazd" },
  ],
};

// Full sitemap for the footer — original four-column layout (K-24 variant B).
// Hub headings link to section routes; children include routes omitted from mainNav.
export const footerSitemap: MainNavItem[] = [
  mainNav[0], // O Akademii
  mainNav[1], // Warsztaty
  {
    label: "Wykłady",
    href: "/wyklady",
    children: [
      { label: "Bieżący sezon", href: "/wyklady" },
      { label: "Archiwum", href: "/wyklady/archiwum" },
      { label: "Wykładowcy", href: "/wyklady/wykladowcy" },
    ],
  },
  {
    label: "Ikony",
    href: "/ikony",
    children: [
      { label: "Galeria", href: "/ikony" },
      { label: "Ikony na zamówienie", href: "/ikony/na-zamowienie" },
    ],
  },
  { label: "Pracownia", href: "/pracownia" },
  { label: "Wydarzenia", href: "/wydarzenia" },
  { label: "Aktualności", href: "/aktualnosci" },
  { label: "Publikacje", href: "/publikacje" },
  { label: "Kontakt", href: "/kontakt" },
];

export const footerLegalLink: NavLink = {
  label: "Polityka prywatności",
  href: "/polityka-prywatnosci",
};
