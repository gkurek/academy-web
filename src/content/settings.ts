import settingsData from "../../content/settings.json";
import type { SiteSettings, UpcomingOverride } from "@/content/types";
import { assertIsoDate } from "@/lib/isoDate";

type DateInterval = { start: string; end: string };

/** Open start sorts before every ISO date. */
const OPEN_START = "";

function overrideInterval(override: UpcomingOverride): DateInterval {
  const context = `settings.json upcomingOverrides (slot "${override.slot}")`;
  assertIsoDate(override.until, `${context}.until`);

  if (override.from !== undefined) {
    assertIsoDate(override.from, `${context}.from`);
    if (override.from > override.until) {
      throw new Error(`${context}: from (${override.from}) must not be after until (${override.until})`);
    }
    return { start: override.from, end: override.until };
  }

  return { start: OPEN_START, end: override.until };
}

function intervalsOverlap(a: DateInterval, b: DateInterval): boolean {
  return a.start <= b.end && b.start <= a.end;
}

function validateUpcomingOverrides(overrides: UpcomingOverride[]): void {
  overrides.forEach((override, index) => {
    if (!override.until?.trim()) {
      throw new Error(`settings.json upcomingOverrides[${index}]: missing until`);
    }

    overrideInterval(override);
  });

  const bySlot = new Map<UpcomingOverride["slot"], { override: UpcomingOverride; interval: DateInterval }[]>();

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
