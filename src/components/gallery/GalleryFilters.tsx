"use client";

import { useEffect, type MouseEvent } from "react";
import { useRouter } from "next/navigation";

import { FilterChip } from "@/components/core/FilterChip";
import type { IconFilters } from "@/content/icons";
import { getIconTagLabel } from "@/content/icons";
import { pl } from "@/i18n/pl";

export interface GalleryFiltersProps {
  tags: string[];
  filters: IconFilters;
  /** Unknown `temat` or retired `autor` in the URL — replace with the canonical URL. */
  needsUrlCleanup: boolean;
}

function buildGalleryUrl(filters: IconFilters): string {
  return filters.tag ? `/ikony?${new URLSearchParams({ temat: filters.tag })}` : "/ikony";
}

// Chips never shrink or wrap their label: on mobile the row scrolls sideways.
const chipClass = "shrink-0 whitespace-nowrap";

const chipRowClass = [
  // K-44 (mobile): below md a single scrollable row that bleeds to the screen edge (the cut-off
  // last chip signals scrolling); from md up the chips wrap. Padding with negative margins leaves
  // room for the focus ring, which overflow-x would otherwise clip.
  "flex min-w-0 gap-space-3 overflow-x-auto",
  "-ml-space-2 pl-space-2 -my-space-2 py-space-2",
  "-mr-page-margin-mobile pr-page-margin-mobile",
  "md:mr-0 md:pr-0 md:flex-wrap md:overflow-visible",
].join(" ");

export function GalleryFilters({ tags, filters, needsUrlCleanup }: GalleryFiltersProps) {
  const router = useRouter();
  const cleanUrl = buildGalleryUrl(filters);

  useEffect(() => {
    if (needsUrlCleanup) {
      router.replace(`${cleanUrl}${window.location.hash}`, { scroll: false });
    }
  }, [needsUrlCleanup, cleanUrl, router]);

  // The section hash (`#uczniowie`) survives a change of theme.
  const select = (event: MouseEvent<HTMLAnchorElement>, nextFilters: IconFilters) => {
    event.preventDefault();
    router.replace(`${buildGalleryUrl(nextFilters)}${window.location.hash}`, { scroll: false });
  };

  const allFilters: IconFilters = {};

  return (
    <div role="group" aria-label={pl.gallery.filters.themeGroupAria}>
      <p aria-hidden="true" className="text-size-nav text-text-tertiary mb-space-3">
        {pl.gallery.filters.themeLabel}
      </p>
      <div className="flex flex-wrap items-center justify-between gap-x-space-6 gap-y-space-3">
        <div className={chipRowClass}>
          <FilterChip
            href={buildGalleryUrl(allFilters)}
            active={filters.tag === undefined}
            onClick={(event) => select(event, allFilters)}
            className={chipClass}
          >
            {pl.gallery.filters.themeAll}
          </FilterChip>
          {tags.map((tag) => {
            const active = filters.tag === tag;
            // Clicking the active chip is a shortcut back to "Wszystkie".
            const nextFilters: IconFilters = active ? allFilters : { tag };

            return (
              <FilterChip
                key={tag}
                href={buildGalleryUrl(nextFilters)}
                active={active}
                onClick={(event) => select(event, nextFilters)}
                className={chipClass}
              >
                {getIconTagLabel(tag)}
              </FilterChip>
            );
          })}
        </div>
      </div>
    </div>
  );
}
