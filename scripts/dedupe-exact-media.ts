/**
 * Exact-duplicate cleanup for the WP photo library (~/Desktop/ejk-pic-library).
 * Groups files by SHA-256 of their bytes; from each group keeps one file and deletes the rest.
 * Kept file: the one with a parent post in metadata.json, then the shortest path, then alphabetical.
 * Dry run by default (prints groups only); pass --apply to actually delete.
 * Writes dedupe-report.json next to the photos (kept/removed per group); metadata.json is left untouched.
 * Usage (from repo root): npx tsx scripts/dedupe-exact-media.ts [--apply] [dir]
 */

import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, relative } from "node:path";

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const TARGET_DIR = args.find((a) => !a.startsWith("--")) ?? join(homedir(), "Desktop", "ejk-pic-library");
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|tiff?|bmp)$/i;

type MetaItem = { file: string; parent?: unknown };

const listFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? listFiles(full) : IMAGE_EXT.test(name) ? [full] : [];
  });

const rel = (full: string) => relative(TARGET_DIR, full).replace(/\\/g, "/");

const metadata: { items: MetaItem[] } = JSON.parse(readFileSync(join(TARGET_DIR, "metadata.json"), "utf8"));
const hasParent = new Set(metadata.items.filter((i) => i.parent).map((i) => i.file));

const files = listFiles(TARGET_DIR);
const groups = files.reduce<Record<string, string[]>>((acc, f) => {
  const hash = createHash("sha256").update(readFileSync(f)).digest("hex");
  (acc[hash] ??= []).push(f);
  return acc;
}, {});

const rank = (f: string) => [hasParent.has(rel(f)) ? 0 : 1, rel(f).length, rel(f)] as const;
const compare = (a: string, b: string) => {
  const [a0, a1, a2] = rank(a);
  const [b0, b1, b2] = rank(b);
  return a0 - b0 || a1 - b1 || a2.localeCompare(b2);
};

const report = Object.entries(groups)
  .filter(([, g]) => g.length > 1)
  .map(([hash, g]) => {
    const [keep, ...remove] = [...g].sort(compare);
    return { hash, kept: rel(keep), removed: remove.map(rel), bytes: statSync(keep).size };
  });

const removedCount = report.reduce((n, r) => n + r.removed.length, 0);
const freedBytes = report.reduce((n, r) => n + r.removed.length * r.bytes, 0);

report.forEach((r) => console.log(`${r.kept}\n${r.removed.map((p) => `   x ${p}`).join("\n")}`));
console.log(
  `\n${files.length} files, ${report.length} duplicate groups, ${removedCount} to remove (${(freedBytes / 1e6).toFixed(1)} MB)`,
);

if (APPLY) {
  report.forEach((r) => r.removed.forEach((p) => unlinkSync(join(TARGET_DIR, p))));
  writeFileSync(join(TARGET_DIR, "dedupe-report.json"), JSON.stringify(report, null, 2));
  console.log("Deleted. Report: dedupe-report.json");
} else {
  console.log("Dry run — pass --apply to delete.");
}
