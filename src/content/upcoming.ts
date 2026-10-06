import {
  getLatestAnnualExhibition,
  getPermanentExhibition,
  resolveAnnualDateEnd,
  resolveAnnualVernissage,
} from "@/content/exhibition";
import { resolveLecturer } from "@/content/lecturers";
import { formatLectureDate, getAllSeasonLectures } from "@/content/lectures";
import { newsManifestEntries } from "@/content/news-manifest";
import type { NewsFrontmatter } from "@/content/news";
import { getSiteSettings } from "@/content/settings";
import {
  ENROLLMENT_FALLBACK_CLOSE_MONTH_DAY,
  isWithin,
  resolveCourseEnrollment,
  resolvePlenerRegistration,
  type WorkshopOfferFacts,
} from "@/content/enrollment";
import type { NewsKind, UpcomingSlot } from "@/content/types";
import { fillTemplate as fill } from "@/lib/fillTemplate";
import { formatDateRange } from "@/lib/formatDateRange";
import { addDays, todayInWarsaw } from "@/lib/isoDate";
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

const KURS_ROUTE = "/warsztaty/kurs-roczny-i-trzyletni";
const PLENER_ROUTE = "/warsztaty/letnia-szkola-swiatla";
const LECTURES_ROUTE = "/wyklady";
const EXHIBITION_ROUTE = "/ikony/wystawy";

type UpcomingSource = "auto" | "override";

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
export type UpcomingOfferFacts = WorkshopOfferFacts;

function formatFullDate(isoDate: string): string {
  return formatDateRange(isoDate, undefined, { withYear: true });
}

function seasonLabel(startYear: number): string {
  return `${startYear}/${startYear + 1}`;
}

/** Newest news entry of the slot's kinds dated no more than FRESH_NEWS_DAYS ago (future dates count). */
function findFreshNews(slot: UpcomingSlot, today: string): NewsFrontmatter | undefined {
  const oldestFresh = addDays(today, -FRESH_NEWS_DAYS);
  const kinds = SLOT_NEWS_KINDS[slot];

  // The manifest is newest first.
  return newsManifestEntries.find((entry) => kinds.includes(entry.kind) && entry.date >= oldestFresh);
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

function resolveWarsztaty(today: string, offers: UpcomingOfferFacts): SlotDefault {
  const strings = pl.home.upcoming.warsztaty;
  const { startYear, facts, window: enrollmentWindow } = resolveCourseEnrollment(today, offers.kurs);
  const season = seasonLabel(startYear);

  const plener = resolvePlenerRegistration(today, offers);
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

function buildLectureTitle(date: string, lecturerSlugs: string[]): string {
  const strings = pl.home.upcoming.wyklady.next;
  const dateLabel = formatLectureDate(date);
  const names = lecturerSlugs
    .filter((slug) => slug.trim().length > 0)
    .map((slug) => resolveLecturer(slug).name);

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

function resolveUpcomingSlot(
  slot: UpcomingSlot,
  offers: UpcomingOfferFacts,
  today: string = todayInWarsaw(),
): UpcomingTile {
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
export function getUpcomingTiles(
  offers: UpcomingOfferFacts,
  today: string = todayInWarsaw(),
): UpcomingTile[] {
  return UPCOMING_SLOTS.map((slot) => resolveUpcomingSlot(slot, offers, today));
}
