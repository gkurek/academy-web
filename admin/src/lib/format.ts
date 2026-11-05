import type { Aggregation } from "@/lib/analyticsSource";
import type { Bucket } from "@/lib/aggregate";

const LOCALE = "pl-PL";

const number = new Intl.NumberFormat(LOCALE);
const percent = new Intl.NumberFormat(LOCALE, { style: "percent", maximumFractionDigits: 0 });
// ISO dates are calendar days: format them in UTC so no time zone shifts the day.
const dayShort = new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "short", timeZone: "UTC" });
const dayMonth = new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "long", timeZone: "UTC" });
const dayLong = new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const monthShort = new Intl.DateTimeFormat(LOCALE, { month: "short", year: "numeric", timeZone: "UTC" });
const monthLong = new Intl.DateTimeFormat(LOCALE, { month: "long", year: "numeric", timeZone: "UTC" });
const warsawDay = new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "long", timeZone: "Europe/Warsaw" });
const warsawTime = new Intl.DateTimeFormat(LOCALE, { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" });

const utc = (date: string) => new Date(`${date}T00:00:00Z`);
const monthStart = (month: string) => utc(`${month}-01`);

export const formatNumber = (value: number) => number.format(value);
export const formatPercent = (share: number) => percent.format(share);

/** „6 października – 4 listopada 2026”, with both years when they differ. */
export function formatRange(from: string, to: string): string {
  const sameYear = from.slice(0, 4) === to.slice(0, 4);
  return `${(sameYear ? dayMonth : dayLong).format(utc(from))} – ${dayLong.format(utc(to))}`;
}

const monthName = new Intl.DateTimeFormat(LOCALE, { month: "long", timeZone: "UTC" });

/** „listopad 2024 – październik 2025”, „październik – listopad 2025”, or one month. */
export function formatMonthRange(from: string, to: string): string {
  const last = monthLong.format(monthStart(to));
  if (from === to) return last;
  const sameYear = from.slice(0, 4) === to.slice(0, 4);
  return `${(sameYear ? monthName : monthLong).format(monthStart(from))} – ${last}`;
}

/** Data timestamp: date and time in Warsaw. */
export function formatAsOf(iso: string): { date: string; time: string } {
  const at = new Date(iso);
  return { date: warsawDay.format(at), time: warsawTime.format(at) };
}

export function formatTime(iso: string): string {
  return warsawTime.format(new Date(iso));
}

/** Axis label of a bar. */
export function bucketLabel(bucket: Bucket, aggregation: Aggregation): string {
  return aggregation === "month" ? monthShort.format(utc(bucket.start)) : dayShort.format(utc(bucket.start));
}

/** Tooltip and data-table label of a bar. */
export function bucketTitle(bucket: Bucket, aggregation: Aggregation): string {
  if (aggregation === "day") return dayLong.format(utc(bucket.start));
  if (aggregation === "month") return monthLong.format(utc(bucket.start));
  return `${dayShort.format(utc(bucket.start))} – ${dayShort.format(utc(bucket.end))}`;
}
