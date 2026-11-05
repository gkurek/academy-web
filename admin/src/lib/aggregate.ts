import type { Aggregation, Metric } from "@/lib/analyticsSource";
import type { DayPoint } from "@/lib/analyticsView";

export type Bucket = { start: string; end: string; current: number; old: number | null };

function toBucket(days: DayPoint[], metric: Metric): Bucket {
  const olds = days
    .map((day) => (metric === "views" ? day.oldViews : day.oldVisitors))
    .filter((value): value is number => value !== null);
  return {
    start: days[0].date,
    end: days[days.length - 1].date,
    current: days.reduce((sum, day) => sum + (metric === "views" ? day.views : day.visitors), 0),
    // A bucket without any old day shows no old bar (not a zero).
    old: olds.length ? olds.reduce((sum, value) => sum + value, 0) : null,
  };
}

/**
 * Bars for the visits chart. Week = 7 days counted back from the last day (the first one may be shorter);
 * month = calendar month (edge months may be partial). Visitors are summed daily uniques (K-07).
 */
export function aggregate(days: DayPoint[], aggregation: Aggregation, metric: Metric): Bucket[] {
  if (!days.length) return [];
  if (aggregation === "day") return days.map((day) => toBucket([day], metric));

  if (aggregation === "week") {
    const count = Math.ceil(days.length / 7);
    return Array.from({ length: count }, (_, i) =>
      toBucket(days.slice(Math.max(0, days.length - (count - i) * 7), days.length - (count - i - 1) * 7), metric),
    );
  }

  const months = days.reduce((groups, day) => {
    const key = day.date.slice(0, 7);
    return groups.set(key, [...(groups.get(key) ?? []), day]);
  }, new Map<string, DayPoint[]>());
  return [...months.values()].map((group) => toBucket(group, metric));
}
