"use client";

import { ChartCard } from "@/components/ChartCard";
import { pl } from "@/i18n/pl";
import type { PeriodView } from "@/lib/analyticsView";
import { formatMonthRange, formatNumber } from "@/lib/format";
import { PUBLIC_SITE_URL } from "@/lib/site";

type TopPagesListProps = { view: PeriodView };

// Most viewed pages; old-site views (whole months a year earlier, 12b-1) next to each address.
export function TopPagesList({ view }: TopPagesListProps) {
  const { pages } = pl.analytics;
  const max = Math.max(1, ...view.topPages.map((page) => page.views));
  const months = view.oldPagesMonths;

  return (
    <ChartCard
      title={pages.title}
      status={view.status}
      errorCode={view.errorCode}
      generatedAt={view.generatedAt}
      placeholderClassName="h-chart-pages"
    >
      <ol className="m-0 grid list-none gap-px bg-line p-0">
        {view.topPages.map((page) => (
          <li key={page.path} className="grid gap-1 bg-card py-3">
            <span className="flex items-baseline justify-between gap-4">
              <a
                href={`${PUBLIC_SITE_URL}${page.path}`}
                target="_blank"
                rel="noopener"
                className="min-w-0 text-copy text-body no-underline hover:text-gold"
              >
                {page.title}
                <span className="sr-only">{pl.header.externalNewTab}</span>
              </a>
              <span className="shrink-0 text-copy text-heading tabular-nums">{formatNumber(page.views)}</span>
            </span>
            <span className="text-small wrap-anywhere text-tertiary">
              {page.path}
              {page.oldViews !== null && ` · ${pages.oldViews(formatNumber(page.oldViews))}`}
            </span>
            <span aria-hidden="true" className="h-1 bg-tile">
              <span className="block h-1 bg-bar" style={{ width: `${(page.views / max) * 100}%` }} />
            </span>
          </li>
        ))}
      </ol>
      <p className="m-0 bg-tile px-4 py-3 text-small leading-note text-secondary">
        {months ? pages.oldNote(formatMonthRange(months.from, months.to)) : pages.oldNoteNone}
      </p>
    </ChartCard>
  );
}
