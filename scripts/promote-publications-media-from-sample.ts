/**
 * M3: copy publication album images from public/media/sample/publications
 * to public/media/publications/{slug}/ and rewrite paths in content/publications/{slug}.mdx.
 *
 * Usage: npx tsx scripts/promote-publications-media-from-sample.ts
 */

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SAMPLE_DIR = join(ROOT, "public/media/sample/publications");
const PUBLICATIONS_CONTENT = join(ROOT, "content/publications");
const PUBLICATIONS_MEDIA = join(ROOT, "public/media/publications");

const SLUG = "ikona-dzis";
const SAMPLE_PREFIX = "/media/sample/publications/";

function promotePublication(slug: string): number {
  const mdxPath = join(PUBLICATIONS_CONTENT, `${slug}.mdx`);
  if (!existsSync(mdxPath)) {
    throw new Error(`Missing publication MDX: ${mdxPath}`);
  }

  if (!existsSync(SAMPLE_DIR)) {
    throw new Error(`Missing sample dir: ${SAMPLE_DIR}`);
  }

  const destDir = join(PUBLICATIONS_MEDIA, slug);
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }

  readdirSync(SAMPLE_DIR).forEach((name) => {
    const sampleDisk = join(SAMPLE_DIR, name);
    const destDisk = join(destDir, name);
    if (!existsSync(destDisk)) {
      copyFileSync(sampleDisk, destDisk);
    }
  });

  let source = readFileSync(mdxPath, "utf8");
  const destPrefix = `/media/publications/${slug}/`;
  if (!source.includes(SAMPLE_PREFIX)) {
    return 0;
  }

  source = source.split(SAMPLE_PREFIX).join(destPrefix);
  writeFileSync(mdxPath, source, "utf8");

  const count = (source.match(new RegExp(destPrefix.replace(/\//g, "\\/"), "g")) ?? [])
    .length;
  return count;
}

function main(): void {
  const paths = promotePublication(SLUG);
  console.log(`M3 publications (${SLUG}): ${paths} media path(s) in MDX`);
}

main();
