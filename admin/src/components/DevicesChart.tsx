"use client";

import { ChartCard } from "@/components/ChartCard";
import { HorizontalBarChart } from "@/components/HorizontalBarChart";
import { pl } from "@/i18n/pl";
import type { PeriodView } from "@/lib/analyticsView";
import { toBreakdown } from "@/lib/breakdown";
import { useChartPalette } from "@/lib/chartTheme";

type DevicesChartProps = { view: PeriodView };

export function DevicesChart({ view }: DevicesChartProps) {
  const { devices } = pl.analytics;
  const { mobile } = useChartPalette();
  const data = toBreakdown(
    devices.title,
    view.devices.map((item) => ({ label: devices[item.key], value: item.visitors })),
    true,
    mobile,
  );

  return (
    <ChartCard
      title={devices.title}
      status={view.status}
      errorCode={view.errorCode}
      generatedAt={view.generatedAt}
      placeholderClassName="h-chart-devices"
      table={data.table}
    >
      <HorizontalBarChart
        labels={data.labels}
        values={data.values}
        ariaLabel={data.ariaLabel}
        heightClassName="h-chart-devices"
      />
    </ChartCard>
  );
}
