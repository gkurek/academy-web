"use client";

import { BarElement, CategoryScale, Chart, LinearScale, Tooltip, type ChartOptions } from "chart.js";
import { useMemo, useSyncExternalStore } from "react";

import { readTheme, subscribeTheme, type Theme } from "@/lib/theme";

// Only what the panel's bar charts use, so the rest of Chart.js stays out of the bundle.
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip);

const MOBILE_QUERY = "(max-width: 699.98px)";

export type ChartPalette = {
  bar: string;
  old: string;
  heading: string;
  text: string;
  tertiary: string;
  line: string;
  card: string;
  border: string;
  font: { family: string; size: number };
};

function subscribeMobile(listener: () => void): () => void {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}

function readPalette(mobile: boolean): ChartPalette {
  const root = getComputedStyle(document.documentElement);
  const token = (name: string) => root.getPropertyValue(`--admin-${name}`).trim();
  return {
    bar: token("bar"),
    old: token("old"),
    heading: token("h"),
    text: token("tx"),
    tertiary: token("ter"),
    line: token("ln"),
    card: token("card"),
    border: token("fb"),
    // Mockup: 15 px on phones, 14 px on desktop (13 px is banned).
    font: { family: getComputedStyle(document.body).fontFamily, size: mobile ? 15 : 14 },
  };
}

/**
 * Canvas cannot read CSS variables, so the palette is resolved from the active `--admin-*` tokens
 * and recomputed when the theme switch flips `data-theme`. Null on the server (charts render client-side).
 */
export function useChartPalette(): { palette: ChartPalette | null; mobile: boolean } {
  const theme = useSyncExternalStore<Theme | null>(subscribeTheme, readTheme, () => null);
  const mobile = useSyncExternalStore(
    subscribeMobile,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
  const palette = useMemo(() => (theme ? readPalette(mobile) : null), [theme, mobile]);
  return { palette, mobile };
}

/** Shared bar-chart options: no animation, no legend (HTML legend instead), square tooltip, no shadows. */
export function baseOptions(palette: ChartPalette): ChartOptions<"bar"> {
  return {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: palette.card,
        titleColor: palette.heading,
        bodyColor: palette.text,
        borderColor: palette.border,
        borderWidth: 1,
        cornerRadius: 0,
        caretSize: 0,
        padding: 12,
        boxPadding: 6,
        titleFont: { ...palette.font, weight: 500 },
        bodyFont: palette.font,
      },
    },
  };
}
