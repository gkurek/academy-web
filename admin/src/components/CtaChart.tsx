"use client";

import { ChartCard } from "@/components/ChartCard";
import { HorizontalBarChart } from "@/components/HorizontalBarChart";
import { pl } from "@/i18n/pl";
import type { CtaKey } from "@/lib/analyticsSource";
import type { PeriodView } from "@/lib/analyticsView";
import { toBreakdown } from "@/lib/breakdown";
import { useChartPalette } from "@/lib/chartTheme";

type CtaChartProps = { view: PeriodView };

const { cta } = pl.analytics;
const LABELS: Record<CtaKey, { long: string; short: string }> = {
  course: { long: cta.course, short: cta.courseShort },
  summer: { long: cta.summer, short: cta.summerShort },
  lectures: { long: cta.lectures, short: cta.lecturesShort },
  email: { long: cta.email, short: cta.email },
  phone: { long: cta.phone, short: cta.phone },
};

// `enroll_click` per offer, `email_click`, `phone_click`; short offer names on phones (mockup).
export function CtaChart({ view }: CtaChartProps) {
  const { mobile } = useChartPalette();
  const data = toBreakdown(
    cta.title,
    view.cta.map((item) => ({ label: LABELS[item.key][mobile ? "short" : "long"], value: item.clicks })),
    false,
    mobile,
  );

  return (
    <ChartCard
      title={cta.title}
      description={cta.description}
      status={view.status}
      errorCode={view.errorCode}
      generatedAt={view.generatedAt}
      placeholderClassName="h-chart-cta"
      table={data.table}
      className="panel:col-span-2"
    >
      <HorizontalBarChart
        labels={data.labels}
        values={data.values}
        ariaLabel={data.ariaLabel}
        heightClassName="h-chart-cta"
      />
    </ChartCard>
  );
}
