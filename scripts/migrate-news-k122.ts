/**
 * One-off K-122 migration: layout, poster → images[], remove <NewsCta /> from MDX body.
 * Run from repo root: npx tsx scripts/migrate-news-k122.ts
 * Then: npx tsx -e "import { generateNewsManifest } from './scripts/generate-news-index.ts'; generateNewsManifest();"
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_DIR = join(ROOT, "content/news");
const FRONTMATTER_MARKER = "export const frontmatter = ";

type ImageMeta = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

type NewsKind =
  | "aktualnosc"
  | "wyklady"
  | "warsztaty"
  | "wystawa"
  | "oprowadzanie"
  | "wyjazd"
  | "spotkanie";

type Frontmatter = {
  slug: string;
  title: string;
  date: string;
  dateEnd?: string;
  kind: NewsKind;
  layout?: string;
  excerpt?: string;
  venue?: string;
  sample?: boolean;
  featured?: boolean;
  cover?: ImageMeta;
  images?: ImageMeta[];
  poster?: ImageMeta;
  facts?: { label: string; value: string }[];
  related?: { label: string; href: string }[];
  hideLead?: boolean;
};

const LAYOUT_BY_SLUG: Record<string, "wydarzenie" | "galeria" | "tekst" | "program"> = {
  "nabor-kursu-2026-2027": "wydarzenie",
  "wystawa-madrosc-boza-2026": "wydarzenie",
  "wystawa-piekno-boga-piekno-czlowieka-2025": "wydarzenie",
  "wystawa-ikona-korzenie-i-owoce-wiary-2018": "wydarzenie",
  "program-na-rok-20152016-zapraszamy-serdecznie": "program",
  "spotkania-sladami-najpiekniejszych-ikon-swiata": "program",
  "wyjazd-studyjny-sladami-ikon-prof-jerzego-nowosielskiego": "program",
  "wystawa-ikon-w-wilnie": "tekst",
  "ikona-dzis-3": "tekst",
  "wakacyjne-wyjazdy-studyjne-mielnik-nad-bugiem": "tekst",
  "oprowadzania-po-wystawie-2017": "tekst",
  "poswiecenia-ikon": "tekst",
  "warsztaty-w-lipcu": "tekst",
  "wystawa-ikona-dzis": "tekst",
  "ikonografia-patronow-pielgrzymow": "tekst",
  "warsztaty-pisania-ikon": "tekst",
  "warsztaty-pisania-ikon-w-kosciele-srodowisk-tworczych-w-warszawie": "tekst",
  "warsztaty-w-kosciele-srodowisk-tworczych-pp-sw-andrzeja-apostola-i-sw-brata-alberta-w-warszawie-plac-teatralny-20":
    "tekst",
  "wakacyjne-warsztaty-ikonograficzne-w-warszawie": "tekst",
};

const RELATED_BY_SLUG: Record<string, { label: string; href: string }[]> = {
  "ikona-okno-ku-wiecznosci-2": [
    { label: "Wystawy wyjazdowe", href: "/ikony/wystawy#wyjazdowe" },
  ],
};

function inferLayout(entry: Frontmatter): "wydarzenie" | "galeria" | "tekst" | "program" {
  const mapped = LAYOUT_BY_SLUG[entry.slug];
  if (mapped) {
    return mapped;
  }
  if (entry.kind === "wyklady") {
    return "wydarzenie";
  }
  return "galeria";
}

function shouldCaptionPlakat(entry: Frontmatter, poster: ImageMeta): boolean {
  if (/poster|plakat/i.test(poster.src)) {
    return true;
  }
  if (/plakat/i.test(poster.alt)) {
    return true;
  }
  return entry.kind === "wyklady";
}

function migrateImages(entry: Frontmatter): ImageMeta[] | undefined {
  const images = [...(entry.images ?? [])];
  const poster = entry.poster;
  if (!poster) {
    return images.length > 0 ? images : undefined;
  }

  const firstSrc = images[0]?.src;
  if (poster.src === firstSrc) {
    if (images[0] && shouldCaptionPlakat(entry, poster)) {
      images[0] = { ...images[0], caption: "Plakat" };
    }
    return images.length > 0 ? images : undefined;
  }

  const prepended: ImageMeta = {
    ...poster,
    caption: shouldCaptionPlakat(entry, poster) ? "Plakat" : poster.caption,
  };
  return [prepended, ...images];
}

function parseMdx(source: string): { frontmatter: Frontmatter; body: string } {
  const start = source.indexOf(FRONTMATTER_MARKER);
  if (start === -1) {
    throw new Error("Missing frontmatter export");
  }

  const jsonStart = start + FRONTMATTER_MARKER.length;
  const lineEnd = source.indexOf(";\r\n", jsonStart);
  const jsonEnd = lineEnd !== -1 ? lineEnd : source.indexOf(";\n", jsonStart);
  if (jsonEnd === -1) {
    throw new Error("Malformed frontmatter export");
  }

  const frontmatter = JSON.parse(source.slice(jsonStart, jsonEnd)) as Frontmatter;
  const bodyStart = lineEnd !== -1 ? jsonEnd + 3 : jsonEnd + 2;
  const body = source.slice(bodyStart).replace(/^\s+/, "");

  return { frontmatter, body };
}

function stripNewsCta(body: string): string {
  return body
    .replace(/<NewsCta[^>]*\/>\s*/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd();
}

function serializeMdx(frontmatter: Frontmatter, body: string): string {
  const json = JSON.stringify(frontmatter, null, 2);
  const bodyBlock = body.length > 0 ? `\n${body}` : "";
  return `export const frontmatter = ${json};\n${bodyBlock}`;
}

function migrateFrontmatter(entry: Frontmatter): Frontmatter {
  const images = migrateImages(entry);
  const layout = inferLayout(entry);
  const related = RELATED_BY_SLUG[entry.slug];

  const next: Frontmatter = {
    slug: entry.slug,
    title: entry.title,
    date: entry.date,
    kind: entry.kind,
    layout,
  };

  if (entry.dateEnd) {
    next.dateEnd = entry.dateEnd;
  }
  if (entry.excerpt) {
    next.excerpt = entry.excerpt;
  }
  if (entry.venue) {
    next.venue = entry.venue;
  }
  if (entry.sample) {
    next.sample = entry.sample;
  }
  if (entry.featured) {
    next.featured = entry.featured;
  }
  if (entry.cover) {
    next.cover = entry.cover;
  }
  if (images) {
    next.images = images;
  }
  if (related) {
    next.related = related;
  }
  if (entry.facts) {
    next.facts = entry.facts;
  }
  if (entry.hideLead) {
    next.hideLead = entry.hideLead;
  }

  return next;
}

function migrateFile(filename: string): void {
  const filePath = join(NEWS_DIR, filename);
  const source = readFileSync(filePath, "utf8");
  const { frontmatter, body } = parseMdx(source);
  const migrated = migrateFrontmatter(frontmatter);
  const cleanedBody = stripNewsCta(body);
  writeFileSync(filePath, serializeMdx(migrated, cleanedBody), "utf8");
}

const filenames = readdirSync(NEWS_DIR)
  .filter((name) => name.endsWith(".mdx"))
  .sort((a, b) => a.localeCompare(b));

filenames.forEach((filename) => migrateFile(filename));
console.log(`Migrated ${filenames.length} news MDX files (K-122).`);
