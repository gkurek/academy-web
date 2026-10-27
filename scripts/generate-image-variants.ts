/**
 * WebP variants of every raster image in public/media (11b), written to public/media-webp/ (git-ignored).
 * `next/image` points at them through src/lib/imageLoader.ts, so nothing is resized on request.
 * Each source gets one file per width in VARIANT_WIDTHS; a width above the source size keeps the source size,
 * because the loader cannot know it. Home pillar photos also get a HIGH_IMAGE_QUALITY set.
 * Files newer than their source are skipped, so repeat local runs take seconds.
 * When to run: automatically in `predev` and `prebuild`.
 * Usage (from repo root): npm run images:variants
 */

import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { availableParallelism } from "node:os";
import { dirname, join } from "node:path";

import sharp from "sharp";

import { getHomePage } from "../src/content/home";
import { DEFAULT_IMAGE_QUALITY, HIGH_IMAGE_QUALITY, VARIANT_WIDTHS, variantPath } from "../src/lib/imageVariants";

const PUBLIC_DIR = join(process.cwd(), "public");
const MEDIA_DIR = join(PUBLIC_DIR, "media");
const RASTER_RE = /\.(jpe?g|png|webp)$/i;

type Variant = { width: number; quality: number; file: string };
type SourceJob = { file: string; variants: Variant[] };

function listSources(): string[] {
  return readdirSync(MEDIA_DIR, { recursive: true, encoding: "utf8" })
    .filter((name) => RASTER_RE.test(name))
    .map((name) => `/media/${name.replaceAll("\\", "/")}`);
}

function isFresh(variantFile: string, sourceMtime: number): boolean {
  return existsSync(variantFile) && statSync(variantFile).mtimeMs >= sourceMtime;
}

function buildJobs(sources: string[], highQualitySources: Set<string>): SourceJob[] {
  return sources
    .map((src) => {
      const sourceMtime = statSync(join(PUBLIC_DIR, src)).mtimeMs;
      const qualities = highQualitySources.has(src)
        ? [DEFAULT_IMAGE_QUALITY, HIGH_IMAGE_QUALITY]
        : [DEFAULT_IMAGE_QUALITY];
      const variants = qualities
        .flatMap((quality) =>
          VARIANT_WIDTHS.map((width) => ({ width, quality, file: join(PUBLIC_DIR, variantPath(src, width, quality)) })),
        )
        .filter((variant) => !isFresh(variant.file, sourceMtime));
      return { file: join(PUBLIC_DIR, src), variants };
    })
    .filter((job) => job.variants.length > 0);
}

async function writeVariants({ file, variants }: SourceJob): Promise<void> {
  // `rotate()` applies EXIF orientation once; each variant resizes a clone of the decoded source.
  const source = sharp(file).rotate();
  await Promise.all(
    variants.map(({ width, quality, file: out }) => {
      mkdirSync(dirname(out), { recursive: true });
      return source.clone().resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(out);
    }),
  );
}

/** Runs `task` over `items` with at most `size` in flight — whole-image decodes are memory-heavy. */
async function runPool<T>(items: T[], size: number, task: (item: T) => Promise<void>): Promise<void> {
  let next = 0;
  const worker = async (): Promise<void> => {
    const item = items[next];
    next += 1;
    if (item === undefined) return;
    await task(item);
    return worker();
  };
  await Promise.all(Array.from({ length: size }, worker));
}

async function main(): Promise<void> {
  const startedAt = Date.now();
  const highQualitySources = new Set(getHomePage().pillars.map((pillar) => pillar.image.src));
  const sources = listSources();
  const jobs = buildJobs(sources, highQualitySources);
  const variantCount = jobs.reduce((sum, job) => sum + job.variants.length, 0);

  await runPool(jobs, availableParallelism(), writeVariants);

  const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(`images:variants — ${sources.length} sources, ${variantCount} variant(s) written in ${seconds}s`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
