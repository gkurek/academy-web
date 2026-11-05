/**
 * Old-site traffic for the admin panel (12b-1, K-168, K-174): turns the WP Statistics CSV export in
 * docs/analytics/ into admin/src/data/legacy-analytics.json, read by the panel at build time.
 * - `wp-statistics-summary-totals.csv` → daily `views` and `visitors`.
 * - `wp-statistics-pages-monthly.csv` → monthly views per page; old paths are rewritten to new ones through
 *   src/config/redirects.json, paths that exist on the new site are kept, the rest (bot probes, old WP
 *   archives without a 301) are summed per month as `unmatchedViews` and listed in the console report.
 * Output is deterministic (sorted, no timestamps), so a re-run on the same CSV gives the same file.
 * When to run: once after a new export; the CSV is a closed archive (old site switched off in 11f).
 * Usage (from repo root): npx tsx scripts/import-wp-statistics.ts
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

type RedirectEntry = { source: string; destination: string };

type DailyTotal = { date: string; views: number; visitors: number };
type MonthlyPage = { month: string; path: string; views: number };
type MonthlyUnmatched = { month: string; views: number };

type LegacyAnalytics = {
  source: string;
  range: { from: string; to: string };
  daily: DailyTotal[];
  pagesMonthly: MonthlyPage[];
  unmatchedMonthly: MonthlyUnmatched[];
};

const ROOT = process.cwd();
const CSV_DIR = join(ROOT, "docs", "analytics");
const TOTALS_CSV = join(CSV_DIR, "wp-statistics-summary-totals.csv");
const PAGES_CSV = join(CSV_DIR, "wp-statistics-pages-monthly.csv");
const REDIRECTS_JSON = join(ROOT, "src", "config", "redirects.json");
const NEWS_MANIFEST = join(ROOT, "content", "news", "manifest.json");
const SEO_SOURCE = join(ROOT, "src", "content", "seo.ts");
const REGISTRIES = [
  join(ROOT, "src", "content", "articles-registry.ts"),
  join(ROOT, "src", "content", "publications-registry.ts"),
];
const OUTPUT = join(ROOT, "admin", "src", "data", "legacy-analytics.json");
const SOURCE_LABEL = "WP Statistics 14.16.14, CSV export 2026-10-28 (docs/analytics/)";

/** Paths that are requests for files or WordPress internals, not pages — reported only as a count. */
const TECHNICAL_PATH = /\.(php|asp|aspx|env|txt|xml|js|css|json|ini|sql|zip|gz|bak|log)$|^\/(\/|wp-|wp$|feed|comments\/feed|xmlrpc|cgi-bin|\.)|\/feed(\/|$)/;
/** Report length for real-looking unmatched paths, by total views. */
const REPORT_LIMIT = 60;

const byString = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

/** Minimal CSV line parser: comma-separated, fields optionally in double quotes with `""` escapes. */
function parseCsvLine(line: string): string[] {
  const state = line.split("").reduce(
    (acc, char, index, chars) => {
      if (acc.skip) return { ...acc, skip: false };
      if (acc.quoted) {
        if (char === '"' && chars[index + 1] === '"') return { ...acc, field: `${acc.field}"`, skip: true };
        if (char === '"') return { ...acc, quoted: false };
        return { ...acc, field: acc.field + char };
      }
      if (char === '"') return { ...acc, quoted: true };
      if (char === ",") return { ...acc, fields: [...acc.fields, acc.field], field: "" };
      return { ...acc, field: acc.field + char };
    },
    { fields: [] as string[], field: "", quoted: false, skip: false },
  );
  return [...state.fields, state.field];
}

function readCsv(path: string): Record<string, string>[] {
  const [header, ...lines] = readFileSync(path, "utf8").replace(/^﻿/, "").trim().split(/\r?\n/);
  const columns = parseCsvLine(header);
  return lines.map((line, index) => {
    const values = parseCsvLine(line);
    if (values.length !== columns.length) {
      throw new Error(`${path}:${index + 2}: expected ${columns.length} fields, got ${values.length}`);
    }
    return Object.fromEntries(columns.map((column, i) => [column, values[i]]));
  });
}

function toCount(value: string, context: string): number {
  if (!/^\d+$/.test(value)) throw new Error(`${context}: "${value}" is not a non-negative integer`);
  return Number(value);
}

/** Old paths in the export are lower-case without a trailing slash; match decoded, same shape. */
function normalizePath(path: string): string {
  const decoded = (() => {
    try {
      return decodeURIComponent(path);
    } catch {
      return path;
    }
  })();
  const lower = decoded.toLowerCase();
  return lower.length > 1 ? lower.replace(/\/+$/, "") : lower;
}

/** A redirect target as a page key: hash dropped (`/wyklady#zapisy` → `/wyklady`), external URLs kept. */
function pageKey(destination: string): string {
  if (/^https?:\/\//.test(destination)) return destination;
  const path = destination.split("#")[0];
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

function loadCurrentPaths(): Set<string> {
  const seoKeys = [...readFileSync(SEO_SOURCE, "utf8").matchAll(/^\s+"(\/[^"]*)":/gm)].map((m) => m[1]);
  if (!seoKeys.includes("/")) throw new Error(`${SEO_SOURCE}: SEO_BY_PATH keys not found — update the parser`);

  const news = (JSON.parse(readFileSync(NEWS_MANIFEST, "utf8")) as { slug: string }[]).map(
    (entry) => `/aktualnosci/${entry.slug}`,
  );
  const publications = REGISTRIES.flatMap((file) =>
    [...readFileSync(file, "utf8").matchAll(/^\s+"([^"]+)": \{ Content/gm)].map((m) => `/publikacje/${m[1]}`),
  );
  return new Set([...seoKeys, ...news, ...publications]);
}

type Resolver = (oldPath: string) => { path: string; how: "current" | "redirect" } | undefined;

function buildResolver(currentPaths: Set<string>): Resolver {
  const entries = (JSON.parse(readFileSync(REDIRECTS_JSON, "utf8")) as { redirects: RedirectEntry[] }).redirects;
  const exact = new Map(
    entries
      .filter((entry) => !entry.source.includes(":"))
      .map((entry) => [normalizePath(entry.source), pageKey(entry.destination)] as const),
  );
  const patterns = entries
    .filter((entry) => entry.source.endsWith("/:path*"))
    .map((entry) => ({
      prefix: normalizePath(entry.source.replace("/:path*", "")),
      target: entry.destination.replace("/:path*", ""),
    }));

  return (oldPath) => {
    const path = normalizePath(oldPath);
    if (currentPaths.has(path)) return { path, how: "current" };
    const direct = exact.get(path);
    if (direct) return { path: direct, how: "redirect" };
    const pattern = patterns.find((p) => path.startsWith(`${p.prefix}/`));
    return pattern ? { path: pattern.target + path.slice(pattern.prefix.length), how: "redirect" } : undefined;
  };
}

function importDaily(): DailyTotal[] {
  const rows = readCsv(TOTALS_CSV).map((row, index) => {
    const context = `${TOTALS_CSV}:${index + 2}`;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date)) throw new Error(`${context}: bad date "${row.date}"`);
    return { date: row.date, views: toCount(row.views, context), visitors: toCount(row.visitors, context) };
  });
  const dates = new Set(rows.map((row) => row.date));
  if (dates.size !== rows.length) throw new Error(`${TOTALS_CSV}: duplicate dates`);
  return [...rows].sort((a, b) => byString(a.date, b.date));
}

/** Calendar days missing between the first and last date (the chart shows them as zero). */
function missingDays(daily: DailyTotal[]): string[] {
  const present = new Set(daily.map((row) => row.date));
  const start = Date.parse(`${daily[0].date}T00:00:00Z`);
  const end = Date.parse(`${daily[daily.length - 1].date}T00:00:00Z`);
  const span = Math.round((end - start) / 86_400_000) + 1;
  return Array.from({ length: span }, (_, i) => new Date(start + i * 86_400_000).toISOString().slice(0, 10)).filter(
    (date) => !present.has(date),
  );
}

type PagesResult = {
  pagesMonthly: MonthlyPage[];
  unmatchedMonthly: MonthlyUnmatched[];
  csvViews: number;
  stats: { current: number; redirect: number; unmatched: number };
  unmatchedByPath: Map<string, number>;
};

function importPages(resolve: Resolver): PagesResult {
  const rows = readCsv(PAGES_CSV).map((row, index) => {
    const context = `${PAGES_CSV}:${index + 2}`;
    if (!/^\d{4}-\d{2}$/.test(row.month)) throw new Error(`${context}: bad month "${row.month}"`);
    return { month: row.month, path: row.path, views: toCount(row.views, context) };
  });

  const pages = new Map<string, MonthlyPage>();
  const unmatched = new Map<string, number>();
  const unmatchedByPath = new Map<string, number>();
  const stats = { current: 0, redirect: 0, unmatched: 0 };

  rows.forEach((row) => {
    const resolved = resolve(row.path);
    if (!resolved) {
      stats.unmatched += row.views;
      unmatched.set(row.month, (unmatched.get(row.month) ?? 0) + row.views);
      unmatchedByPath.set(row.path, (unmatchedByPath.get(row.path) ?? 0) + row.views);
      return;
    }
    stats[resolved.how] += row.views;
    const key = `${row.month} ${resolved.path}`;
    const existing = pages.get(key);
    pages.set(key, { month: row.month, path: resolved.path, views: (existing?.views ?? 0) + row.views });
  });

  return {
    pagesMonthly: [...pages.values()].sort((a, b) => byString(a.month, b.month) || byString(a.path, b.path)),
    unmatchedMonthly: [...unmatched.entries()]
      .map(([month, views]) => ({ month, views }))
      .sort((a, b) => byString(a.month, b.month)),
    csvViews: rows.reduce((sum, row) => sum + row.views, 0),
    stats,
    unmatchedByPath,
  };
}

function sum<T>(items: T[], pick: (item: T) => number): number {
  return items.reduce((total, item) => total + pick(item), 0);
}

/** One record per line: small file, readable diffs on a re-import. */
function serialize(data: LegacyAnalytics): string {
  const fields = Object.entries(data).map(([key, value]) => {
    const body = Array.isArray(value)
      ? `[\n${value.map((item) => `  ${JSON.stringify(item)}`).join(",\n")}\n ]`
      : JSON.stringify(value);
    return ` ${JSON.stringify(key)}: ${body}`;
  });
  return `{\n${fields.join(",\n")}\n}\n`;
}

function main(): void {
  const daily = importDaily();
  const pages = importPages(buildResolver(loadCurrentPaths()));

  const output: LegacyAnalytics = {
    source: SOURCE_LABEL,
    range: { from: daily[0].date, to: daily[daily.length - 1].date },
    daily,
    pagesMonthly: pages.pagesMonthly,
    unmatchedMonthly: pages.unmatchedMonthly,
  };

  // Checksums: output totals must equal the CSV totals.
  const outPageViews = sum(output.pagesMonthly, (p) => p.views) + sum(output.unmatchedMonthly, (u) => u.views);
  if (outPageViews !== pages.csvViews) {
    throw new Error(`Page views mismatch: CSV ${pages.csvViews}, output ${outPageViews}`);
  }

  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, serialize(output));

  const unmatched = [...pages.unmatchedByPath.entries()].sort((a, b) => b[1] - a[1] || byString(a[0], b[0]));
  const technical = unmatched.filter(([path]) => TECHNICAL_PATH.test(path));
  const pageLike = unmatched.filter(([path]) => !TECHNICAL_PATH.test(path));
  const gaps = missingDays(daily);

  const report = [
    `import-wp-statistics → ${OUTPUT.slice(ROOT.length + 1)}`,
    `  daily: ${daily.length} days ${output.range.from} – ${output.range.to}; views ${sum(daily, (d) => d.views)}, visitors ${sum(daily, (d) => d.visitors)}`,
    `  missing days: ${gaps.length}${gaps.length ? ` (${gaps.slice(0, 10).join(", ")}${gaps.length > 10 ? ", …" : ""})` : ""}`,
    `  pages: CSV views ${pages.csvViews} = current ${pages.stats.current} + via 301 ${pages.stats.redirect} + unmatched ${pages.stats.unmatched}`,
    `  output: ${output.pagesMonthly.length} month×page rows, ${output.unmatchedMonthly.length} months with unmatched views`,
    `  unmatched paths: ${unmatched.length} (technical / bot probes: ${technical.length} paths, ${sum(technical, ([, v]) => v)} views; page-like: ${pageLike.length} paths, ${sum(pageLike, ([, v]) => v)} views)`,
    `  top ${Math.min(REPORT_LIMIT, pageLike.length)} page-like paths without a 301 (views, path):`,
    ...pageLike.slice(0, REPORT_LIMIT).map(([path, views]) => `    ${String(views).padStart(6)}  ${path}`),
  ];
  console.log(report.join("\n"));
}

main();
