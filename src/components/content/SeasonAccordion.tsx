"use client";

import { useState } from "react";

import { LectureList } from "@/components/content/LectureList";
import type { LoadedLectureSeason } from "@/content/lectures";
import { pl } from "@/i18n/pl";

export interface SeasonAccordionProps {
  seasons: LoadedLectureSeason[];
  defaultExpandedSlug?: string;
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      {expanded ? <path d="M5 15 L12 8 L19 15" /> : <path d="M5 9 L12 16 L19 9" />}
    </svg>
  );
}

export function SeasonAccordion({ seasons, defaultExpandedSlug }: SeasonAccordionProps) {
  const initialSlug = defaultExpandedSlug ?? null;
  const [expandedSlug, setExpandedSlug] = useState<string | null>(initialSlug);

  const toggleSeason = (slug: string) => {
    setExpandedSlug((current) => (current === slug ? null : slug));
  };

  return (
    <div className="grid gap-hairline-gap bg-line-gold">
      {seasons.map((season) => {
        const isExpanded = expandedSlug === season.slug;
        const panelId = `season-panel-${season.slug}`;
        const triggerId = `season-trigger-${season.slug}`;

        return (
          <div key={season.slug}>
            <button
              type="button"
              id={triggerId}
              aria-expanded={isExpanded}
              aria-controls={panelId}
              onClick={() => toggleSeason(season.slug)}
              className={[
                "w-full cursor-pointer text-left grid grid-cols-[1fr_auto] lg:grid-cols-[auto_minmax(0,1fr)_auto]",
                "gap-x-season-accordion-header-mb gap-y-space-1 lg:gap-y-0 lg:items-baseline",
                "px-season-accordion-expanded-x pt-season-accordion-expanded-y-top",
                isExpanded
                  ? "bg-surface-card pb-season-accordion-header-mb border-b border-line-neutral"
                  : "bg-surface-tile hover:bg-surface-card pb-season-accordion-collapsed-y",
              ].join(" ")}
            >
              <span
                className="col-start-1 row-start-1 self-baseline shrink-0 font-serif text-size-season-accordion-collapsed-label text-text-list-title"
              >
                {season.label}
              </span>
              <span
                className={[
                  "col-start-2 row-start-1 self-start lg:col-start-3 lg:self-baseline",
                  "inline-flex items-center gap-space-2 text-size-season-accordion-toggle whitespace-nowrap",
                  isExpanded ? "text-text-tertiary" : "text-accent-text",
                ].join(" ")}
              >
                {isExpanded ? pl.lectures.accordionCollapse : pl.lectures.accordionExpand}
                <ChevronIcon expanded={isExpanded} />
              </span>
              <span
                className="col-span-2 min-w-0 self-baseline font-serif text-size-season-accordion-collapsed-label text-accent lg:col-span-1 lg:col-start-2 lg:row-start-1"
              >
                {season.cycleTitle || pl.lectures.cycleTitlePlaceholder}
              </span>
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isExpanded}
              className="bg-surface-card"
            >
              {season.placeholder ? (
                <p className="px-lecture-row-x text-size-body leading-body text-text-secondary">
                  {pl.lectures.placeholderMessage}
                </p>
              ) : (
                <LectureList items={season.lectures} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
