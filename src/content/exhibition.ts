import { getSeason } from "@/content/lectures";
import newsManifest from "../../content/news/manifest.json";
import type { AnnualExhibition, PermanentExhibition } from "@/content/types";
import { formatDateRange } from "@/lib/formatDateRange";
import { todayInWarsaw } from "@/lib/isoDate";
import { pl } from "@/i18n/pl";
import annualManifest from "../../content/exhibition/annual.json";
import * as exhibitionBody from "../../content/exhibition/body.mdx";
import { frontmatter as pageFrontmatter } from "../../content/exhibition/page.mdx";

type AnnualManifest = {
  sample?: boolean;
  exhibitions: AnnualExhibition[];
};

type ExhibitionBodyExports = {
  descriptionParagraphs: string[];
};

/** Annual show closes on this day of its year unless `dateEnd` says otherwise (house convention, K-84). */
const ANNUAL_DEFAULT_END_MONTH_DAY = "08-31";

const manifest = annualManifest as AnnualManifest;
const permanentExhibition = pageFrontmatter as PermanentExhibition;
const { descriptionParagraphs } = exhibitionBody as unknown as ExhibitionBodyExports;

function assertKnownLectureSeason(seasonSlug: string): void {
  if (!getSeason(seasonSlug)) {
    throw new Error(
      `exhibition/annual.json: unknown seasonSlug "${seasonSlug}" — no matching LectureSeason`,
    );
  }
}

const newsSlugs = new Set(
  (newsManifest as Array<{ slug: string }>).map((entry) => entry.slug),
);

function validateAnnualExhibitions(exhibitions: AnnualExhibition[]): void {
  exhibitions.forEach((exhibition) => {
    if (!exhibition.title.trim()) {
      throw new Error(
        `exhibition/annual.json: missing title for season "${exhibition.seasonSlug}"`,
      );
    }

    assertKnownLectureSeason(exhibition.seasonSlug);

    if (exhibition.newsSlug && !newsSlugs.has(exhibition.newsSlug)) {
      throw new Error(
        `exhibition/annual.json: unknown newsSlug "${exhibition.newsSlug}" for season "${exhibition.seasonSlug}"`,
      );
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

    if (entry.newsSlug && !newsSlugs.has(entry.newsSlug)) {
      throw new Error(
        `exhibition/page.mdx: unknown newsSlug "${entry.newsSlug}" in travelingPlaces[${index}]`,
      );
    }
  });
}

validatePermanentExhibition(permanentExhibition);

const allAnnualExhibitions = [...manifest.exhibitions].sort(
  (a, b) => getAnnualExhibitionYear(b.seasonSlug) - getAnnualExhibitionYear(a.seasonSlug),
);

export type LoadedExhibitionPage = PermanentExhibition & {
  descriptionParagraphs: string[];
};

export type ExhibitionNowNextSection = "ekspozycja" | "doroczna";

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

/** Annual exhibition linked to a news article — undefined when slug is unknown or unlinked (K-103). */
export function getAnnualExhibitionByNewsSlug(slug: string): AnnualExhibition | undefined {
  return getAnnualExhibitions().find((exhibition) => exhibition.newsSlug === slug);
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

export function getAnnualIconCountLabel(): string {
  return pl.exhibition.annual.facts.onDisplayValue;
}

export function getAnnualOpenPeriodLabel(
  exhibition: AnnualExhibition,
  today: string = todayInWarsaw(),
): string {
  const dateEnd = resolveAnnualDateEnd(exhibition);

  if (isAnnualExhibitionActive(exhibition, today)) {
    return `do ${formatDateRange(dateEnd, undefined, { withYear: true })}`;
  }

  return "Czerwiec – 31 sierpnia";
}

export function getExhibitionPage(): LoadedExhibitionPage {
  return {
    ...getPermanentExhibition(),
    descriptionParagraphs,
  };
}
