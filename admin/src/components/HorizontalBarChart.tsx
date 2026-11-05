"use client";

import { Bar } from "react-chartjs-2";

import { baseOptions, useChartPalette } from "@/lib/chartTheme";
import { formatNumber } from "@/lib/format";

type HorizontalBarChartProps = {
  labels: (string | string[])[];
  values: number[];
  ariaLabel: string;
  /** Height token class of the chart box. */
  heightClassName: string;
};

// Horizontal bars shared by Sources, Devices and CTA cards (mockup `hbar`).
export function HorizontalBarChart({ labels, values, ariaLabel, heightClassName }: HorizontalBarChartProps) {
  const { palette } = useChartPalette();

  return (
    <div className={`relative min-w-0 ${heightClassName}`}>
      {palette && (
        <Bar
          role="img"
          aria-label={ariaLabel}
          data={{
            labels,
            datasets: [
              {
                data: values,
                backgroundColor: palette.bar,
                borderWidth: 0,
                borderRadius: 0,
                barPercentage: 0.7,
                categoryPercentage: 0.9,
              },
            ],
          }}
          options={{
            ...baseOptions(palette),
            indexAxis: "y",
            plugins: {
              ...baseOptions(palette).plugins,
              tooltip: {
                ...baseOptions(palette).plugins?.tooltip,
                callbacks: { label: (item) => formatNumber(Number(item.raw)) },
              },
            },
            scales: {
              x: {
                beginAtZero: true,
                grid: { color: palette.line },
                border: { display: false },
                ticks: { color: palette.tertiary, font: palette.font, precision: 0, maxTicksLimit: 5 },
              },
              y: {
                grid: { display: false },
                border: { color: palette.line },
                ticks: { color: palette.text, font: palette.font, autoSkip: false },
              },
            },
          }}
        />
      )}
    </div>
  );
}
