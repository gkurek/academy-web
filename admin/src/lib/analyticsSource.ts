import { sampleAnalyticsSource } from "@/data/analytics-sample";

// Data contract of the Analytics tab. 12b-2 serves sample data; 12b-3 swaps the source for HogQL
// queries (K-168) without touching the components.

export const PERIODS = [7, 30, 90, 365] as const;
export type Period = (typeof PERIODS)[number];

export type Aggregation = "day" | "week" | "month";
export type Metric = "views" | "visitors";

export type SourceKey = "search" | "direct" | "social" | "referral";
export type DeviceKey = "desktop" | "mobile" | "tablet";
/** `enroll_click` per offer, `email_click`, `phone_click` (brief §7, K-15). */
export type CtaKey = "course" | "summer" | "lectures" | "email" | "phone";

/** One calendar day (ISO, Europe/Warsaw): `$pageview` count and daily-unique visitors. */
export type DailyCount = { date: string; views: number; visitors: number };

export type AnalyticsReport = {
  /** ISO timestamp of the data. */
  generatedAt: string;
  /** Every day of the period, oldest first. */
  daily: DailyCount[];
  topPages: { path: string; title: string; views: number }[];
  sources: { key: SourceKey; visitors: number }[];
  devices: { key: DeviceKey; visitors: number }[];
  cta: { key: CtaKey; clicks: number }[];
};

export type AnalyticsSource = {
  /** Report for `period` days ending on `end` (ISO date, inclusive). */
  getReport(period: Period, end: string): Promise<AnalyticsReport>;
};

/** Shown next to the date range while true; goes away with the sample file in 12b-3. */
export const USING_SAMPLE_DATA = true;

export function getAnalyticsSource(): AnalyticsSource {
  return sampleAnalyticsSource;
}
