import settingsData from "../../content/settings.json";
import type { SiteSettings, UpcomingOverride } from "@/content/types";

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parseIsoDateOnly(value: string, context: string): number {
  if (!ISO_DATE_RE.test(value)) {
    throw new Error(`${context}: expected ISO date YYYY-MM-DD, got "${value}"`);
  }

  const [year, month, day] = value.split("-").map((part) => Number(part));
  const utc = Date.UTC(year, month - 1, day);
  const parsed = new Date(utc);

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new Error(`${context}: invalid calendar date "${value}"`);
  }

  return utc;
}

function overrideInterval(override: UpcomingOverride): { start: number; end: number } {
  const context = `settings.json upcomingOverrides (slot "${override.slot}")`;
  const end = parseIsoDateOnly(override.until, `${context}.until`);

  if (override.from !== undefined) {
    const start = parseIsoDateOnly(override.from, `${context}.from`);
    if (start > end) {
      throw new Error(`${context}: from (${override.from}) must not be after until (${override.until})`);
    }
    return { start, end };
  }

  return { start: Number.NEGATIVE_INFINITY, end };
}

function intervalsOverlap(a: { start: number; end: number }, b: { start: number; end: number }): boolean {
  return a.start <= b.end && b.start <= a.end;
}

function validateUpcomingOverrides(overrides: UpcomingOverride[]): void {
  overrides.forEach((override, index) => {
    if (!override.until?.trim()) {
      throw new Error(`settings.json upcomingOverrides[${index}]: missing until`);
    }

    overrideInterval(override);
  });

  const bySlot = new Map<UpcomingOverride["slot"], { override: UpcomingOverride; interval: { start: number; end: number } }[]>();

  overrides.forEach((override) => {
    const interval = overrideInterval(override);
    const existing = bySlot.get(override.slot) ?? [];
    existing.forEach((other) => {
      if (intervalsOverlap(interval, other.interval)) {
        throw new Error(
          `settings.json upcomingOverrides: overlapping active ranges for slot "${override.slot}"`,
        );
      }
    });
    bySlot.set(override.slot, [...existing, { override, interval }]);
  });
}

const siteSettings = settingsData as SiteSettings;

validateUpcomingOverrides(siteSettings.upcomingOverrides ?? []);

export function getSiteSettings(): SiteSettings {
  return siteSettings;
}
