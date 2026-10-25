/**
 * Technical classification of the WP photo library (~/Desktop/ejk-pic-library), step 3 of
 * docs/archive/plans/10-photo-library-curation.md. READ-ONLY: nothing is moved or deleted.
 * For photos tagged with one of CATEGORIES in tags.json it computes real pixel size, rank A/B/C,
 * orientation, and an "already on site" flag (dHash vs public/media, excluding public/media/news/**).
 * Output: <dir>/_scan/classification.json (read by scripts/tag-photos.ts) and a console summary.
 * Usage (from repo root): npx tsx scripts/classify-photos.ts [--site-threshold=8] [dir]
 */

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { extname, join, relative, sep } from "node:path";
import sharp from "sharp";

const args = process.argv.slice(2);
const SITE_THRESHOLD = Number(args.find((a) => a.startsWith("--site-threshold="))?.split("=")[1] ?? 8);
const TARGET_DIR = args.find((a) => !a.startsWith("--")) ?? join(homedir(), "Desktop", "ejk-pic-library");
const SCAN_DIR = join(TARGET_DIR, "_scan");
const SITE_MEDIA = join(process.cwd(), "public", "media");
const CONCURRENCY = 8;
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

// Rank thresholds per category, on the real long/short side in px. A: hero / wide frame, B: tile or in-text photo, C: thumbnail only.
type Thresholds = { aLong: number; aShort: number; bLong: number; bShort: number };
const RANKS: Record<string, Thresholds> = {
  warsztaty: { aLong: 1600, aShort: 900, bLong: 960, bShort: 540 },
  wystawy: { aLong: 1400, aShort: 700, bLong: 960, bShort: 600 },
  "akademia – uczestnicy": { aLong: 1600, aShort: 900, bLong: 960, bShort: 600 },
};
const CATEGORIES = Object.keys(RANKS);

type Rank = "A" | "B" | "C";
type Orientation = "pozioma" | "pionowa" | "kwadratowa";
type Result = {
  categories: string[];
  width: number;
  height: number;
  rank: Rank;
  orientation: Orientation;
  onSite: { file: string; distance: number } | null;
};

// tsconfig targets ES2017, which has no bigint literals.
const ZERO = BigInt(0);
const ONE = BigInt(1);

const popcount = (n: bigint): number => (n === ZERO ? 0 : Number(n & ONE) + popcount(n >> ONE));

// Same 9x8 dHash as scan-near-duplicates.ts, plus pixel size with EXIF orientation applied.
const analyse = async (path: string): Promise<{ hash: bigint; width: number; height: number }> => {
  const base = sharp(path, { failOn: "none" });
  const meta = await base.metadata();
  const swap = (meta.orientation ?? 1) >= 5;
  const [w, h] = [meta.width ?? 0, meta.height ?? 0];
  const px = await base
    .clone()
    .rotate()
    .flatten({ background: "#ffffff" })
    .grayscale()
    .resize(9, 8, { fit: "fill" })
    .raw()
    .toBuffer();
  const hash = Array.from({ length: 64 }, (_, i) => {
    const row = Math.floor(i / 8);
    const col = i % 8;
    return px[row * 9 + col] > px[row * 9 + col + 1] ? ONE : ZERO;
  }).reduce<bigint>((acc, bit) => (acc << ONE) | bit, ZERO);
  return { hash, width: swap ? h : w, height: swap ? w : h };
};

const mapLimit = async <T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> => {
  const out: R[] = new Array(items.length);
  let next = 0;
  const worker = async (): Promise<void> => {
    const i = next++;
    if (i >= items.length) return;
    out[i] = await fn(items[i]);
    await worker();
  };
  await Promise.all(Array.from({ length: limit }, worker));
  return out;
};

const rankOf = (cat: string, width: number, height: number): Rank => {
  const t = RANKS[cat];
  const [long, short] = [Math.max(width, height), Math.min(width, height)];
  if (long >= t.aLong && short >= t.aShort) return "A";
  return long >= t.bLong && short >= t.bShort ? "B" : "C";
};
const RANK_ORDER: Rank[] = ["A", "B", "C"];
// A photo in several categories gets the best rank among them.
const bestRank = (ranks: Rank[]): Rank => RANK_ORDER.find((r) => ranks.includes(r)) ?? "C";

const orientationOf = (w: number, h: number): Orientation => (w / h > 1.1 ? "pozioma" : w / h < 0.9 ? "pionowa" : "kwadratowa");

const main = async () => {
  const tags: { photos: Record<string, string[]> } = JSON.parse(readFileSync(join(TARGET_DIR, "tags.json"), "utf8"));
  const wanted = Object.entries(tags.photos)
    .map(([file, cats]) => ({ file, categories: cats.filter((c) => CATEGORIES.includes(c)) }))
    .filter((p) => p.categories.length > 0);

  // Site images, excluding news: those may be reused on main pages.
  const siteFiles = readdirSync(SITE_MEDIA, { recursive: true, withFileTypes: true })
    .filter((d) => d.isFile() && IMAGE_EXT.has(extname(d.name).toLowerCase()))
    .map((d) => join(d.parentPath, d.name))
    .filter((p) => relative(SITE_MEDIA, p).split(sep)[0] !== "news");
  const site = await mapLimit(siteFiles, CONCURRENCY, async (p) => ({
    file: relative(process.cwd(), p).split(sep).join("/"),
    hash: (await analyse(p)).hash,
  }));

  const results: Record<string, Result> = {};
  await mapLimit(wanted, CONCURRENCY, async ({ file, categories }) => {
    const { hash, width, height } = await analyse(join(TARGET_DIR, file));
    const nearest = site
      .map((s) => ({ file: s.file, distance: popcount(hash ^ s.hash) }))
      .reduce<{ file: string; distance: number } | null>((best, s) => (best && best.distance <= s.distance ? best : s), null);
    results[file] = {
      categories,
      width,
      height,
      rank: bestRank(categories.map((c) => rankOf(c, width, height))),
      orientation: orientationOf(width, height),
      onSite: nearest && nearest.distance <= SITE_THRESHOLD ? nearest : null,
    };
  });

  mkdirSync(SCAN_DIR, { recursive: true });
  writeFileSync(join(SCAN_DIR, "classification.json"), JSON.stringify({ thresholds: RANKS, siteThreshold: SITE_THRESHOLD, photos: results }, null, 2));

  // Summary per category: rank counts, orientation, on-site.
  CATEGORIES.forEach((cat) => {
    const rows = Object.values(results).filter((r) => r.categories.includes(cat));
    const count = (pred: (r: Result) => boolean) => rows.filter(pred).length;
    const byRank = RANK_ORDER.map((k) => `${k} ${count((r) => rankOf(cat, r.width, r.height) === k)}`).join(" · ");
    const onSite = count((r) => r.onSite !== null);
    console.log(
      `${cat}: ${rows.length} zdj. | ${byRank} | pozioma ${count((r) => r.orientation === "pozioma")}, pionowa ${count((r) => r.orientation === "pionowa")}, kwadratowa ${count((r) => r.orientation === "kwadratowa")} | już na stronie ${onSite}`,
    );
  });
  console.log(`${site.length} site images compared (news excluded). Report: ${join(SCAN_DIR, "classification.json")}`);
};

main();
