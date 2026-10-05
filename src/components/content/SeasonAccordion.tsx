"use client";

import { useEffect, useMemo, useState } from "react";

import { ChevronIcon } from "@/components/core/icons";
import { LectureList } from "@/components/content/LectureList";
import type { LoadedLectureSeason } from "@/content/lectures";
import { pl } from "@/i18n/pl";
import { scrollToId } from "@/lib/scroll";

function parseSeasonSlugFromHash(hash: string, seasonSlugs: readonly string[]): string | null {
  const id = hash.replace(/^#/, "");
  if (!id) {
    return null;
  }

  const fromTrigger = id.startsWith("season-trigger-") ? id.slice("season-trigger-".length) : null;
  const fromPanel = id.startsWith("season-panel-") ? id.slice("season-panel-".length) : null;
  const fromSeason = id.startsWith("season-") ? id.slice("season-".length) : null;
  const candidate = fromTrigger ?? fromPanel ?? fromSeason ?? id;

  return seasonSlugs.includes(candidate) ? candidate : null;
}

function seasonAnchorId(slug: string): string {
  return `season-${slug}`;
}

function scrollToSeasonAnchor(slug: string): void {
  if (!scrollToId(seasonAnchorId(slug))) {
    return;
  }

  const focused = document.activeElement;
  if (focused instanceof HTMLButtonElement && focused.id.startsWith("season-trigger-")) {
    focused.blur();
  }
}

/** Only the fields the accordion renders — keeps the RSC payload free of intros and galleries. */
type SeasonAccordionItem = Pick<LoadedLectureSeason, "slug" | "label" | "cycleTitle" | "lectures">;

export interface SeasonAccordionProps {
  seasons: SeasonAccordionItem[];
}

export function SeasonAccordion({ seasons }: SeasonAccordionProps) {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const seasonSlugs = useMemo(() => seasons.map((season) => season.slug), [seasons]);

  useEffect(() => {
    const syncExpandedFromHash = () => {
      const slug = parseSeasonSlugFromHash(window.location.hash, seasonSlugs);
      if (slug) {
        setExpandedSlug(slug);
      }
    };

    syncExpandedFromHash();
    window.addEventListener("hashchange", syncExpandedFromHash);
    return () => window.removeEventListener("hashchange", syncExpandedFromHash);
  }, [seasonSlugs]);

  useEffect(() => {
    const slug = parseSeasonSlugFromHash(window.location.hash, seasonSlugs);
    if (!slug || expandedSlug !== slug) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      scrollToSeasonAnchor(slug);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [expandedSlug, seasonSlugs]);

  const toggleSeason = (slug: string) => {
    setExpandedSlug((current) => (current === slug ? null : slug));
  };

  return (
    <div className="hairline-stack">
      {seasons.map((season) => {
        const isExpanded = expandedSlug === season.slug;
        const panelId = `season-panel-${season.slug}`;
        const triggerId = `season-trigger-${season.slug}`;

        return (
          <div key={season.slug} id={seasonAnchorId(season.slug)} className="scroll-mt-space-6">
            <h2>
              <button
                type="button"
                id={triggerId}
                aria-expanded={isExpanded}
                aria-controls={panelId}
                onClick={() => toggleSeason(season.slug)}
                className={[
                  "w-full cursor-pointer text-left grid grid-cols-season-head lg:grid-cols-season-head-lg",
                  "gap-x-season-accordion-header-mb gap-y-space-1 lg:gap-y-0 lg:items-baseline",
                  "px-season-accordion-expanded-x pt-season-accordion-expanded-y-top",
                  isExpanded
                    ? "bg-surface-card pb-season-accordion-header-mb border-b border-line-neutral border-l-accent-bar border-l-accent"
                    : "bg-surface-tile hover:bg-surface-card pb-season-accordion-collapsed-y",
                ].join(" ")}
              >
                <span
                  className="col-start-1 row-start-1 self-baseline shrink-0 font-serif text-size-season-accordion-collapsed-label text-accent-text"
                >
                  {season.label}
                </span>
                <span
                  className={[
                    "col-start-2 row-start-1 self-start lg:col-start-3 lg:self-baseline",
                    "inline-flex items-center gap-space-2 font-sans text-size-season-accordion-toggle whitespace-nowrap",
                    isExpanded ? "text-text-tertiary" : "text-accent-text",
                  ].join(" ")}
                >
                  {isExpanded ? pl.lectures.accordionCollapse : pl.lectures.accordionExpand}
                  <ChevronIcon expanded={isExpanded} size={16} className="shrink-0" />
                </span>
                <span
                  className="col-span-2 min-w-0 self-baseline font-serif text-size-season-accordion-collapsed-label text-text-list-title lg:col-span-1 lg:col-start-2 lg:row-start-1"
                >
                  {season.cycleTitle || pl.lectures.cycleTitlePlaceholder}
                </span>
              </button>
            </h2>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isExpanded}
              className="bg-surface-card border-l-accent-bar border-l-accent md:pl-tile-px"
            >
              <LectureList items={season.lectures} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
