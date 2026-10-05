import type { Offer, OfferFacts } from "@/content/types";
import { addDays } from "@/lib/isoDate";

/**
 * Enrollment windows of the workshop offers — the single source for the home „Najbliższe” tile
 * and the offer FactsBox (D5). Pure functions of offer facts and `today` (`YYYY-MM-DD`, Warsaw);
 * free of MDX imports so `scripts/` can load it through `tsx`.
 */

export type EnrollmentState = "open" | "closed";

/** Facts of both workshop offers — the plener window depends on the course window (N6). */
export type WorkshopOfferFacts = {
  kurs: OfferFacts;
  plener: OfferFacts;
};

export type DateWindow = { start: string; end: string };

/** Fallback start of the course enrollment window when `enrollmentOpens` is empty (N6: „od czerwca”). */
const ENROLLMENT_FALLBACK_OPENS_MONTH_DAY = "06-01";
/** Fallback end of the enrollment window when neither `enrollmentClose` nor `firstMeetingDate` is set. */
export const ENROLLMENT_FALLBACK_CLOSE_MONTH_DAY = "09-30";
/** Course runs October–June; after this day of the second season year the season is over. */
const COURSE_SEASON_END_MONTH_DAY = "06-30";
/** Letnia Szkoła Światła registration window opens in March (N6). */
const PLENER_REGISTRATION_OPENS_MONTH_DAY = "03-01";

export function isWithin(today: string, window: DateWindow): boolean {
  return window.start <= today && today <= window.end;
}

export function parseYear(value: string | undefined): number | undefined {
  const year = Number(value?.slice(0, 4));
  return Number.isInteger(year) && year > 0 ? year : undefined;
}

function enrollmentOpensFor(year: number, facts: OfferFacts, courseStartYear: number): string {
  const known = year === courseStartYear ? facts.enrollmentOpens : undefined;
  return known ?? `${year}-${ENROLLMENT_FALLBACK_OPENS_MONTH_DAY}`;
}

export type CourseEnrollment = {
  /** Start year of the season data refers to (from `firstMeetingDate` / `seasonLabel`). */
  dataStartYear: number;
  /** Season the window belongs to — next season once the data season is over. */
  startYear: number;
  /** Facts without dates when the data season is over (N6 — never guess dates). */
  facts: OfferFacts;
  window: DateWindow;
};

export function resolveCourseEnrollment(today: string, kursFacts: OfferFacts): CourseEnrollment {
  const dataStartYear = parseYear(kursFacts.firstMeetingDate) ?? parseYear(kursFacts.seasonLabel);

  if (!dataStartYear) {
    throw new Error(`enrollment: kurs offer needs facts.seasonLabel or facts.firstMeetingDate`);
  }

  const seasonOver = today > `${dataStartYear + 1}-${COURSE_SEASON_END_MONTH_DAY}`;
  const startYear = seasonOver ? dataStartYear + 1 : dataStartYear;
  const facts: OfferFacts = seasonOver
    ? { ...kursFacts, enrollmentOpens: undefined, enrollmentClose: undefined, firstMeetingDate: undefined }
    : kursFacts;

  return {
    dataStartYear,
    startYear,
    facts,
    window: {
      start: enrollmentOpensFor(startYear, facts, startYear),
      end:
        facts.enrollmentClose ??
        (facts.firstMeetingDate
          ? addDays(facts.firstMeetingDate, -1)
          : `${startYear}-${ENROLLMENT_FALLBACK_CLOSE_MONTH_DAY}`),
    },
  };
}

export type PlenerRegistration = {
  window: DateWindow;
  year: number;
  registrationClose?: string;
};

export function resolvePlenerRegistration(today: string, offers: WorkshopOfferFacts): PlenerRegistration {
  const { plener: plenerFacts, kurs: kursFacts } = offers;
  const courseStartYear = resolveCourseEnrollment(today, kursFacts).dataStartYear;
  const dataYear = parseYear(plenerFacts.dateStart) ?? parseYear(plenerFacts.seasonLabel);
  const todayYear = Number(today.slice(0, 4));
  // Stale data (last year's plener) falls back to the current year without dates.
  const year = Math.max(dataYear ?? todayYear, todayYear);
  const registrationClose = year === dataYear ? plenerFacts.registrationClose : undefined;

  // Without a known deadline the plener yields as soon as course enrollment opens.
  const end =
    registrationClose ?? addDays(enrollmentOpensFor(year, kursFacts, courseStartYear), -1);

  return {
    window: { start: `${year}-${PLENER_REGISTRATION_OPENS_MONTH_DAY}`, end },
    year,
    registrationClose,
  };
}

/**
 * Enrollment state shown on an offer (D5). Workshop offers follow their date window;
 * offers without one (lectures, orders) are closed by default. `enrollmentOpen: true`
 * forces „open” in every case; `false` never closes a window the dates keep open.
 */
export function resolveEnrollmentState(
  kind: Offer["kind"],
  facts: OfferFacts,
  workshops: WorkshopOfferFacts,
  today: string,
): EnrollmentState {
  if (facts.enrollmentOpen) {
    return "open";
  }

  if (kind === "kurs") {
    return isWithin(today, resolveCourseEnrollment(today, facts).window) ? "open" : "closed";
  }

  if (kind === "plener") {
    return isWithin(today, resolvePlenerRegistration(today, workshops).window) ? "open" : "closed";
  }

  return "closed";
}
