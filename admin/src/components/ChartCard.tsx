"use client";

import { useRouter } from "next/navigation";
import { useId, type ReactNode } from "react";

import { pl } from "@/i18n/pl";
import type { ViewStatus } from "@/lib/analyticsView";
import { formatTime } from "@/lib/format";

export type DataTable = { caption: string; columns: string[]; rows: string[][] };

type ChartCardProps = {
  title: string;
  description?: string;
  /** Controls under the title (switches in the visits card). */
  controls?: ReactNode;
  status: ViewStatus;
  errorCode: string | null;
  generatedAt: string;
  /** Height of the loading / empty block — the chart's own height token. */
  placeholderClassName: string;
  /** Empty state in place of the default one-liner (the visits card explains when data arrives). */
  empty?: ReactNode;
  /** Same numbers as the chart, for screen readers (the canvas is a single image). */
  table?: DataTable;
  className?: string;
  children: ReactNode;
};

// Card frame for every Analytics block (README-panel §5): data · loading · no data · error with retry.
export function ChartCard({
  title,
  description,
  controls,
  status,
  errorCode,
  generatedAt,
  placeholderClassName,
  empty,
  table,
  className = "",
  children,
}: ChartCardProps) {
  const headingId = useId();
  const router = useRouter();
  const { card } = pl.analytics;

  return (
    <section
      aria-labelledby={headingId}
      className={`grid min-w-0 gap-4 bg-card px-card-x pt-card-t pb-card-b ${className}`}
    >
      <div className="grid gap-1.5">
        <h2 id={headingId} className="m-0 font-serif text-h2 font-normal text-heading">
          {title}
        </h2>
        {description && (
          <p className="m-0 max-w-lede text-small leading-note text-secondary">{description}</p>
        )}
      </div>
      {controls}

      {status === "ready" && (
        <>
          {children}
          {table && (
            <table className="sr-only">
              <caption>{table.caption}</caption>
              <thead>
                <tr>
                  {table.columns.map((column) => (
                    <th key={column} scope="col">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) =>
                      index === 0 ? (
                        <th key={index} scope="row">
                          {cell}
                        </th>
                      ) : (
                        <td key={index}>{cell}</td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {status === "loading" && (
        <>
          <p role="status" className="m-0 text-copy text-secondary">
            {card.loading}
          </p>
          <div aria-hidden="true" className={`bg-tile ${placeholderClassName}`} />
        </>
      )}

      {status === "empty" &&
        (empty ?? <p className="m-0 bg-tile p-5 text-copy text-secondary">{card.empty}</p>)}

      {status === "error" && (
        <div role="alert" className="grid justify-items-start gap-3.5 border-t-3 border-error bg-tile p-5">
          <p className="m-0 font-serif text-h3 text-heading">{card.errorTitle}</p>
          <p className="m-0 max-w-note text-copy leading-copy text-secondary">{card.errorBody}</p>
          <button
            type="button"
            onClick={() => router.refresh()}
            className="min-h-tap cursor-pointer bg-accent px-6 text-ui font-medium text-on-gold hover:bg-accent-hover"
          >
            {card.retry}
          </button>
          {errorCode && (
            <p className="m-0 text-small text-tertiary">{card.errorCode(errorCode, formatTime(generatedAt))}</p>
          )}
        </div>
      )}
    </section>
  );
}
