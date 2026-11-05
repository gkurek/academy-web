// SAMPLE (plan 12 § Dane sample, T33): made-up new-site numbers until PostHog is wired in 12b-3,
// where this file is deleted. Deterministic — the same day always gets the same numbers.

import type { AnalyticsReport, AnalyticsSource, CtaKey, DeviceKey, Period, SourceKey } from "@/lib/analyticsSource";
import { daysEndingOn, epochDay } from "@/lib/isoDate";

/** mulberry32: small seeded PRNG, enough for stable sample noise. */
function random(seed: number): number {
  const a = (seed + 0x6d2b79f5) | 0;
  const b = Math.imul(a ^ (a >>> 15), 1 | a);
  const c = (b + Math.imul(b ^ (b >>> 7), 61 | b)) ^ b;
  return ((c ^ (c >>> 14)) >>> 0) / 4294967296;
}

function sampleDay(date: string) {
  const day = epochDay(date);
  const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
  const weekend = weekday === 0 || weekday === 6;
  const base = 70 + 40 * Math.sin(day / 58) + (weekend ? -25 : 15);
  // A one-off spike, as after a newsletter or a post on social media.
  const spike = day % 97 === 0 ? 190 : day % 97 === 1 ? 90 : 0;
  const views = Math.max(18, Math.round(base + random(day) * 50 + spike));
  const visitors = Math.round(views * (0.55 + random(day + 50_000) * 0.1));
  return { date, views, visitors };
}

const PAGES: { path: string; title: string; share: number }[] = [
  { path: "/", title: "Strona główna", share: 1 },
  { path: "/warsztaty/kurs-roczny-i-trzyletni", title: "Kurs roczny i trzyletni", share: 0.62 },
  { path: "/warsztaty/letnia-szkola-swiatla", title: "Letnia Szkoła Światła", share: 0.41 },
  { path: "/wyklady", title: "Wykłady", share: 0.38 },
  { path: "/ikony", title: "Ikony", share: 0.33 },
  { path: "/wyklady/wykladowcy", title: "Wykładowcy", share: 0.29 },
  { path: "/kontakt", title: "Kontakt", share: 0.22 },
  { path: "/aktualnosci", title: "Aktualności", share: 0.17 },
];

const SOURCES: [SourceKey, number][] = [
  ["search", 0.52],
  ["direct", 0.27],
  ["social", 0.13],
  ["referral", 0.08],
];

const DEVICES: [DeviceKey, number][] = [
  ["mobile", 0.49],
  ["desktop", 0.46],
  ["tablet", 0.05],
];

/** Clicks per 30 days. */
const CTA: [CtaKey, number][] = [
  ["course", 34],
  ["lectures", 21],
  ["email", 18],
  ["summer", 12],
  ["phone", 9],
];

export const sampleAnalyticsSource: AnalyticsSource = {
  async getReport(period: Period, end: string): Promise<AnalyticsReport> {
    const daily = daysEndingOn(end, period).map(sampleDay);
    const views = daily.reduce((sum, day) => sum + day.views, 0);
    const visitors = daily.reduce((sum, day) => sum + day.visitors, 0);
    const topViews = views * 0.31;

    return {
      generatedAt: new Date().toISOString(),
      daily,
      topPages: PAGES.map(({ path, title, share }) => ({ path, title, views: Math.round(topViews * share) })),
      sources: SOURCES.map(([key, share]) => ({ key, visitors: Math.round(visitors * share) })),
      devices: DEVICES.map(([key, share]) => ({ key, visitors: Math.round(visitors * share) })),
      cta: CTA.map(([key, per30]) => ({ key, clicks: Math.round((per30 * period) / 30) })),
    };
  },
};
