"use client";

import { Bar } from "react-chartjs-2";

import { pl } from "@/i18n/pl";
import { baseOptions, useChartPalette } from "@/lib/chartTheme";
import { formatNumber } from "@/lib/format";

type VisitsBarsProps = {
  labels: string[];
  titles: string[];
  current: number[];
  old: (number | null)[];
  showOld: boolean;
  ariaLabel: string;
};

// Canvas of the visits card: new site vs „Stara strona” (same period a year earlier) as side-by-side bars (plan 12b).
export function VisitsBars({ labels, titles, current, old, showOld, ariaLabel }: VisitsBarsProps) {
  const { palette, mobile } = useChartPalette();
  // Thickness cap keeps a 1–2 bar chart (7 days by week) from turning into blocks.
  const bars = { borderWidth: 0, borderRadius: 0, categoryPercentage: 0.8, barPercentage: 0.9, maxBarThickness: 56 };

  return (
    <div className="relative h-chart-visits min-w-0">
      {palette && (
        <Bar
          role="img"
          aria-label={ariaLabel}
          data={{
            labels,
            datasets: [
              { label: pl.analytics.visits.seriesNew, data: current, backgroundColor: palette.bar, ...bars },
              ...(showOld
                ? [{ label: pl.analytics.visits.seriesOld, data: old, backgroundColor: palette.old, ...bars }]
                : []),
            ],
          }}
          options={{
            ...baseOptions(palette),
            plugins: {
              ...baseOptions(palette).plugins,
              tooltip: {
                ...baseOptions(palette).plugins?.tooltip,
                callbacks: {
                  title: (items) => titles[items[0]?.dataIndex ?? 0] ?? "",
                  label: (item) => `${item.dataset.label}: ${formatNumber(Number(item.raw))}`,
                },
              },
            },
            scales: {
              x: {
                grid: { display: false },
                border: { color: palette.line },
                ticks: { color: palette.tertiary, font: palette.font, maxRotation: 0, autoSkip: true, maxTicksLimit: mobile ? 4 : 10 },
              },
              y: {
                beginAtZero: true,
                grid: { color: palette.line },
                border: { display: false },
                ticks: { color: palette.tertiary, font: palette.font, precision: 0, maxTicksLimit: 5 },
              },
            },
          }}
        />
      )}
    </div>
  );
}
