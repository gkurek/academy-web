/**
 * Home „Najbliższe” — prints the state of all three slots across a year (plan 10-k4 4.2).
 * When to run: after changing enrollment, upcoming-tile or date logic (`src/content/upcoming.ts`, `enrollment.ts`).
 * Usage (from repo root): npm run check:states, or npx tsx scripts/check-upcoming-states.ts [YYYY-MM-DD ...]
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { resolveEnrollmentState } from "../src/content/enrollment";
import type { OfferFacts } from "../src/content/types";
import { getUpcomingTiles, UPCOMING_SLOTS, type UpcomingOfferFacts } from "../src/content/upcoming";
import { addDays, todayInWarsaw } from "../src/lib/isoDate";

type Scenario = {
  label: string;
  at: string;
};

const PLACEHOLDER_RE = /\{[a-zA-Z]+\}/;
const FRONTMATTER_RE = /export const frontmatter = (\{[\s\S]*?\n\});/;

/** Offer MDX bodies contain JSX that tsx cannot load — evaluate only the frontmatter object literal. */
function readOfferFacts(slug: string): OfferFacts {
  const source = readFileSync(join(process.cwd(), "content/offers", `${slug}.mdx`), "utf8");
  const match = source.match(FRONTMATTER_RE);
  if (!match) {
    throw new Error(`content/offers/${slug}.mdx: frontmatter export not found`);
  }
  const frontmatter = new Function(`return (${match[1]});`)() as { facts: OfferFacts };
  return frontmatter.facts;
}

const offers: UpcomingOfferFacts = {
  kurs: readOfferFacts("kurs-roczny-i-trzyletni"),
  plener: readOfferFacts("letnia-szkola-swiatla"),
};

function monthlyScenarios(): Scenario[] {
  const [year, month] = todayInWarsaw().split("-").map(Number);

  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(Date.UTC(year, month - 1 + index, 15));
    const iso = date.toISOString().slice(0, 10);
    return { label: iso.slice(0, 7), at: iso };
  });
}

function boundaryScenarios(): Scenario[] {
  const close = offers.kurs.enrollmentClose;
  const kursBoundaries: Scenario[] = close
    ? [
        { label: "enrollment close (kurs)", at: close },
        { label: "day after enrollment close", at: addDays(close, 1) },
      ]
    : [];

  return [
    ...kursBoundaries,
    { label: "first meeting (kurs)", at: "2026-10-06" },
    { label: "day after first lecture", at: "2026-10-07" },
    { label: "plener registration opens", at: "2027-03-01" },
    { label: "vernissage lead start", at: "2027-05-13" },
    { label: "vernissage day", at: "2027-06-12" },
    { label: "annual show end", at: "2027-08-31" },
    { label: "day after annual show", at: "2027-09-01" },
  ];
}

function cliScenarios(): Scenario[] {
  return process.argv.slice(2).map((at) => ({ label: "cli", at }));
}

function check(scenario: Scenario): string[] {
  const tiles = getUpcomingTiles(offers, scenario.at);
  const errors: string[] = [];

  // FactsBox and the Warsztaty tile read the same window (D5): an "enrollment" tile means the course is open.
  const kursState = resolveEnrollmentState("kurs", offers.kurs, offers, scenario.at);
  const warsztaty = tiles.find((tile) => tile.slot === "warsztaty");
  if (warsztaty?.state.startsWith("enrollment") && kursState !== "open") {
    errors.push(`${scenario.at}: Warsztaty tile shows enrollment but the course FactsBox is ${kursState}`);
  }

  if (tiles.length !== UPCOMING_SLOTS.length) {
    errors.push(`${scenario.at}: expected ${UPCOMING_SLOTS.length} tiles, got ${tiles.length}`);
  }

  tiles.forEach((tile, index) => {
    if (tile.slot !== UPCOMING_SLOTS[index]) {
      errors.push(`${scenario.at}: slot ${index} is "${tile.slot}", expected "${UPCOMING_SLOTS[index]}"`);
    }

    (["title", "text", "href", "linkLabel"] as const).forEach((field) => {
      const value = tile[field];
      if (!value.trim()) {
        errors.push(`${scenario.at} ${tile.slot}: empty ${field}`);
      }
      if (PLACEHOLDER_RE.test(value)) {
        errors.push(`${scenario.at} ${tile.slot}: unfilled placeholder in ${field} ("${value}")`);
      }
    });
  });

  console.log(`${scenario.at}  ${scenario.label}  (kurs FactsBox: ${kursState})`);
  tiles.forEach((tile) => {
    const source = tile.source === "override" ? " [override]" : "";
    console.log(`  ${tile.slot.padEnd(9)} ${tile.state.padEnd(19)} ${tile.text} | ${tile.title}${source}`);
    console.log(`  ${"".padEnd(9)} ${"".padEnd(19)} → ${tile.linkLabel} (${tile.href})`);
  });
  console.log("");

  return errors;
}

function main(): void {
  const custom = cliScenarios();
  const scenarios =
    custom.length > 0
      ? custom
      : [{ label: "today", at: todayInWarsaw() }, ...monthlyScenarios(), ...boundaryScenarios()];

  const errors = scenarios.flatMap(check);

  if (errors.length > 0) {
    console.error("Check failed:");
    errors.forEach((message) => console.error(`  - ${message}`));
    process.exit(1);
  }

  console.log(`All ${scenarios.length} upcoming scenarios passed.`);
  console.log("Note: the home page reflects the build / revalidation date (N9, etap 11).");
}

main();
