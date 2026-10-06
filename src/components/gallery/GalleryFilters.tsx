"use client";

import { useEffect, type MouseEvent } from "react";

import { FilterChip } from "@/components/core/FilterChip";
import { useRevealFocus } from "@/components/core/useRevealFocus";
import {
  buildGalleryUrl,
  replaceGalleryUrl,
  useGalleryFilters,
} from "@/components/gallery/useGalleryFilters";
import type { IconFilters } from "@/content/icons";
import { getIconTagLabel } from "@/content/icons";
import { pl } from "@/i18n/pl";

export interface GalleryFiltersProps {
  tags: string[];
}

// Chips never shrink or wrap their label: on mobile the row scrolls sideways.
const chipClass = "shrink-0 whitespace-nowrap";

const chipRowClass = [
  // K-44 (mobile): below md a single scrollable row that bleeds to the screen edge (the cut-off
  // last chip signals scrolling); from md up the chips wrap. Padding with negative margins leaves
  // room for the focus ring, which overflow-x would otherwise clip.
  "scroll-row flex min-w-0 gap-space-3 overflow-x-auto",
  "-ml-space-2 pl-space-2 -my-space-2 py-space-2",
  "-mr-page-margin-mobile pr-page-margin-mobile",
  "md:mr-0 md:pr-0 md:flex-wrap md:overflow-visible",
].join(" ");

const allFilters: IconFilters = {};

export function GalleryFilters({ tags }: GalleryFiltersProps) {
  const { filters, search } = useGalleryFilters();
  const rowRef = useRevealFocus<HTMLDivElement>();
  const activeTag = filters.tag;

  // Unknown `temat`, a retired alias or the old `autor` param: rewrite to the canonical URL.
  useEffect(() => {
    const canonicalSearch = new URL(buildGalleryUrl({ tag: activeTag }), window.location.origin).search;
    if (search !== canonicalSearch) {
      replaceGalleryUrl({ tag: activeTag });
    }
  }, [search, activeTag]);

  const select = (event: MouseEvent<HTMLAnchorElement>, nextFilters: IconFilters) => {
    event.preventDefault();
    replaceGalleryUrl(nextFilters);
  };

  return (
    <div role="group" aria-label={pl.gallery.filters.themeGroupAria}>
      <p aria-hidden="true" className="text-size-nav text-text-tertiary mb-space-3">
        {pl.gallery.filters.themeLabel}
      </p>
      <div className="flex flex-wrap items-center justify-between gap-x-space-6 gap-y-space-3">
        <div ref={rowRef} className={chipRowClass}>
          <FilterChip
            href={buildGalleryUrl(allFilters)}
            active={activeTag === undefined}
            onClick={(event) => select(event, allFilters)}
            className={chipClass}
          >
            {pl.gallery.filters.themeAll}
          </FilterChip>
          {tags.map((tag) => {
            const active = activeTag === tag;
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
