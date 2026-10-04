import newsManifest from "../../content/news/manifest.json";
import {
  getLatestAnnualExhibition,
  getPermanentExhibition,
  resolveAnnualDateEnd,
  resolveAnnualVernissage,
} from "@/content/exhibition";
import { getLecturerDirectoryEntry } from "@/content/lecturer-directory";
import { getLecturer } from "@/content/lecturers";
import { formatLectureDate, getAllSeasonLectures } from "@/content/lectures";
import { getSiteSettings } from "@/content/settings";
import type { NewsKind, OfferFacts, UpcomingSlot } from "@/content/types";
import { formatDateRange } from "@/lib/formatDateRange";
import { pl } from "@/i18n/pl";

/** Fixed tile order — matches `Pillars` below the section (N1). */
export const UPCOMING_SLOTS: UpcomingSlot[] = ["warsztaty", "wyklady", "ikony"];

/** News kinds that may replace a slot's default link (N3, N8). */
const SLOT_NEWS_KINDS: Record<UpcomingSlot, NewsKind[]> = {
  warsztaty: ["warsztaty"],
  wyklady: ["wyklady"],
  ikony: ["wystawa"],
};

/** A news entry is "fresh" for at most this many days after its date (N3). */
const FRESH_NEWS_DAYS = 30;

/** Vernissage announcement shows this many days before the vernissage (N4). */
const VERNISSAGE_LEAD_DAYS = 30;

/** Fallback start of the course enrollment window when `enrollmentOpens` is empty (N6: „od czerwca”). */
const ENROLLMENT_FALLBACK_OPENS_MONTH_DAY = "06-01";
/** Fallback end of the enrollment window when neither `enrollmentClose` nor `firstMeetingDate` is set. */
const ENROLLMENT_FALLBACK_CLOSE_MONTH_DAY = "09-30";
/** Course runs October–June; after this day of the second season year the season is over. */
const COURSE_SEASON_END_MONTH_DAY = "06-30";
/** Letnia Szkoła Światła registration window opens in March (N6). */
const PLENER_REGISTRATION_OPENS_MONTH_DAY = "03-01";

const KURS_ROUTE = "/warsztaty/kurs-roczny-i-trzyletni";
const PLENER_ROUTE = "/warsztaty/letnia-szkola-swiatla";
const LECTURES_ROUTE = "/wyklady";
const EXHIBITION_ROUTE = "/ikony/wystawy";

export type UpcomingSource = "auto" | "override";

export type UpcomingTile = {
  slot: UpcomingSlot;
  /** Machine-readable state, for checks and debugging only. */
  state: string;
  source: UpcomingSource;
  title: string;
  text: string;
  href: string;
  linkLabel: string;
};

type SlotDefault = Omit<UpcomingTile, "slot" | "source">;

/** Workshop offer facts the Warsztaty slot is computed from (N6, N7). Passed in so this module stays free of MDX imports. */
export type UpcomingOfferFacts = {
  kurs: OfferFacts;
  plener: OfferFacts;
};

type NewsManifestEntry = {
  slug: string;
  date: string;
  kind: NewsKind;
};

const newsEntries = newsManifest as NewsManifestEntry[];

const warsawDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Warsaw",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Calendar day in Warsaw as YYYY-MM-DD — build hosts may run in UTC. */
export function toWarsawIsoDate(now: Date): string {
  return warsawDateFormatter.format(now);
}

function addDays(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

function fill(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

function formatFullDate(isoDate: string): string {
  return formatDateRange(isoDate, undefined, { withYear: true });
}

function seasonLabel(startYear: number): string {
  return `${startYear}/${startYear + 1}`;
}

function parseYear(value: string | undefined): number | undefined {
  const year = Number(value?.slice(0, 4));
  return Number.isInteger(year) && year > 0 ? year : undefined;
}

/** Newest news entry of the slot's kinds dated no more than FRESH_NEWS_DAYS ago (future dates count). */
function findFreshNews(slot: UpcomingSlot, today: string): NewsManifestEntry | undefined {
  const oldestFresh = addDays(today, -FRESH_NEWS_DAYS);
  const kinds = SLOT_NEWS_KINDS[slot];

  return newsEntries
    .filter((entry) => kinds.includes(entry.kind) && entry.date >= oldestFresh)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
}

function withFreshNewsLink(slot: UpcomingSlot, today: string, tile: SlotDefault): SlotDefault {
  const news = findFreshNews(slot, today);
  if (!news) {
    return tile;
  }

  return {
    ...tile,
    href: `/aktualnosci/${news.slug}`,
    linkLabel: pl.home.upcoming.newsLinkLabel,
  };
}

// --- Warsztaty (N6) ---

type Window = { start: string; end: string };

function isWithin(today: string, window: Window): boolean {
  return window.start <= today && today <= window.end;
}

function enrollmentOpensFor(year: number, facts: OfferFacts, courseStartYear: number): string {
  const known = year === courseStartYear ? facts.enrollmentOpens : undefined;
  return known ?? `${year}-${ENROLLMENT_FALLBACK_OPENS_MONTH_DAY}`;
}

function resolvePlenerWindow(
  today: string,
  plenerFacts: OfferFacts,
  kursFacts: OfferFacts,
  courseStartYear: number,
): { window: Window; year: number; registrationClose?: string } {
  const dataYear = parseYear(plenerFacts.dateStart) ?? parseYear(plenerFacts.seasonLabel);
  const todayYear = Number(today.slice(0, 4));
  // Stale data (last year's plener) falls back to the current year without dates.
  const year = Math.max(dataYear ?? todayYear, todayYear);
  const registrationClose =
    year === dataYear ? plenerFacts.registrationClose : undefined;

  // Without a known deadline the plener yields as soon as course enrollment opens.
  const end =
    registrationClose ?? addDays(enrollmentOpensFor(year, kursFacts, courseStartYear), -1);

  return {
    window: { start: `${year}-${PLENER_REGISTRATION_OPENS_MONTH_DAY}`, end },
    year,
    registrationClose,
  };
}

function resolveWarsztaty(today: string, offers: UpcomingOfferFacts): SlotDefault {
  const strings = pl.home.upcoming.warsztaty;
  const kursFacts = offers.kurs;
  const dataStartYear = parseYear(kursFacts.firstMeetingDate) ?? parseYear(kursFacts.seasonLabel);

  if (!dataStartYear) {
    throw new Error(`upcoming: kurs offer needs facts.seasonLabel or facts.firstMeetingDate`);
  }

  const seasonOver = today > `${dataStartYear + 1}-${COURSE_SEASON_END_MONTH_DAY}`;
  // Stale course data (season already finished): next season, no dates (N6 — never guess dates).
  const startYear = seasonOver ? dataStartYear + 1 : dataStartYear;
  const facts: OfferFacts = seasonOver
    ? { ...kursFacts, enrollmentOpens: undefined, enrollmentClose: undefined, firstMeetingDate: undefined }
    : kursFacts;
  const season = seasonLabel(startYear);

  const enrollmentWindow: Window = {
    start: enrollmentOpensFor(startYear, facts, startYear),
    end:
      facts.enrollmentClose ??
      (facts.firstMeetingDate
        ? addDays(facts.firstMeetingDate, -1)
        : `${startYear}-${ENROLLMENT_FALLBACK_CLOSE_MONTH_DAY}`),
  };

  const plener = resolvePlenerWindow(today, offers.plener, kursFacts, dataStartYear);
  const plenerActive = isWithin(today, plener.window);
  const enrollmentActive = isWithin(today, enrollmentWindow);

  // Overlap (VI–VII): the deadline that ends first wins.
  if (plenerActive && (!enrollmentActive || plener.window.end <= enrollmentWindow.end)) {
    return {
      state: plener.registrationClose ? "plener-deadline" : "plener",
      title: fill(strings.plener.title, { year: plener.year }),
      text: plener.registrationClose
        ? fill(strings.plener.textWithDeadline, { date: formatFullDate(plener.registrationClose) })
        : strings.plener.text,
      href: PLENER_ROUTE,
      linkLabel: strings.plener.linkLabel,
    };
  }

  if (enrollmentActive) {
    return {
      state: facts.enrollmentClose ? "enrollment-deadline" : "enrollment",
      title: fill(strings.enrollment.title, { season }),
      text: facts.enrollmentClose
        ? fill(strings.enrollment.textWithDeadline, { date: formatFullDate(facts.enrollmentClose) })
        : strings.enrollment.text,
      href: KURS_ROUTE,
      linkLabel: strings.enrollment.linkLabel,
    };
  }

  if (today < enrollmentWindow.start) {
    return {
      state: "running",
      title: fill(strings.running.title, { season: seasonLabel(startYear - 1) }),
      text: strings.running.text,
      href: KURS_ROUTE,
      linkLabel: strings.running.linkLabel,
    };
  }

  const firstMeeting = facts.firstMeetingDate;
  const beforeStart = firstMeeting
    ? today < firstMeeting
    : today <= `${startYear}-${ENROLLMENT_FALLBACK_CLOSE_MONTH_DAY}`;

  if (beforeStart) {
    return {
      state: firstMeeting ? "starts-date" : "starts",
      title: firstMeeting
        ? fill(strings.starts.titleWithDate, {
            date: formatDateRange(firstMeeting, undefined, { withYear: false }),
          })
        : strings.starts.title,
      text: fill(strings.starts.text, { season }),
      href: KURS_ROUTE,
      linkLabel: strings.starts.linkLabel,
    };
  }

  return {
    state: "running",
    title: fill(strings.running.title, { season }),
    text: strings.running.text,
    href: KURS_ROUTE,
    linkLabel: strings.running.linkLabel,
  };
}

// --- Wykłady (N5) ---

function lecturerName(slug: string): string | undefined {
  return getLecturer(slug)?.name ?? getLecturerDirectoryEntry(slug)?.name;
}

function buildLectureTitle(date: string, lecturerSlugs: string[]): string {
  const strings = pl.home.upcoming.wyklady.next;
  const dateLabel = formatLectureDate(date);
  const names = lecturerSlugs
    .filter((slug) => slug.trim().length > 0)
    .map(lecturerName)
    .filter((name): name is string => name !== undefined);

  if (names.length === 0) {
    return fill(strings.titleNoLecturers, { date: dateLabel });
  }

  // All lecturers of the evening — a single name would suggest a single talk (owner decision, 4.3).
  return fill(strings.title, { date: dateLabel, lecturers: names.join(", ") });
}

function resolveWyklady(today: string): SlotDefault {
  const strings = pl.home.upcoming.wyklady;
  const lectures = getAllSeasonLectures();
  // A lecture stays "upcoming" until the end of its day.
  const next = lectures.find(({ lecture }) => lecture.date >= today);

  if (next) {
    return {
      state: "next",
      title: buildLectureTitle(next.lecture.date, next.lecture.lecturerSlugs),
      text: strings.next.text,
      href: LECTURES_ROUTE,
      linkLabel: strings.next.linkLabel,
    };
  }

  const last = lectures[lectures.length - 1];
  if (!last) {
    throw new Error("upcoming: no lectures loaded");
  }

  const nextSeasonStartYear = Number(last.seasonSlug.split("-")[0]) + 1;

  return {
    state: "break",
    title: fill(strings.break.title, { season: seasonLabel(nextSeasonStartYear) }),
    text: fill(strings.break.text, { date: formatFullDate(last.lecture.date) }),
    href: LECTURES_ROUTE,
    linkLabel: strings.break.linkLabel,
  };
}

// --- Ikony (N4) ---

function resolveIkony(today: string): SlotDefault {
  const strings = pl.home.upcoming.ikony;
  const exhibition = getLatestAnnualExhibition();
  const vernissage = resolveAnnualVernissage(exhibition);
  const dateEnd = resolveAnnualDateEnd(exhibition);

  if (vernissage && today < vernissage && today >= addDays(vernissage, -VERNISSAGE_LEAD_DAYS)) {
    return {
      state: "vernissage",
      title: fill(strings.vernissage.title, { date: formatFullDate(vernissage) }),
      text: fill(strings.vernissage.text, { title: exhibition.title }),
      href: EXHIBITION_ROUTE,
      linkLabel: strings.vernissage.linkLabel,
    };
  }

  if (vernissage && dateEnd && vernissage <= today && today <= dateEnd) {
    return {
      state: "annual",
      title: fill(strings.annual.title, { title: exhibition.title }),
      text: fill(strings.annual.text, {
        date: formatDateRange(dateEnd, undefined, { withYear: false }),
      }),
      href: EXHIBITION_ROUTE,
      linkLabel: strings.annual.linkLabel,
    };
  }

  return {
    state: "permanent",
    title: fill(strings.permanent.title, { title: getPermanentExhibition().title }),
    text: strings.permanent.text,
    href: EXHIBITION_ROUTE,
    linkLabel: strings.permanent.linkLabel,
  };
}

const slotResolvers: Record<
  UpcomingSlot,
  (today: string, offers: UpcomingOfferFacts) => SlotDefault
> = {
  warsztaty: resolveWarsztaty,
  wyklady: resolveWyklady,
  ikony: resolveIkony,
};

/** Override active on `today` (inclusive `from`/`until`); validated as non-overlapping in settings.ts. */
function findActiveOverride(slot: UpcomingSlot, today: string) {
  return getSiteSettings().upcomingOverrides.find(
    (override) =>
      override.slot === slot &&
      (override.from === undefined || override.from <= today) &&
      today <= override.until,
  );
}

export function resolveUpcomingSlot(
  slot: UpcomingSlot,
  offers: UpcomingOfferFacts,
  now: Date = new Date(),
): UpcomingTile {
  const today = toWarsawIsoDate(now);
  const override = findActiveOverride(slot, today);

  // Manual override wins over the computed tile (N2).
  if (override) {
    return {
      slot,
      state: "override",
      source: "override",
      title: override.title,
      text: override.text,
      href: override.href,
      linkLabel: override.linkLabel,
    };
  }

  return {
    slot,
    source: "auto",
    ...withFreshNewsLink(slot, today, slotResolvers[slot](today, offers)),
  };
}

/** Always three tiles in `UPCOMING_SLOTS` order (N1). State is computed at build / revalidation time (N9). */
export function getUpcomingTiles(offers: UpcomingOfferFacts, now: Date = new Date()): UpcomingTile[] {
  return UPCOMING_SLOTS.map((slot) => resolveUpcomingSlot(slot, offers, now));
}
