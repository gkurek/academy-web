/**
 * One-off: copy news images from public/media/sample/news to public/media/news/{slug}/
 * and rewrite /media/sample/news/ paths in content/news/*.mdx.
 *
 * Usage: npx tsx scripts/promote-news-media-from-sample.ts
 */

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { generateNewsManifest } from "./generate-news-index";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_DIR = join(ROOT, "content/news");
const SAMPLE_DIR = join(ROOT, "public/media/sample/news");
const IMPORT_ROOT = join(ROOT, "public/media/news");

function extractSlugFromMdx(source: string): string | null {
  const match = source.match(/"slug":\s*"([^"]+)"/);
  return match?.[1] ?? null;
}

function destNameForSampleFile(
  slug: string,
  sampleBasename: string,
  role: "image" | "poster" | "cover",
): string {
  const ext = extname(sampleBasename);
  const posterSuffix = `-poster${ext}`;

  if (role === "cover") {
    return `cover${ext}`;
  }

  if (sampleBasename === `${slug}${posterSuffix}` || sampleBasename.endsWith(posterSuffix)) {
    return `poster${ext}`;
  }

  if (sampleBasename.startsWith(`${slug}-`)) {
    const rest = sampleBasename.slice(slug.length + 1);
    const indexMatch = rest.match(/^(\d+)\./);
    if (indexMatch) {
      const index = Number.parseInt(indexMatch[1], 10);
      return `${index + 1}${ext}`;
    }
  }

  return sampleBasename;
}

function promotePath(
  slug: string,
  samplePublicPath: string,
  role: "image" | "poster" | "cover",
): string {
  const sampleBasename = basename(samplePublicPath);
  const sampleDisk = join(SAMPLE_DIR, sampleBasename);

  if (!existsSync(sampleDisk)) {
    throw new Error(`Missing sample file: ${sampleDisk} (referenced from ${slug})`);
  }

  const destName = destNameForSampleFile(slug, sampleBasename, role);
  const importDir = join(IMPORT_ROOT, slug);
  const destDisk = join(importDir, destName);
  const destPublic = `/media/news/${slug}/${destName}`;

  if (!existsSync(importDir)) {
    mkdirSync(importDir, { recursive: true });
  }

  if (!existsSync(destDisk)) {
    copyFileSync(sampleDisk, destDisk);
  }

  return destPublic;
}

function promoteMdxFile(filePath: string): number {
  const source = readFileSync(filePath, "utf8");
  const slug = extractSlugFromMdx(source);

  if (!slug) {
    return 0;
  }

  let replacements = 0;
  let next = source;

  const pathRegex = /\/media\/sample\/news\/[^"'\s)]+/g;
  const uniquePaths = [...new Set(source.match(pathRegex) ?? [])];

  uniquePaths.forEach((samplePath) => {
    const role: "image" | "poster" | "cover" = samplePath.includes("-poster.")
      ? "poster"
      : source.includes(`"cover":`) && source.includes(samplePath)
        ? "cover"
        : "image";

    const importPath = promotePath(slug, samplePath, role);
    if (importPath !== samplePath) {
      next = next.split(samplePath).join(importPath);
      replacements += 1;
    }
  });

  if (replacements > 0) {
    writeFileSync(filePath, next, "utf8");
  }

  return replacements;
}

function main(): void {
  const mdxFiles = readdirSync(NEWS_DIR).filter((name) => name.endsWith(".mdx"));
  let total = 0;

  mdxFiles.forEach((name) => {
    const count = promoteMdxFile(join(NEWS_DIR, name));
    total += count;
  });

  const entryCount = generateNewsManifest();

  console.log(`Promoted paths in MDX (${total} unique sample paths processed).`);
  console.log(`Regenerated manifest.json (${entryCount} entries).`);
}

main();
