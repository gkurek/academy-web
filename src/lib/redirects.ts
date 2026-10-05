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

export function loadPermanentRedirects(): NextRedirect[] {
  const path = join(process.cwd(), "src", "config", "redirects.json");
  const data = JSON.parse(readFileSync(path, "utf8")) as RedirectsFile;

  return data.redirects.map(
    (entry): NextRedirect => ({
      source: entry.source,
      destination: entry.destination,
      permanent: true,
    }),
  );
}
