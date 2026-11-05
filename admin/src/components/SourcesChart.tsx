"use client";

import { ChartCard } from "@/components/ChartCard";
import { HorizontalBarChart } from "@/components/HorizontalBarChart";
import { pl } from "@/i18n/pl";
import type { PeriodView } from "@/lib/analyticsView";
import { toBreakdown } from "@/lib/breakdown";
import { useChartPalette } from "@/lib/chartTheme";

type SourcesChartProps = { view: PeriodView };

export function SourcesChart({ view }: SourcesChartProps) {
  const { sources } = pl.analytics;
  const { mobile } = useChartPalette();
  const data = toBreakdown(
    sources.title,
    view.sources.map((item) => ({ label: sources[item.key], value: item.visitors })),
    true,
    mobile,
  );

  return (
    <ChartCard
      title={sources.title}
      status={view.status}
      errorCode={view.errorCode}
      generatedAt={view.generatedAt}
      placeholderClassName="h-chart-sources"
      table={data.table}
    >
      <HorizontalBarChart
        labels={data.labels}
        values={data.values}
        ariaLabel={data.ariaLabel}
        heightClassName="h-chart-sources"
      />
    </ChartCard>
  );
}
