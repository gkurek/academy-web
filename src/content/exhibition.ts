import { getSeason } from "@/content/lectures";
import type { AnnualExhibition, PermanentExhibition } from "@/content/types";
import { todayInWarsaw } from "@/lib/isoDate";
import { assertMdxExports, assertNewsSlug } from "@/content/validate";
import annualManifest from "../../content/exhibition/annual.json";
import * as exhibitionBody from "../../content/exhibition/body.mdx";
import * as pageModule from "../../content/exhibition/page.mdx";

type AnnualManifest = {
  sample?: boolean;
  exhibitions: AnnualExhibition[];
};

type ExhibitionBodyExports = {
  descriptionParagraphs: string[];
};

/** Annual show closes on this day of its year unless `dateEnd` says otherwise (house convention, K-84). */
const ANNUAL_DEFAULT_END_MONTH_DAY = "08-31";

/** Prose of `/ikony/wystawy` from `content/exhibition/page.mdx`; labels and UI strings live in `pl.exhibition`. */
export type ExhibitionCopy = {
  page: { eyebrow: string; title: string; lead: string };
  annual: {
    eyebrow: string;
    title: string;
    intro1: string;
    titleSentencePast: string;
    titleSentenceCurrent: string;
    intro3: string;
    scheduleSince: string;
    scheduleNext: string;
    scheduleNextMissing: string;
    facts: { whenValue: string; vernissageValue: string; onDisplayValue: string; admissionValue: string };
  };
  permanent: {
    eyebrow: string;
    facts: { whenValue: string; hoursValue: string; onDisplayValue: string; admissionValue: string };
  };
  tours: { introBefore: string; introAfter: string };
  traveling: { introBefore: string; introAfter: string };
  whereValue: string;
};

const manifest = annualManifest as AnnualManifest;
const { frontmatter: pageFrontmatter, copy: exhibitionCopy } = assertMdxExports<{
  frontmatter: PermanentExhibition;
  copy: ExhibitionCopy;
}>(pageModule, ["frontmatter", "copy"], "content/exhibition/page.mdx");
const permanentExhibition = pageFrontmatter;
const { descriptionParagraphs } = assertMdxExports<ExhibitionBodyExports>(
  exhibitionBody,
  ["descriptionParagraphs"],
  "content/exhibition/body.mdx",
);

function assertKnownLectureSeason(seasonSlug: string): void {
  if (!getSeason(seasonSlug)) {
    throw new Error(
      `exhibition/annual.json: unknown seasonSlug "${seasonSlug}" — no matching LectureSeason`,
    );
  }
}

function validateAnnualExhibitions(exhibitions: AnnualExhibition[]): void {
  exhibitions.forEach((exhibition) => {
    if (!exhibition.title.trim()) {
      throw new Error(
        `exhibition/annual.json: missing title for season "${exhibition.seasonSlug}"`,
      );
    }

    assertKnownLectureSeason(exhibition.seasonSlug);

    if (exhibition.newsSlug) {
      assertNewsSlug(exhibition.newsSlug, `exhibition/annual.json season "${exhibition.seasonSlug}"`);
    }
  });
}

validateAnnualExhibitions(manifest.exhibitions);

function validatePermanentExhibition(exhibition: PermanentExhibition): void {
  if (!Array.isArray(exhibition.travelingPlaces)) {
    throw new Error("exhibition/page.mdx: travelingPlaces must be an array");
  }

  exhibition.travelingPlaces.forEach((entry, index) => {
    if (!entry.place.trim()) {
      throw new Error(`exhibition/page.mdx: travelingPlaces[${index}] missing place`);
    }

    if (entry.newsSlug) {
      assertNewsSlug(entry.newsSlug, `exhibition/page.mdx travelingPlaces[${index}]`);
    }
  });
}

validatePermanentExhibition(permanentExhibition);

/** Every string in the copy block must be filled — an empty one would render a blank paragraph. */
function assertCopyFilled(node: unknown, path: string): void {
  if (typeof node === "string") {
    if (!node.trim()) {
      throw new Error(`content/exhibition/page.mdx: copy.${path} is empty`);
    }
    return;
  }

  if (node === null || typeof node !== "object") {
    throw new Error(`content/exhibition/page.mdx: copy.${path} must be a string or an object`);
  }

  Object.entries(node).forEach(([key, value]) => assertCopyFilled(value, path ? `${path}.${key}` : key));
}

assertCopyFilled(exhibitionCopy, "");

export function getExhibitionCopy(): ExhibitionCopy {
  return exhibitionCopy;
}

const allAnnualExhibitions = [...manifest.exhibitions].sort(
  (a, b) => getAnnualExhibitionYear(b.seasonSlug) - getAnnualExhibitionYear(a.seasonSlug),
);

export type LoadedExhibitionPage = PermanentExhibition & {
  descriptionParagraphs: string[];
};

type ExhibitionNowNextSection = "ekspozycja" | "doroczna";

export type ExhibitionNowNextRow = {
  section: ExhibitionNowNextSection;
  permanentTitle?: string;
  annualYear?: number;
  annualTitle?: string;
  vernissageDate?: string;
  dateEnd?: string;
  untilMidJuneYear?: number;
};

export type ExhibitionNowNext = {
  now: ExhibitionNowNextRow;
  next: ExhibitionNowNextRow;
};

/** Vernissage year = second year of the lecture season (K-84). */
export function getAnnualExhibitionYear(seasonSlug: string): number {
  const [, endYear] = seasonSlug.split("-");
  const year = Number(endYear);

  if (!Number.isFinite(year)) {
    throw new Error(`exhibition: invalid seasonSlug "${seasonSlug}"`);
  }

  return year;
}

export function getPermanentExhibition(): PermanentExhibition {
  return permanentExhibition;
}

export function getAnnualExhibitions(): AnnualExhibition[] {
  return [...allAnnualExhibitions];
}

export function getLatestAnnualExhibition(): AnnualExhibition {
  const [latest] = getAnnualExhibitions();

  if (!latest) {
    throw new Error("exhibition/annual.json must contain at least one exhibition");
  }

  return latest;
}

/** Explicit vernissage only — without it the show is „termin wkrótce” (S-12: never guess dates). */
export function resolveAnnualVernissage(exhibition: AnnualExhibition): string | undefined {
  return exhibition.vernissage;
}

/** Explicit `dateEnd`, else 31 August of the exhibition year (derived from the season, not from guessed dates). */
export function resolveAnnualDateEnd(exhibition: AnnualExhibition): string {
  return (
    exhibition.dateEnd ??
    `${getAnnualExhibitionYear(exhibition.seasonSlug)}-${ANNUAL_DEFAULT_END_MONTH_DAY}`
  );
}

export function isAnnualExhibitionActive(
  exhibition: AnnualExhibition,
  today: string = todayInWarsaw(),
): boolean {
  const vernissage = resolveAnnualVernissage(exhibition);
  return vernissage !== undefined && vernissage <= today && today <= resolveAnnualDateEnd(exhibition);
}

export function getLastFinishedAnnualExhibition(
  today: string = todayInWarsaw(),
): AnnualExhibition | undefined {
  return getAnnualExhibitions().find((exhibition) => today > resolveAnnualDateEnd(exhibition));
}

/** Smallest vernissage year in `annual.json` (K-127). */
export function getFirstAnnualExhibitionYear(): number {
  const exhibitions = getAnnualExhibitions();
  const oldest = exhibitions[exhibitions.length - 1];

  if (!oldest) {
    throw new Error("exhibition/annual.json must contain at least one exhibition");
  }

  return getAnnualExhibitionYear(oldest.seasonSlug);
}

/** Newest season with at least one photo (K-127 tile caption). */
export function getLatestAnnualExhibitionWithPhotos(): AnnualExhibition | undefined {
  return getAnnualExhibitions().find((exhibition) => (exhibition.photos?.length ?? 0) > 0);
}

/** Hero „Teraz w kościele / Następnie” — date-driven state only (K-85, K-127). */
export function getExhibitionNowNext(today: string = todayInWarsaw()): ExhibitionNowNext {
  const latest = getLatestAnnualExhibition();
  const permanent = getPermanentExhibition();
  const vernissage = resolveAnnualVernissage(latest);
  const dateEnd = resolveAnnualDateEnd(latest);
  const annualYear = getAnnualExhibitionYear(latest.seasonSlug);

  if (isAnnualExhibitionActive(latest, today)) {
    return {
      now: {
        section: "doroczna",
        annualYear,
        annualTitle: latest.title,
        dateEnd,
      },
      next: {
        section: "ekspozycja",
        permanentTitle: permanent.title,
      },
    };
  }

  return {
    now: {
      section: "ekspozycja",
      permanentTitle: permanent.title,
      untilMidJuneYear: annualYear,
    },
    next: {
      section: "doroczna",
      annualYear,
      annualTitle: latest.title,
      vernissageDate: vernissage,
    },
  };
}

export function getExhibitionPage(): LoadedExhibitionPage {
  return {
    ...getPermanentExhibition(),
    descriptionParagraphs,
  };
}
