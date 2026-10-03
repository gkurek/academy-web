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
      className="exhibition-facts bg-surface-card"
    >
      <p
        id={headingId}
        className="exhibition-facts__heading font-serif text-size-role-box-title-m md:text-size-role-box-title leading-heading text-text-h2"
      >
        {pl.exhibition.facts.heading}
      </p>
      <dl className="text-size-body leading-facts">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-size-caption text-text-tertiary">{row.label}</dt>
            <dd className="text-text-body">{row.value}</dd>
          </div>
        ))}
      </dl>
      {footerLink ? <div className="exhibition-facts-footer">{footerLink}</div> : null}
    </aside>
  );
}
