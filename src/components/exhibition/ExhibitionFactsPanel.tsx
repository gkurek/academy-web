"use client";

import { useId, type ReactNode } from "react";

import { pl } from "@/i18n/pl";

export interface ExhibitionFactsPanelProps {
  rows: { label: string; value: string }[];
  footerLink?: ReactNode;
}

export function ExhibitionFactsPanel({ rows, footerLink }: ExhibitionFactsPanelProps) {
  const headingId = useId();

  return (
    <aside
      aria-labelledby={headingId}
      className="exhibition-facts bg-surface-card border-t-offer-facts-top border-accent px-offer-facts-x pt-offer-facts-y pb-offer-facts-pb"
    >
      <h2 id={headingId} className="sr-only">
        {pl.exhibition.facts.srHeading}
      </h2>
      <dl className="text-size-body leading-facts">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-size-caption text-text-tertiary">{row.label}</dt>
            <dd className="mt-offer-facts-dd-mt pb-space-6 text-text-body last:pb-0">{row.value}</dd>
          </div>
        ))}
      </dl>
      {footerLink ? <div className="exhibition-facts-footer">{footerLink}</div> : null}
    </aside>
  );
}
