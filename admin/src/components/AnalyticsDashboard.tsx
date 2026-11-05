"use client";

import { useState } from "react";

import { CtaChart } from "@/components/CtaChart";
import { DevicesChart } from "@/components/DevicesChart";
import { PeriodSwitch } from "@/components/PeriodSwitch";
import { SourcesChart } from "@/components/SourcesChart";
import { TopPagesList } from "@/components/TopPagesList";
import { VisitsChart } from "@/components/VisitsChart";
import { pl } from "@/i18n/pl";
import type { Aggregation, Metric, Period } from "@/lib/analyticsSource";
import type { PeriodView } from "@/lib/analyticsView";
import { formatAsOf, formatRange } from "@/lib/format";

type AnalyticsDashboardProps = {
  views: PeriodView[];
  /** True while the new-site numbers come from the sample source (until 12b-3). */
  sample: boolean;
};

// Analytics tab body (mockup PanelAnalityka, screen 4.1). Every period is prepared on the server,
// so switching is instant and no data request leaves the browser.
export function AnalyticsDashboard({ views, sample }: AnalyticsDashboardProps) {
  const [period, setPeriod] = useState<Period>(30);
  const [aggregation, setAggregation] = useState<Aggregation>("day");
  const [metric, setMetric] = useState<Metric>("views");

  const view = views.find((candidate) => candidate.period === period) ?? views[0];
  const rangeLabel = formatRange(view.from, view.to);
  const asOf = formatAsOf(view.generatedAt);

  return (
    <>
      <div className="-mt-2 flex flex-wrap items-end gap-x-10 gap-y-4">
        <PeriodSwitch value={period} onChange={setPeriod} />
        <p className="m-0 pb-3 text-small text-tertiary">
          {rangeLabel} · {pl.analytics.asOf(asOf.date, asOf.time)}
          {sample && ` · ${pl.analytics.sampleNote}`}
        </p>
      </div>

      <VisitsChart
        view={view}
        rangeLabel={rangeLabel}
        aggregation={aggregation}
        metric={metric}
        onAggregationChange={setAggregation}
        onMetricChange={setMetric}
      />

      <div className="grid items-start gap-grid-gap panel:grid-cols-2">
        <TopPagesList view={view} />
        <div className="grid min-w-0 gap-grid-gap">
          <SourcesChart view={view} />
          <DevicesChart view={view} />
        </div>
        <CtaChart view={view} />
      </div>
    </>
  );
}
