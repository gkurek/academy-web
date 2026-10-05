/**
 * Merge manual hub redirects with per-post WP root slugs and media import wildcards.
 * Usage: npx tsx scripts/rebuild-redirects-json.ts
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const REDIRECTS_PATH = join(ROOT, "src", "config", "redirects.json");
const MANIFEST_PATH = join(ROOT, "content", "news", "manifest.json");

type RedirectEntry = {
  source: string;
  destination: string;
  note?: string;
};

type RedirectsFile = {
  redirects: RedirectEntry[];
};

const ROOT_OVERRIDES: Record<string, string> = {
  "ikona-trojcy-swietej": "/aktualnosci/oprowadzania-po-wystawie-2017",
  "ikona-serca-jezusa": "/aktualnosci/oprowadzania-po-wystawie-2017",
  "ikona-korzenie-i-owoce-wiary-2": "/ikony/wystawy",
  "podsumowanie-2019": "/aktualnosci",
  "149": "/aktualnosci/ikona-piekno-zanurzone-w-tajemnicy",
  "wystawa-ikona-dzis-2": "/aktualnosci/wystawa-ikona-dzis",
  "sladami-najpiekniejszych-ikon-swiata":
    "/aktualnosci/spotkania-sladami-najpiekniejszych-ikon-swiata",
  "tworcze-lato-2016":
    "/aktualnosci/sesja-ikonowa-modlitwa-psalmami-i-wystawa-ikon-w-swietej-lipce-2016",
};

const GENERATED_POST_NOTE = "Stary adres wpisu WP → /aktualnosci (DoD #3)";
const GENERATED_EXTRA_NOTE = "Stary adres WP bez wpisu 1:1 (DoD #3)";
const GENERATED_MEDIA_NOTE = "M6: stare ścieżki /media/import (DoD #3)";

function isGeneratedEntry(entry: RedirectEntry): boolean {
  const note = entry.note ?? "";
  return (
    note.startsWith(GENERATED_POST_NOTE) ||
    note.startsWith(GENERATED_EXTRA_NOTE) ||
    note.startsWith(GENERATED_MEDIA_NOTE) ||
    note.includes("K-67: scalenie duplikatów — root WP") ||
    note.includes("M6 legacy import paths")
  );
}

function dedupeBySource(entries: RedirectEntry[]): RedirectEntry[] {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.source)) {
      return false;
    }
    seen.add(entry.source);
    return true;
  });
}

function main(): void {
  const existing = JSON.parse(
    readFileSync(REDIRECTS_PATH, "utf8"),
  ) as RedirectsFile;

  const manualRedirects = existing.redirects.filter(
    (entry) => !isGeneratedEntry(entry),
  );

  const plakatyEntry = manualRedirects.find(
    (e) => e.source === "/publikacje/plakaty",
  );
  if (plakatyEntry) {
    plakatyEntry.destination = "/aktualnosci/plakaty-z-wydarzen";
    plakatyEntry.note =
      "P0 #25: galeria plakatów WP → wpis zbiorczy (DoD #3 redirecty, 2026-09-30)";
  }

  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as Array<{
    slug: string;
  }>;

  const sources = new Set(manualRedirects.map((e) => e.source));

  const postRedirects: RedirectEntry[] = manifest
    .map((entry) => entry.slug)
    .filter((slug) => !sources.has(`/${slug}`))
    .map((slug) => {
      const destination =
        ROOT_OVERRIDES[slug] ?? `/aktualnosci/${slug}`;
      return {
        source: `/${slug}`,
        destination,
        note: ROOT_OVERRIDES[slug]
          ? `${GENERATED_EXTRA_NOTE}; override`
          : GENERATED_POST_NOTE,
      };
    });

  postRedirects.forEach((entry) => sources.add(entry.source));

  const manifestSlugs = new Set(manifest.map((entry) => entry.slug));
  const extraRootRedirects: RedirectEntry[] = Object.entries(ROOT_OVERRIDES)
    .filter(([slug]) => !manifestSlugs.has(slug))
    .filter(([slug]) => !sources.has(`/${slug}`))
    .map(([slug, destination]) => ({
      source: `/${slug}`,
      destination,
      note: GENERATED_EXTRA_NOTE,
    }));

  extraRootRedirects.forEach((entry) => sources.add(entry.source));

  const numericDuplicates: RedirectEntry[] = [
    {
      source: "/149",
      destination: "/aktualnosci/ikona-piekno-zanurzone-w-tajemnicy",
      note: "K-67: scalenie duplikatów — root WP (DoD #3, 2026-09-30)",
    },
    {
      source: "/wystawa-ikona-dzis-2",
      destination: "/aktualnosci/wystawa-ikona-dzis",
      note: "K-67: scalenie duplikatów — root WP (DoD #3, 2026-09-30)",
    },
  ].filter((entry) => !sources.has(entry.source));

  const mediaWildcards: RedirectEntry[] = [
    {
      source: "/media/import/news/:path*",
      destination: "/media/news/:path*",
      note: GENERATED_MEDIA_NOTE,
    },
    {
      source: "/media/import/icons/:path*",
      destination: "/media/icons/:path*",
      note: GENERATED_MEDIA_NOTE,
    },
    {
      source: "/media/import/exhibition/:path*",
      destination: "/media/exhibition/:path*",
      note: GENERATED_MEDIA_NOTE,
    },
  ];

  const merged = dedupeBySource([
    ...manualRedirects,
    ...postRedirects,
    ...extraRootRedirects,
    ...numericDuplicates,
    ...mediaWildcards,
  ]).sort((a, b) => a.source.localeCompare(b.source));

  writeFileSync(
    REDIRECTS_PATH,
    `${JSON.stringify({ redirects: merged }, null, 2)}\n`,
    "utf8",
  );

  console.log(
    `redirects.json: ${merged.length} entries (manual ${manualRedirects.length}, posts ${postRedirects.length}, extra ${extraRootRedirects.length}, media ${mediaWildcards.length})`,
  );
}

main();
