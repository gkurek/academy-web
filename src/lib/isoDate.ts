/**
 * Calendar dates as `YYYY-MM-DD` strings. State logic compares these strings directly
 * (lexicographic order = chronological order) — no `Date` objects, so the host time zone never matters.
 */

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const warsawDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Warsaw",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Throws when `value` is not a real calendar date in `YYYY-MM-DD` form. */
export function assertIsoDate(value: string, context: string): void {
  if (!ISO_DATE_RE.test(value)) {
    throw new Error(`${context}: expected ISO date YYYY-MM-DD, got "${value}"`);
  }

  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new Error(`${context}: invalid calendar date "${value}"`);
  }
}

/** `isoDate` shifted by `days` (negative = back), as `YYYY-MM-DD`. */
export function addDays(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

/** Calendar day in Warsaw as `YYYY-MM-DD` — build hosts may run in UTC. */
export function todayInWarsaw(now: Date = new Date()): string {
  return warsawDateFormatter.format(now);
}

/** Calendar year in Warsaw (footer copyright). */
export function currentYearInWarsaw(now: Date = new Date()): number {
  return Number(todayInWarsaw(now).slice(0, 4));
}
