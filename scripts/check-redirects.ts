/**
 * Permanent redirects — checks status and target of every entry in `src/config/redirects.json` (K10-4).
 * Each source is requested twice: as written (must answer 301/308 straight to the destination) and with a
 * trailing slash (old WordPress URLs had one; may take one extra hop, must end at the destination).
 * When to run: after changing redirects, locally against `next start`, and on staging at deploy (stage 11).
 * Usage (from repo root): npx tsx scripts/check-redirects.ts [baseUrl]   (default http://localhost:3000)
 * Exits 1 on any failure.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

type RedirectEntry = {
  source: string;
  destination: string;
};

type Check = {
  label: string;
  ok: boolean;
  detail: string;
};

const PERMANENT_STATUSES = [301, 308];
const MAX_HOPS = 3;
/** Path patterns (`:path*`) are checked with this sample segment instead of the pattern. */
const PATTERN_SAMPLE = "sample.jpg";

const baseUrl = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");

function concretePath(source: string): string {
  return source.replace(/:path\*/, PATTERN_SAMPLE);
}

/** Next appends "/" to a bare external origin ("https://host" → "https://host/"); treat both as equal. */
function expectedLocation(entry: RedirectEntry): string {
  const destination = concretePath(entry.destination);
  return /^https?:\/\/[^/]+$/.test(destination) ? `${destination}/` : destination;
}

/** `Location` may be absolute (same origin or external) or a path; normalise to path when same origin. */
function normaliseLocation(location: string): string {
  return location.startsWith(baseUrl) ? location.slice(baseUrl.length) : location;
}

async function firstHop(path: string): Promise<{ status: number; location: string }> {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  return { status: response.status, location: normaliseLocation(response.headers.get("location") ?? "") };
}

/** Follows same-origin redirects (max `MAX_HOPS`) and returns the final location. */
async function followToEnd(path: string): Promise<{ hops: number; end: string; status: number }> {
  const step = async (current: string, hops: number): Promise<{ hops: number; end: string; status: number }> => {
    const { status, location } = await firstHop(current);
    const isRedirect = PERMANENT_STATUSES.includes(status) || status === 302 || status === 307;
    if (!isRedirect || hops >= MAX_HOPS) {
      return { hops, end: current, status };
    }
    if (!location.startsWith("/")) {
      return { hops: hops + 1, end: location, status };
    }
    return step(location, hops + 1);
  };
  return step(path, 0);
}

async function checkExact(entry: RedirectEntry): Promise<Check> {
  const path = concretePath(entry.source);
  const expected = expectedLocation(entry);
  const { status, location } = await firstHop(path);
  const ok = PERMANENT_STATUSES.includes(status) && location === expected;
  return { label: path, ok, detail: ok ? `${status} → ${location}` : `got ${status} → "${location}", want 301/308 → "${expected}"` };
}

async function checkTrailingSlash(entry: RedirectEntry): Promise<Check> {
  const path = `${concretePath(entry.source)}/`;
  const expected = expectedLocation(entry);
  const { hops, end, status } = await followToEnd(path);
  const ok = hops > 0 && end === expected;
  return { label: path, ok, detail: ok ? `${hops} hop(s) → ${end}` : `ended at "${end}" (status ${status}, ${hops} hop(s)), want "${expected}"` };
}

/** Runs the checks one after another so a dev server is not flooded. */
function runSequentially(tasks: Array<() => Promise<Check>>): Promise<Check[]> {
  return tasks.reduce<Promise<Check[]>>(
    (chain, task) => chain.then(async (results) => [...results, await task()]),
    Promise.resolve([]),
  );
}

async function main(): Promise<void> {
  const file = JSON.parse(readFileSync(join(process.cwd(), "src", "config", "redirects.json"), "utf8")) as {
    redirects: RedirectEntry[];
  };

  const tasks = file.redirects.flatMap((entry) => [() => checkExact(entry), () => checkTrailingSlash(entry)]);
  const results = await runSequentially(tasks);
  const failed = results.filter((result) => !result.ok);

  failed.forEach((result) => console.error(`FAIL ${result.label}: ${result.detail}`));
  console.log(`${baseUrl}: ${results.length - failed.length}/${results.length} OK (${file.redirects.length} redirects × 2)`);
  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
