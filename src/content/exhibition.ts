import type { ComponentType } from "react";

import type { ExhibitionEdition, ExhibitionState, Image } from "@/content/types";
import { getExhibitionState } from "@/content/types";
import { formatDateRange } from "@/lib/formatDateRange";
import { pl } from "@/i18n/pl";
import editionsManifest from "../../content/exhibition/editions.json";
import * as exhibitionBody from "../../content/exhibition/body.mdx";
import { frontmatter as pageFrontmatter } from "../../content/exhibition/page.mdx";

type EditionsManifest = {
  sample?: boolean;
  editions: ExhibitionEdition[];
};

type ExhibitionPageFrontmatter = {
  title: string;
  lead: string;
  sample?: boolean;
  interiorPhotos: Image[];
};

type ExhibitionBodyExports = {
  descriptionParagraphs: string[];
};

const manifest = editionsManifest as EditionsManifest;
const pageMeta = pageFrontmatter as ExhibitionPageFrontmatter;
const { descriptionParagraphs } = exhibitionBody as unknown as ExhibitionBodyExports;

const allEditions = [...manifest.editions].sort((a, b) => b.year - a.year);

export type LoadedExhibitionPage = ExhibitionPageFrontmatter & {
  descriptionParagraphs: string[];
};

export type ExhibitionUpcomingHighlight = {
  title: string;
  text: string;
  href: string;
  linkLabel: string;
};

function compareByYearDesc(a: ExhibitionEdition, b: ExhibitionEdition): number {
  return b.year - a.year;
}

/** All editions, newest first. */
export function getExhibitionEditions(): ExhibitionEdition[] {
  return [...allEditions].sort(compareByYearDesc);
}

/** Highest-year edition — the one on display or announced. */
export function getCurrentEdition(): ExhibitionEdition {
  const [current] = getExhibitionEditions();
  if (!current) {
    throw new Error("exhibition/editions.json must contain at least one edition");
  }
  return current;
}

/** Editions before the current one (WY-50). */
export function getPreviousEditions(): ExhibitionEdition[] {
  const current = getCurrentEdition();
  return getExhibitionEditions().filter((edition) => edition.year < current.year);
}

export function resolveExhibitionState(now: Date = new Date()): ExhibitionState {
  return getExhibitionState(getCurrentEdition(), now);
}

export function getExhibitionPage(): LoadedExhibitionPage {
  return {
    ...pageMeta,
    descriptionParagraphs,
  };
}

/** Third „Najbliższe” tile — derived from edition data (D-08-07, K-58). */
export function getExhibitionUpcomingHighlight(now: Date = new Date()): ExhibitionUpcomingHighlight {
  const edition = getCurrentEdition();
  const state = getExhibitionState(edition, now);
  const { upcoming } = pl.exhibition;

  if (state === "zapowiedz" && edition.vernissage) {
    const dateLabel = formatDateRange(edition.vernissage, undefined, { withYear: true });
    return {
      title: upcoming.zapowiedz.title.replace("{date}", dateLabel),
      text: upcoming.zapowiedz.text,
      href: "/ikony/wystawa",
      linkLabel: upcoming.zapowiedz.linkLabel,
    };
  }

  return {
    title: upcoming.biezaca.title.replace("{year}", String(edition.year)),
    text: upcoming.biezaca.text,
    href: "/ikony/wystawa",
    linkLabel: upcoming.biezaca.linkLabel,
  };
}

export type ExhibitionEditionCardModel = ExhibitionEdition & {
  Content?: ComponentType;
};
