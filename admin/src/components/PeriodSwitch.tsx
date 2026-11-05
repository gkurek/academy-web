"use client";

import { SegmentedControl } from "@/components/SegmentedControl";
import { pl } from "@/i18n/pl";
import type { Period } from "@/lib/analyticsSource";

type PeriodSwitchProps = {
  value: Period;
  onChange: (period: Period) => void;
};

const OPTIONS: { value: Period; label: string }[] = [
  { value: 7, label: pl.analytics.period.days7 },
  { value: 30, label: pl.analytics.period.days30 },
  { value: 90, label: pl.analytics.period.days90 },
  { value: 365, label: pl.analytics.period.year },
];

// Period for the whole page (above the cards).
export function PeriodSwitch({ value, onChange }: PeriodSwitchProps) {
  return <SegmentedControl label={pl.analytics.period.label} options={OPTIONS} value={value} onChange={onChange} />;
}
