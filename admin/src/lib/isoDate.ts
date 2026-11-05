const DAY_MS = 86_400_000;

function toUtc(date: string): number {
  return Date.parse(`${date}T00:00:00Z`);
}

export function fromUtc(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/** Today's calendar date in Warsaw (the site's time zone), as ISO. */
export function todayInWarsaw(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(now);
}

export function addDays(date: string, days: number): string {
  return fromUtc(toUtc(date) + days * DAY_MS);
}

/** `count` consecutive dates ending on `end`, oldest first. */
export function daysEndingOn(end: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => addDays(end, i - count + 1));
}

/** Same calendar day a year earlier; 29 February has none. */
export function yearEarlier(date: string): string | undefined {
  const [year, rest] = [Number(date.slice(0, 4)), date.slice(4)];
  return rest === "-02-29" ? undefined : `${year - 1}${rest}`;
}

/** Day number since the epoch — a stable seed for sample data. */
export function epochDay(date: string): number {
  return Math.round(toUtc(date) / DAY_MS);
}
