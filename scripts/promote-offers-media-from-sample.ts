/**
 * M1: copy offer images from public/media/sample/photos to public/media/offers/{slug}/
 * and rewrite /media/sample/photos/ paths in content/offers/*.mdx.
 *
 * Usage: npx tsx scripts/promote-offers-media-from-sample.ts
 */

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OFFERS_CONTENT = join(ROOT, "content/offers");
const SAMPLE_PHOTOS = join(ROOT, "public/media/sample/photos");
const OFFERS_MEDIA = join(ROOT, "public/media/offers");

/** slug → basenames under sample/photos */
const OFFER_FILES: Record<string, readonly string[]> = {
  "kurs-roczny-i-trzyletni": ["uczestnicy.jpg", "pracownia-podporka.jpg"],
  "letnia-szkola-swiatla": ["uczestnicy.jpg"],
  zamowienie: ["pisanie-ikony-pracownia.jpg"],
};

function promoteSlug(slug: string, basenames: readonly string[]): number {
  const mdxPath = join(OFFERS_CONTENT, `${slug}.mdx`);
  if (!existsSync(mdxPath)) {
    throw new Error(`Missing offer MDX: ${mdxPath}`);
  }

  const destDir = join(OFFERS_MEDIA, slug);
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }

  let source = readFileSync(mdxPath, "utf8");
  let replacements = 0;

  basenames.forEach((basename) => {
    const sampleDisk = join(SAMPLE_PHOTOS, basename);
    if (!existsSync(sampleDisk)) {
      throw new Error(`Missing sample photo: ${sampleDisk}`);
    }

    const destDisk = join(destDir, basename);
    if (!existsSync(destDisk)) {
      copyFileSync(sampleDisk, destDisk);
    }

    const samplePublic = `/media/sample/photos/${basename}`;
    const destPublic = `/media/offers/${slug}/${basename}`;
    if (source.includes(samplePublic)) {
      source = source.split(samplePublic).join(destPublic);
      replacements += 1;
    }
  });

  if (replacements > 0) {
    writeFileSync(mdxPath, source, "utf8");
  }

  return replacements;
}

function main(): void {
  let total = 0;
  Object.entries(OFFER_FILES).forEach(([slug, basenames]) => {
    total += promoteSlug(slug, basenames);
  });
  console.log(`M1 offers: ${total} path rewrite(s) in content/offers/*.mdx`);
}

main();
