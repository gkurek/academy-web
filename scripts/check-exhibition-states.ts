/**
 * Regression check for exhibition date helpers (k3 A6).
 * When to run: after changing exhibition date or season logic (`src/content/exhibition.ts`, `lectures.ts`).
 * Usage (from repo root): npm run check:states, or npx tsx scripts/check-exhibition-states.ts
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { pl } from "../src/i18n/pl";
import {
  getAnnualExhibitions,
  getExhibitionNowNext,
  getLatestAnnualExhibition,
  isAnnualExhibitionActive,
  resolveAnnualDateEnd,
  resolveAnnualVernissage,
} from "../src/content/exhibition";
import { getSeason } from "../src/content/lectures";
import { addDays, todayInWarsaw } from "../src/lib/isoDate";

const ROOT = process.cwd();
const NEWS_DIR = join(ROOT, "content/news");
const SRC_DIR = join(ROOT, "src");

const SECTION_IDS: Set<string> = new Set(pl.exhibition.page.toc.map((item) => item.id));

type Scenario = {
  label: string;
  at: string;
};

function assertConsistency(label: string, today: string): string[] {
  const errors: string[] = [];
  const latest = getLatestAnnualExhibition();
  const vernissage = resolveAnnualVernissage(latest);
  const dateEnd = resolveAnnualDateEnd(latest);
  const active = isAnnualExhibitionActive(latest, today);
  const beforeVernissage = Boolean(vernissage && vernissage > today);
  const nowNext = getExhibitionNowNext(today);

  if (active) {
    if (nowNext.now.section !== "doroczna") {
      errors.push(
        `${label}: annual show active but nowNext.now.section is "${nowNext.now.section}" (expected doroczna)`,
      );
    }
  } else if (beforeVernissage) {
    if (nowNext.now.section !== "ekspozycja") {
      errors.push(
        `${label}: before vernissage but nowNext.now.section is "${nowNext.now.section}" (expected ekspozycja)`,
      );
    }
    if (nowNext.next.section !== "doroczna") {
      errors.push(
        `${label}: before vernissage but nowNext.next.section is "${nowNext.next.section}" (expected doroczna)`,
      );
    }
  } else {
    if (nowNext.now.section !== "ekspozycja") {
      errors.push(
        `${label}: off-season but nowNext.now.section is "${nowNext.now.section}" (expected ekspozycja)`,
      );
    }
  }

  const summary = [
    `${today}  ${label}`,
    `  active=${active} beforeVernissage=${beforeVernissage}`,
    `  now=${nowNext.now.section} next=${nowNext.next.section}`,
    `  vernissage=${vernissage ?? "(none — termin wkrótce)"}`,
    `  dateEnd=${dateEnd}`,
  ]
    .filter(Boolean)
    .join("\n");

  return errors.length > 0 ? [summary, ...errors.map((e) => `  ERROR: ${e}`)] : [summary];
}

function collectExhibitionLinks(): Array<{ href: string; source: string }> {
  const pattern = /\/ikony\/wystawy(?:#[\w-]+)?/g;
  const links: Array<{ href: string; source: string }> = [];

  const scanFile = (filePath: string, label: string) => {
    const text = readFileSync(filePath, "utf8");
    const matches = text.match(pattern) ?? [];
    matches.forEach((href) => {
      links.push({ href, source: label });
    });
  };

  readdirSync(NEWS_DIR)
    .filter((name) => name.endsWith(".mdx"))
    .forEach((name) => scanFile(join(NEWS_DIR, name), `content/news/${name}`));

  const walkSrc = (dir: string) => {
    readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        walkSrc(fullPath);
        return;
      }
      if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
        scanFile(fullPath, fullPath.replace(`${ROOT}\\`, "").replace(`${ROOT}/`, ""));
      }
    });
  };

  walkSrc(SRC_DIR);
  return links;
}

function validateExhibitionAnchors(): string[] {
  const errors: string[] = [];
  const links = collectExhibitionLinks();
  const counts = new Map<string, number>();

  links.forEach(({ href, source }) => {
    const key = href;
    counts.set(key, (counts.get(key) ?? 0) + 1);

    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) {
      return;
    }

    const anchor = href.slice(hashIndex + 1);
    if (!SECTION_IDS.has(anchor)) {
      errors.push(`Invalid anchor "#${anchor}" in ${source} (${href})`);
    }
  });

  console.log("\nExhibition links (/ikony/wystawy…):");
  [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([href, count]) => {
      console.log(`  ${count}× ${href}`);
    });

  return errors;
}

/**
 * S-12: vernissage dates are never guessed in the site. The old heuristic (lecture `note` with
 * „wernisaż”) survives only here, as a hint for editors to add an explicit `vernissage`.
 */
function warnMissingVernissage(): string[] {
  return getAnnualExhibitions()
    .filter((exhibition) => !exhibition.vernissage)
    .flatMap((exhibition) => {
      const hinted = getSeason(exhibition.seasonSlug)?.lectures.find((lecture) =>
        lecture.note?.toLowerCase().includes("wernisaż"),
      );
      return hinted
        ? [
            `annual.json "${exhibition.seasonSlug}": no vernissage, but lecture ${hinted.dateIso} mentions „wernisaż” — add vernissage if confirmed`,
          ]
        : [];
    });
}

function main(): void {
  const latest = getLatestAnnualExhibition();
  const vernissage = resolveAnnualVernissage(latest);
  const dateEnd = resolveAnnualDateEnd(latest);
  const today = todayInWarsaw();

  const vernissageScenarios: Scenario[] = vernissage
    ? [
        { label: "before vernissage (vernissage - 1d)", at: addDays(vernissage, -1) },
        { label: "vernissage day", at: vernissage },
        { label: "during annual show", at: addDays(vernissage, 14) },
      ]
    : [];

  const scenarios: Scenario[] = [
    ...vernissageScenarios,
    { label: "day after annual end", at: addDays(dateEnd, 1) },
    { label: "today (Warsaw)", at: today },
  ];

  console.log("Exhibition helper states (calendar days in Warsaw):\n");
  const allErrors: string[] = [];

  scenarios.forEach((scenario) => {
    const lines = assertConsistency(scenario.label, scenario.at);
    console.log(lines.join("\n"));
    console.log("");
    lines
      .filter((line) => line.startsWith("  ERROR:"))
      .forEach((line) => allErrors.push(line.replace("  ERROR: ", "")));
  });

  allErrors.push(...validateExhibitionAnchors());

  const warnings = warnMissingVernissage();
  if (warnings.length > 0) {
    console.warn("\nWarnings:");
    warnings.forEach((message) => console.warn(`  - ${message}`));
  }

  if (allErrors.length > 0) {
    console.error("\nCheck failed:");
    allErrors.forEach((message) => console.error(`  - ${message}`));
    process.exit(1);
  }

  console.log("\nAll exhibition state checks passed.");
  console.log(
    "Note: /ikony/wystawy hero reflects build-time dates until the next deploy (etap 11).",
  );
}

main();
