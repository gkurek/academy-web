/**
 * Batch-optimise album scans in public/media/publications/ikona-dzis (plan 10/k5d).
 *
 * Reads the owner's original PNG scans and writes web files next to them:
 * - photo spreads: full JPEG q90 (4:4:4) + 800 px JPEG thumb;
 * - text spreads (table of contents): palette PNG full + palette PNG thumb;
 * - cover: JPEG q90 downscaled to COVER_MAX_WIDTH (never upscaled).
 * Prints a before/after size report and the dimensions to copy into ikona-dzis.mdx.
 * Original PNGs of JPEG-converted files are left in place — delete them after the visual check.
 *
 * Usage: npx tsx scripts/optimize-album-media.ts [sourceDir]
 *   sourceDir must hold the original PNG scans (cover.png, spread-NN.png, spread-NN-thumb.png);
 *   it defaults to the media folder itself, which only holds them on the first run (k5c delivery).
 *   Re-running on already optimised files re-quantises the text spread — pass the originals instead.
 */

import { readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import sharp, { type Sharp } from "sharp";

const MEDIA_DIR = join(process.cwd(), "public", "media", "publications", "ikona-dzis");
const SOURCE_DIR = process.argv[2] ?? MEDIA_DIR;

/** Thumb width matches the k5c thumbs; height follows the scan (~1.83:1, not a hard 2:1). */
const THUMB_WIDTH = 800;
const COVER_MAX_WIDTH = 1600;
const JPEG_FULL = { quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" } as const;
const JPEG_THUMB = { quality: 82, mozjpeg: true } as const;
const PNG_PALETTE = { palette: true, quality: 90, compressionLevel: 9 } as const;

type SpreadKind = "photo" | "text";

/** spread-01 is the table of contents (text); the rest are icon/photo spreads. */
const SPREADS: { name: string; kind: SpreadKind }[] = Array.from({ length: 9 }, (_, index) => {
  const name = `spread-${String(index + 1).padStart(2, "0")}`;
  return { name, kind: index === 0 ? "text" : "photo" };
});

type ReportRow = {
  file: string;
  beforeBytes: number | null;
  afterBytes: number;
  width: number;
  height: number;
};

const kilobytes = (bytes: number) => `${Math.round(bytes / 1024)} KB`;

const sizeOrNull = (path: string) => {
  try {
    return statSync(path).size;
  } catch {
    return null;
  }
};

/** Decode once into memory so writing over the source path (text PNG) is safe. */
async function loadOpaque(path: string) {
  const input = readFileSync(path);
  return sharp(input).removeAlpha();
}

async function writeImage(
  pipeline: Sharp,
  file: string,
  beforePath: string | null,
): Promise<ReportRow> {
  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
  const outPath = join(MEDIA_DIR, file);
  const beforeBytes = beforePath ? sizeOrNull(beforePath) : sizeOrNull(outPath);
  writeFileSync(outPath, data);
  return { file, beforeBytes, afterBytes: data.length, width: info.width, height: info.height };
}

async function optimizeSpread({ name, kind }: { name: string; kind: SpreadKind }) {
  const sourcePath = join(SOURCE_DIR, `${name}.png`);
  const image = await loadOpaque(sourcePath);
  const thumb = image.clone().resize({ width: THUMB_WIDTH, withoutEnlargement: true });

  if (kind === "text") {
    return Promise.all([
      writeImage(image.clone().png(PNG_PALETTE), `${name}.png`, sourcePath),
      writeImage(thumb.png(PNG_PALETTE), `${name}-thumb.png`, join(SOURCE_DIR, `${name}-thumb.png`)),
    ]);
  }

  return Promise.all([
    writeImage(image.clone().jpeg(JPEG_FULL), `${name}.jpg`, sourcePath),
    writeImage(thumb.jpeg(JPEG_THUMB), `${name}-thumb.jpg`, join(SOURCE_DIR, `${name}-thumb.png`)),
  ]);
}

async function optimizeCover() {
  const sourcePath = join(SOURCE_DIR, "cover.png");
  const image = await loadOpaque(sourcePath);
  return writeImage(
    image.resize({ width: COVER_MAX_WIDTH, withoutEnlargement: true }).jpeg(JPEG_FULL),
    "cover.jpg",
    sourcePath,
  );
}

async function main() {
  // Keep sharp's cache off: inputs are read once and some outputs overwrite their source.
  sharp.cache(false);

  const spreadRows = await SPREADS.reduce<Promise<ReportRow[]>>(
    async (rowsPromise, spread) => [...(await rowsPromise), ...(await optimizeSpread(spread))],
    Promise.resolve([]),
  );
  const rows = [await optimizeCover(), ...spreadRows];

  const totals = rows.reduce(
    (sum, row) => ({
      before: sum.before + (row.beforeBytes ?? 0),
      after: sum.after + row.afterBytes,
    }),
    { before: 0, after: 0 },
  );

  console.table(
    rows.map((row) => ({
      file: row.file,
      before: row.beforeBytes === null ? "—" : kilobytes(row.beforeBytes),
      after: kilobytes(row.afterBytes),
      size: `${row.width}×${row.height}`,
    })),
  );
  console.log(`Total: ${kilobytes(totals.before)} → ${kilobytes(totals.after)}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
