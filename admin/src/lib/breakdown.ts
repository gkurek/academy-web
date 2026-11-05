import type { DataTable } from "@/components/ChartCard";
import { pl } from "@/i18n/pl";
import { formatNumber, formatPercent } from "@/lib/format";

export type BreakdownItem = { label: string; value: number };

export type Breakdown = {
  /** A string, or lines of one label (phones: Chart.js cuts long axis labels instead of wrapping). */
  labels: (string | string[])[];
  values: number[];
  ariaLabel: string;
  table: DataTable;
};

const WRAP_CHARS = 14;

/** Greedy word wrap to lines of about WRAP_CHARS characters. */
function wrapWords(text: string): string[] {
  return text.split(" ").reduce<string[]>((lines, word) => {
    const last = lines[lines.length - 1];
    if (last !== undefined && `${last} ${word}`.length <= WRAP_CHARS) {
      return [...lines.slice(0, -1), `${last} ${word}`];
    }
    return [...lines, word];
  }, []);
}

/**
 * Chart labels, accessible summary and data table of a horizontal-bar card; `withShare` adds „· 52%”.
 * `wrap` (phones) splits the name into lines and puts the share on a line of its own.
 */
export function toBreakdown(title: string, items: BreakdownItem[], withShare: boolean, wrap = false): Breakdown {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const share = (value: number) => formatPercent(total ? value / total : 0);
  const labelOf = (item: BreakdownItem) => (withShare ? `${item.label} · ${share(item.value)}` : item.label);
  const summary = items
    .map((item) => `${item.label} ${withShare ? share(item.value) : formatNumber(item.value)}`)
    .join(", ");

  return {
    labels: items.map((item) =>
      wrap ? [...wrapWords(item.label), ...(withShare ? [share(item.value)] : [])] : labelOf(item),
    ),
    values: items.map((item) => item.value),
    ariaLabel: pl.analytics.breakdownAria(title, summary),
    table: {
      caption: title,
      columns: [pl.analytics.tableColumnItem, pl.analytics.tableColumnValue],
      rows: items.map((item) => [labelOf(item), formatNumber(item.value)]),
    },
  };
}
