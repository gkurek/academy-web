/**
 * M4: copy home pillar / hub card images from public/media/sample/photos
 * to public/media/home/ and rewrite paths in src/i18n/pl.ts.
 *
 * Usage: npx tsx scripts/promote-home-media-from-sample.ts
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
const SAMPLE_PHOTOS = join(ROOT, "public/media/sample/photos");
const HOME_MEDIA = join(ROOT, "public/media/home");
const PL_TS = join(ROOT, "src/i18n/pl.ts");

const HOME_FILES = ["pracownia.jpg", "wyklad.jpg", "wystawa.jpg"] as const;
const SAMPLE_PREFIX = "/media/sample/photos/";
const HOME_PREFIX = "/media/home/";

function main(): void {
  if (!existsSync(PL_TS)) {
    throw new Error(`Missing ${PL_TS}`);
  }

  if (!existsSync(HOME_MEDIA)) {
    mkdirSync(HOME_MEDIA, { recursive: true });
  }

  HOME_FILES.forEach((basename) => {
    const sampleDisk = join(SAMPLE_PHOTOS, basename);
    if (!existsSync(sampleDisk)) {
      throw new Error(`Missing sample photo: ${sampleDisk}`);
    }
    const destDisk = join(HOME_MEDIA, basename);
    if (!existsSync(destDisk)) {
      copyFileSync(sampleDisk, destDisk);
    }
  });

  let source = readFileSync(PL_TS, "utf8");
  if (!source.includes(SAMPLE_PREFIX)) {
    console.log("M4 home: no sample paths in pl.ts (already promoted?)");
    return;
  }

  source = source.split(SAMPLE_PREFIX).join(HOME_PREFIX);
  writeFileSync(PL_TS, source, "utf8");

  const count = (source.match(/\/media\/home\//g) ?? []).length;
  console.log(`M4 home: ${count} /media/home/ path(s) in src/i18n/pl.ts`);
}

main();
