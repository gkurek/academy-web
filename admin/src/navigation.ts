import { pl } from "@/i18n/pl";

export type AdminTab = {
  label: string;
  href: string;
};

// Owner's call 2026-11-04: Workshops, Lectures and News shown as empty tabs from v0.5
// (replaces "Analytics only" and the mockup's single "Oferty" tab).
export const adminTabs: AdminTab[] = [
  { label: pl.tabs.analytics, href: "/analityka" },
  { label: pl.tabs.workshops, href: "/warsztaty" },
  { label: pl.tabs.lectures, href: "/wyklady" },
  { label: pl.tabs.news, href: "/aktualnosci" },
];
