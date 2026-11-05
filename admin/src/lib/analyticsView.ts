// Server side of the Analytics tab: joins the new-site report with the old site's WP Statistics data
// (12b-1, admin/src/data/legacy-analytics.json) for every period, so the client switches periods
// without a request and the 600 KB legacy file never reaches the browser.

import legacyData from "@/data/legacy-analytics.json";
import {
  getAnalyticsSource,
  PERIODS,
  type AnalyticsReport,
  type CtaKey,
  type DeviceKey,
  type Period,
  type SourceKey,
} from "@/lib/analyticsSource";
import { addDays, todayInWarsaw, yearEarlier } from "@/lib/isoDate";

type LegacyAnalytics = {
  range: { from: string; to: string };
  daily: { date: string; views: number; visitors: number }[];
  pagesMonthly: { month: string; path: string; views: number }[];
};

export type ViewStatus = "ready" | "loading" | "empty" | "error";

/** Preview of card states in `npm run dev`: `/analityka?stan=ladowanie` etc. */
export type DevState = "ladowanie" | "brak" | "blad" | "bez-starej";
export const DEV_STATES: DevState[] = ["ladowanie", "brak", "blad", "bez-starej"];

export type DayPoint = {
  date: string;
  views: number;
  visitors: number;
  oldViews: number | null;
  oldVisitors: number | null;
};

export type PeriodView = {
  period: Period;
  from: string;
  to: string;
  generatedAt: string;
  status: ViewStatus;
  errorCode: string | null;
  days: DayPoint[];
  oldCoverage: "full" | "partial" | "none";
  topPages: { path: string; title: string; views: number; oldViews: number | null }[];
  /** Whole months (YYYY-MM) of old page data behind `oldViews`; null when there is none. */
  oldPagesMonths: { from: string; to: string } | null;
  sources: { key: SourceKey; visitors: number }[];
  devices: { key: DeviceKey; visitors: number }[];
  cta: { key: CtaKey; clicks: number }[];
};

const legacy = legacyData as LegacyAnalytics;
const legacyDaily = new Map(legacy.daily.map((day) => [day.date, day]));
const legacyPages = legacy.pagesMonthly.reduce((byPath, row) => {
  const months = byPath.get(row.path) ?? new Map<string, number>();
  months.set(row.month, row.views);
  return byPath.set(row.path, months);
}, new Map<string, Map<string, number>>());
const legacyMonths = { from: legacy.range.from.slice(0, 7), to: legacy.range.to.slice(0, 7) };

function monthsBetween(from: string, to: string): string[] {
  const [fy, fm] = from.split("-").map(Number);
  const [ty, tm] = to.split("-").map(Number);
  const count = (ty - fy) * 12 + (tm - fm) + 1;
  return Array.from({ length: Math.max(0, count) }, (_, i) => {
    const index = fm - 1 + i;
    return `${fy + Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, "0")}`;
  });
}

/** A year back; 29 February falls back to the 28th so a period always has a start and an end. */
function yearBack(date: string): string {
  return yearEarlier(date) ?? `${Number(date.slice(0, 4)) - 1}-02-28`;
}

function withLegacy(period: Period, end: string, report: AnalyticsReport, dropOld: boolean): PeriodView {
  const days = report.daily.map((day): DayPoint => {
    const old = dropOld ? undefined : legacyDaily.get(yearEarlier(day.date) ?? "");
    return { ...day, oldViews: old?.views ?? null, oldVisitors: old?.visitors ?? null };
  });
  const withOld = days.filter((day) => day.oldViews !== null).length;
  const from = addDays(end, 1 - period);
  const to = end;

  const months = dropOld
    ? []
    : monthsBetween(yearBack(from).slice(0, 7), yearBack(to).slice(0, 7)).filter(
        (month) => month >= legacyMonths.from && month <= legacyMonths.to,
      );
  const oldPagesMonths = months.length ? { from: months[0], to: months[months.length - 1] } : null;

  return {
    period,
    from,
    to,
    generatedAt: report.generatedAt,
    status: days.length ? "ready" : "empty",
    errorCode: null,
    days,
    oldCoverage: withOld === 0 ? "none" : withOld === days.length ? "full" : "partial",
    topPages: report.topPages.map((page) => ({
      ...page,
      oldViews: oldPagesMonths
        ? months.reduce((sum, month) => sum + (legacyPages.get(page.path)?.get(month) ?? 0), 0)
        : null,
    })),
    oldPagesMonths,
    sources: report.sources,
    devices: report.devices,
    cta: report.cta,
  };
}

function emptyReport(report: AnalyticsReport): AnalyticsReport {
  return { ...report, daily: [], topPages: [], sources: [], devices: [], cta: [] };
}

export async function getPeriodViews(devState?: DevState): Promise<PeriodView[]> {
  // Yesterday: today's numbers are still coming in.
  const end = addDays(todayInWarsaw(), -1);
  const source = getAnalyticsSource();
  const reports = await Promise.all(PERIODS.map((period) => source.getReport(period, end)));

  return reports.map((report, index) => {
    const view = withLegacy(
      PERIODS[index],
      end,
      devState === "brak" ? emptyReport(report) : report,
      devState === "bez-starej",
    );
    if (devState === "ladowanie") return { ...view, status: "loading" };
    if (devState === "blad") return { ...view, status: "error", errorCode: "posthog_timeout" };
    return view;
  });
}
