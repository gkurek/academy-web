/**
 * Content integrity check — runs in `prebuild` (D2), so `npm run build` stops before Next starts.
 * Usage (from repo root): npm run check:content
 *
 * 1. Every `content/` file imported by `src/` exists — a renamed MDX fails here with its path.
 * 2. `content/news/manifest.json` + `src/content/news-registry.ts` match the news MDX frontmatter (R1-09).
 * 3. `src/content/articles-registry.ts` + `publications-registry.ts` match the MDX on disk.
 * Generated files stay committed; on a mismatch rerun the generator named in the message.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

import { buildNewsIndex, type GeneratedFile } from "./generate-news-index";
import { buildPublicationsIndex } from "./generate-publications-index";

const ROOT = process.cwd();
const SRC_DIR = join(ROOT, "src");
const CONTENT_IMPORT_RE = /from\s+["']((?:\.\.\/)+content\/[^"']+)["']/g;

const NEWS_GENERATOR =
  "npx tsx -e \"import { generateNewsManifest } from './scripts/generate-news-index.ts'; generateNewsManifest();\"";
const PUBLICATIONS_GENERATOR =
  "npx tsx -e \"import { generatePublicationsIndex } from './scripts/generate-publications-index.ts'; generatePublicationsIndex();\"";

function toRepoPath(path: string): string {
  return relative(ROOT, path).replaceAll("\\", "/");
}

function listSourceFiles(): string[] {
  return readdirSync(SRC_DIR, { recursive: true, encoding: "utf8" })
    .filter((name) => /\.tsx?$/.test(name))
    .map((name) => join(SRC_DIR, name));
}

function findMissingContentImports(): string[] {
  return listSourceFiles().flatMap((file) => {
    const source = readFileSync(file, "utf8");
    return Array.from(source.matchAll(CONTENT_IMPORT_RE))
      .map((match) => resolve(dirname(file), match[1]))
      .filter((target) => !existsSync(target))
      .map((target) => `${toRepoPath(file)} imports ${toRepoPath(target)} — file not found`);
  });
}

function findStaleGeneratedFiles(files: GeneratedFile[], generator: string): string[] {
  return files
    .filter((file) => {
      const committed = existsSync(file.path) ? readFileSync(file.path, "utf8") : "";
      return committed.replaceAll("\r\n", "\n") !== file.content;
    })
    .map((file) => `${toRepoPath(file.path)} is out of date with the MDX frontmatter — run: ${generator}`);
}

const missingImports = findMissingContentImports();

// The generators parse every MDX file; skip them when a file they would read is already missing.
const problems =
  missingImports.length > 0
    ? missingImports
    : [
        ...findStaleGeneratedFiles(buildNewsIndex(), NEWS_GENERATOR),
        ...findStaleGeneratedFiles(buildPublicationsIndex(), PUBLICATIONS_GENERATOR),
      ];

if (problems.length > 0) {
  console.error(`check:content — ${problems.length} problem(s):`);
  problems.forEach((problem) => console.error(`  ✗ ${problem}`));
  process.exit(1);
}

console.log("check:content — content imports, news manifest and publication registries OK");
