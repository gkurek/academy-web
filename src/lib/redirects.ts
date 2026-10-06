import { readFileSync } from "node:fs";
import { join } from "node:path";

type RedirectEntry = {
  source: string;
  destination: string;
  note?: string;
};

type NextRedirect = {
  source: string;
  destination: string;
  permanent: true;
};

type RedirectsFile = {
  redirects: RedirectEntry[];
};

const CONTEXT = "src/config/redirects.json";

/** Fails the build on entries that would 404 or loop on production (R4-21). */
function validateRedirects(entries: RedirectEntry[]): void {
  const sources = new Set<string>();

  entries.forEach((entry, index) => {
    if (!entry.source.startsWith("/")) {
      throw new Error(`${CONTEXT} redirects[${index}]: source "${entry.source}" must start with "/"`);
    }
    if (!/^(\/|https?:\/\/)/.test(entry.destination)) {
      throw new Error(
        `${CONTEXT} redirects[${index}]: destination "${entry.destination}" must be a path or an http(s) URL`,
      );
    }
    if (sources.has(entry.source)) {
      throw new Error(`${CONTEXT} redirects[${index}]: duplicate source "${entry.source}"`);
    }
    sources.add(entry.source);
  });

  entries.forEach((entry, index) => {
    if (sources.has(entry.destination)) {
      throw new Error(
        `${CONTEXT} redirects[${index}]: destination "${entry.destination}" is itself redirected (chain)`,
      );
    }
  });
}

export function loadPermanentRedirects(): NextRedirect[] {
  const path = join(process.cwd(), "src", "config", "redirects.json");
  const data = JSON.parse(readFileSync(path, "utf8")) as RedirectsFile;

  validateRedirects(data.redirects);

  return data.redirects.map(
    (entry): NextRedirect => ({
      source: entry.source,
      destination: entry.destination,
      permanent: true,
    }),
  );
}
