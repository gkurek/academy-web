import { getSeason } from "@/content/lectures";
import newsManifest from "../../content/news/manifest.json";
import type { AnnualExhibition, PermanentExhibition } from "@/content/types";
import { formatDateRange } from "@/lib/formatDateRange";
import { pl } from "@/i18n/pl";
import annualManifest from "../../content/exhibition/annual.json";
import * as exhibitionBody from "../../content/exhibition/body.mdx";
import { frontmatter as pageFrontmatter } from "../../content/exhibition/page.mdx";
import archiveMeta from "../../content/lectures/archive.json";

type AnnualManifest = {
  sample?: boolean;
  exhibitions: AnnualExhibition[];
};

type ExhibitionBodyExports = {
  descriptionParagraphs: string[];
};

const CURRENT_SEASON_SLUG = "2026-2027";
const EXHIBITION_ROUTE = "/ikony/wystawy";

const manifest = annualManifest as AnnualManifest;
const permanentExhibition = pageFrontmatter as PermanentExhibition;
const { descriptionParagraphs } = exhibitionBody as unknown as ExhibitionBodyExports;

function parseSeasonStartYear(seasonSlug: string): number {
  return Number(seasonSlug.split("-")[0]);
}

function isKnownLectureSeasonSlug(seasonSlug: string): void {
  if (seasonSlug === CURRENT_SEASON_SLUG) {
    return;
  }

  const { firstSeason, lastSeason } = archiveMeta;
  const startYear = parseSeasonStartYear(firstSeason);
  const endYear = parseSeasonStartYear(lastSeason);
  const slugStartYear = parseSeasonStartYear(seasonSlug);

  if (slugStartYear < startYear || slugStartYear > endYear) {
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

    isKnownLectureSeasonSlug(exhibition.seasonSlug);

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

export type ExhibitionUpcomingHighlight = {
  title: string;
  text: string;
  href: string;
  linkLabel: string;
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

export function resolveAnnualVernissage(exhibition: AnnualExhibition): string | undefined {
  if (exhibition.vernissage) {
    return exhibition.vernissage;
  }

  const season = getSeason(exhibition.seasonSlug);
  if (!season || season.lectures.length === 0) {
    return undefined;
  }

  const vernissageLecture =
    season.lectures.find((lecture) => lecture.note?.toLowerCase().includes("wernisaż")) ??
    season.lectures[season.lectures.length - 1];

  return vernissageLecture?.dateIso;
}

export function resolveAnnualDateEnd(exhibition: AnnualExhibition): string | undefined {
  if (exhibition.dateEnd) {
    return exhibition.dateEnd;
  }

  const vernissage = resolveAnnualVernissage(exhibition);
  if (!vernissage) {
    return undefined;
  }

  const vernissageYear = Number(vernissage.split("-")[0]);
  return `${vernissageYear}-08-31`;
}

export function isAnnualExhibitionActive(
  exhibition: AnnualExhibition,
  now: Date = new Date(),
): boolean {
  const vernissage = resolveAnnualVernissage(exhibition);
  const dateEnd = resolveAnnualDateEnd(exhibition);

  if (!vernissage || !dateEnd) {
    return false;
  }

  const start = new Date(vernissage);
  const end = new Date(dateEnd);
  end.setHours(23, 59, 59, 999);

  return now >= start && now <= end;
}

export function getLastFinishedAnnualExhibition(
  now: Date = new Date(),
): AnnualExhibition | undefined {
  return getAnnualExhibitions().find((exhibition) => {
    const dateEnd = resolveAnnualDateEnd(exhibition);
    if (!dateEnd) {
      return false;
    }

    const end = new Date(dateEnd);
    end.setHours(23, 59, 59, 999);
    return now > end;
  });
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
export function getExhibitionNowNext(now: Date = new Date()): ExhibitionNowNext {
  const latest = getLatestAnnualExhibition();
  const permanent = getPermanentExhibition();
  const vernissage = resolveAnnualVernissage(latest);
  const dateEnd = resolveAnnualDateEnd(latest);
  const annualYear = getAnnualExhibitionYear(latest.seasonSlug);

  if (isAnnualExhibitionActive(latest, now)) {
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
  now: Date = new Date(),
): string {
  const dateEnd = resolveAnnualDateEnd(exhibition);

  if (isAnnualExhibitionActive(exhibition, now) && dateEnd) {
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

/** Third „Najbliższe” tile — only when vernissage is upcoming or the annual show is on (K-85). */
export function getExhibitionUpcomingHighlight(
  now: Date = new Date(),
): ExhibitionUpcomingHighlight | null {
  const exhibition = getLatestAnnualExhibition();
  const vernissage = resolveAnnualVernissage(exhibition);
  const { upcoming } = pl.exhibition;

  if (vernissage && new Date(vernissage) > now) {
    const dateLabel = formatDateRange(vernissage, undefined, { withYear: true });
    return {
      title: upcoming.zapowiedz.title.replace("{date}", dateLabel),
      text: upcoming.zapowiedz.text,
      href: EXHIBITION_ROUTE,
      linkLabel: upcoming.zapowiedz.linkLabel,
    };
  }

  if (isAnnualExhibitionActive(exhibition, now)) {
    return {
      title: upcoming.biezaca.title.replace("{title}", exhibition.title),
      text: upcoming.biezaca.text,
      href: EXHIBITION_ROUTE,
      linkLabel: upcoming.biezaca.linkLabel,
    };
  }

  return null;
}
