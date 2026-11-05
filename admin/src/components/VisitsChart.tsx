"use client";

import { AggregationSwitch } from "@/components/AggregationSwitch";
import { ChartCard } from "@/components/ChartCard";
import { SegmentedControl } from "@/components/SegmentedControl";
import { VisitsBars } from "@/components/VisitsBars";
import { pl } from "@/i18n/pl";
import { aggregate } from "@/lib/aggregate";
import type { Aggregation, Metric } from "@/lib/analyticsSource";
import type { PeriodView } from "@/lib/analyticsView";
import { bucketLabel, bucketTitle, formatNumber } from "@/lib/format";

type VisitsChartProps = {
  view: PeriodView;
  rangeLabel: string;
  aggregation: Aggregation;
  metric: Metric;
  onAggregationChange: (aggregation: Aggregation) => void;
  onMetricChange: (metric: Metric) => void;
};

// Visits card (README-panel §5 `VisitsChart`): metric and bar-size switches, totals, legend,
// the old-site note, bars. Without old data the note says so and the old series is left out.
export function VisitsChart({
  view,
  rangeLabel,
  aggregation,
  metric,
  onAggregationChange,
  onMetricChange,
}: VisitsChartProps) {
  const { visits, metric: metricLabels, card, tableColumnValue } = pl.analytics;
  const buckets = aggregate(view.days, aggregation, metric);
  const titles = buckets.map((bucket) => bucketTitle(bucket, aggregation));
  const showOld = view.oldCoverage !== "none";
  const metricName = metric === "views" ? metricLabels.views : metricLabels.visitors;
  const totals = view.days.reduce(
    (sum, day) => ({ views: sum.views + day.views, visitors: sum.visitors + day.visitors }),
    { views: 0, visitors: 0 },
  );
  const oldNote =
    view.oldCoverage === "none" ? visits.oldNoteNone : view.oldCoverage === "partial" ? visits.oldNotePartial : null;

  const controls = (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
        <SegmentedControl
          label={metricLabels.label}
          options={[
            { value: "views", label: metricLabels.views },
            { value: "visitors", label: metricLabels.visitors },
          ]}
          value={metric}
          onChange={onMetricChange}
        />
        <AggregationSwitch value={aggregation} onChange={onAggregationChange} />
      </div>
      <p className="m-0 max-w-note text-small leading-note text-tertiary">{visits.visitorsNote}</p>
    </div>
  );

  return (
    <ChartCard
      title={visits.title}
      controls={controls}
      status={view.status}
      errorCode={view.errorCode}
      generatedAt={view.generatedAt}
      placeholderClassName="h-chart-visits"
      empty={
        <div className="grid h-chart-visits place-items-center bg-tile p-6 text-center">
          <div className="grid max-w-message gap-2">
            <p className="m-0 font-serif text-h3 text-heading">{card.emptyVisitsTitle}</p>
            <p className="m-0 text-copy leading-copy text-secondary">{card.emptyVisitsBody}</p>
          </div>
        </div>
      }
      table={{
        caption: visits.tableCaption(metricName),
        columns: [visits.tableColumnBucket, `${visits.seriesNew}: ${tableColumnValue}`, `${visits.seriesOld}: ${tableColumnValue}`],
        rows: buckets.map((bucket, index) => [
          titles[index],
          formatNumber(bucket.current),
          bucket.old === null ? "—" : formatNumber(bucket.old),
        ]),
      }}
    >
      <div className="flex flex-wrap items-baseline gap-x-12 gap-y-2">
        <p className="m-0">
          <span className="font-serif text-num text-heading">{formatNumber(totals.views)}</span>{" "}
          <span className="text-small text-secondary">{visits.totalViews}</span>
        </p>
        <p className="m-0">
          <span className="font-serif text-num text-heading">{formatNumber(totals.visitors)}</span>{" "}
          <span className="text-small text-secondary">{visits.totalVisitors}</span>
        </p>
      </div>
      <ul aria-label={visits.legendAria} className="m-0 flex list-none flex-wrap gap-x-7 gap-y-2 p-0 text-small text-body">
        <li className="flex items-center gap-2.5">
          <span aria-hidden="true" className="size-swatch flex-none bg-bar" />
          {visits.legendNew(rangeLabel)}
        </li>
        <li className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className={`size-swatch flex-none border border-dashed border-old ${showOld ? "bg-old" : ""}`}
          />
          {visits.legendOld}
        </li>
      </ul>
      <p className="m-0 max-w-note bg-tile px-4 py-3 text-small leading-note text-secondary">
        <span className="font-medium text-heading">{visits.oldNoteTitle}</span> {visits.oldNoteBody}
        {oldNote && ` ${oldNote}`}
      </p>
      <VisitsBars
        labels={buckets.map((bucket) => bucketLabel(bucket, aggregation))}
        titles={titles}
        current={buckets.map((bucket) => bucket.current)}
        old={buckets.map((bucket) => bucket.old)}
        showOld={showOld}
        ariaLabel={visits.chartAria(metricName, rangeLabel)}
      />
    </ChartCard>
  );
}
