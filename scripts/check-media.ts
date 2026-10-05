/**
 * Media check — runs in `prebuild` (D9): every `/media/…` path referenced in `content/` exists in
 * `public/`. Replaces the `existsSync` that used to run while rendering `/ikony/wystawy` (S-11).
 * When to run: automatically before every `npm run build`; by hand after moving or deleting files in `public/media/`.
 * Usage (from repo root): npm run check:media
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const CONTENT_DIR = join(ROOT, "content");
const PUBLIC_DIR = join(ROOT, "public");
const MEDIA_PATH_RE = /\/media\/[^"'`\s)\]}>]+/g;

type MediaReference = {
  file: string;
  path: string;
};

function listContentFiles(): string[] {
  return readdirSync(CONTENT_DIR, { recursive: true, encoding: "utf8" })
    .filter((name) => /\.(json|mdx?)$/.test(name))
    .map((name) => name.replaceAll("\\", "/"));
}

function collectReferences(): MediaReference[] {
  return listContentFiles().flatMap((file) => {
    const source = readFileSync(join(CONTENT_DIR, file), "utf8");
    const paths = new Set(source.match(MEDIA_PATH_RE) ?? []);
    return Array.from(paths).map((path) => ({ file: `content/${file}`, path }));
  });
}

const references = collectReferences();
const missing = references.filter(({ path }) => !existsSync(join(PUBLIC_DIR, decodeURI(path))));

if (missing.length > 0) {
  console.error(`check:media — ${missing.length} missing file(s) in public/:`);
  missing.forEach(({ file, path }) => console.error(`  ✗ ${file} → public${path}`));
  process.exit(1);
}

console.log(`check:media — ${references.length} media reference(s) in content/, all present in public/`);
