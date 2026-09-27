import { readFileSync } from "node:fs";
import { join } from "node:path";

type RedirectEntry = {
  source: string;
  destination: string;
  note?: string;
};

type RedirectsFile = {
  redirects: RedirectEntry[];
};

export function loadPermanentRedirects(): Array<{
  source: string;
  destination: string;
  permanent: true;
}> {
  const path = join(process.cwd(), "docs", "redirects.json");
  const data = JSON.parse(readFileSync(path, "utf8")) as RedirectsFile;

  return data.redirects.map((entry) => ({
    source: entry.source,
    destination: entry.destination,
    permanent: true,
  }));
}
