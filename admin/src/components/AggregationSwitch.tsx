"use client";

import { SegmentedControl } from "@/components/SegmentedControl";
import { pl } from "@/i18n/pl";
import type { Aggregation } from "@/lib/analyticsSource";

type AggregationSwitchProps = {
  value: Aggregation;
  onChange: (aggregation: Aggregation) => void;
};

const OPTIONS: { value: Aggregation; label: string }[] = [
  { value: "day", label: pl.analytics.aggregation.day },
  { value: "week", label: pl.analytics.aggregation.week },
  { value: "month", label: pl.analytics.aggregation.month },
];

// „Jeden słupek to” — only in the visits card; every period × aggregation pair is allowed (plan 12b).
export function AggregationSwitch({ value, onChange }: AggregationSwitchProps) {
  return (
    <SegmentedControl label={pl.analytics.aggregation.label} options={OPTIONS} value={value} onChange={onChange} />
  );
}
