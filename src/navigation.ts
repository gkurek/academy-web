// Single source of truth for the main menu, SectionNav per section, and the
// footer sitemap — labels and hrefs come verbatim from brief-claude-code.md §3,
// with the Wykłady/SectionNav label resolved per the document hierarchy in
// CLAUDE.md (brief wins over the makieta — see docs/plans/01-skeleton.md).

export type NavLink = { label: string; href: string };

export type MainNavItem = NavLink & {
  // Sub-links shown in the mobile menu accordion for this section.
  // Sections without `children` render as a flat link (O Akademii, Aktualności, Kontakt).
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
    children: [
      { label: "Galeria", href: "/ikony" },
      { label: "Wystawa", href: "/ikony/wystawa" },
      { label: "Ikony na zamówienie", href: "/ikony/na-zamowienie" },
    ],
  },
  { label: "Aktualności", href: "/aktualnosci" },
  { label: "Kontakt", href: "/kontakt" },
];

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
    { label: "Wystawa", href: "/ikony/wystawa" },
    { label: "Ikony na zamówienie", href: "/ikony/na-zamowienie" },
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
    children: sectionNav.ikony,
  },
  { label: "Pracownia", href: "/pracownia" },
  mainNav[4], // Aktualności
  { label: "Publikacje", href: "/publikacje" },
  mainNav[5], // Kontakt
];

export const footerLegalLink: NavLink = {
  label: "Polityka prywatności",
  href: "/polityka-prywatnosci",
};
