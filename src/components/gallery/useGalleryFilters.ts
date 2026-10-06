"use client";

import { useSyncExternalStore } from "react";

import { parseIconFilters, type IconFilters } from "@/content/icons";

/** Fired after `replaceGalleryUrl` so every subscriber re-reads the URL (D8: `replaceState`). */
const CHANGE_EVENT = "gallery-filters-change";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("popstate", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

const getSnapshot = () => window.location.search;

/** The static page is rendered without a filter; the client applies the URL right after hydration. */
const getServerSnapshot = () => "";

export function buildGalleryUrl(filters: IconFilters): string {
  return filters.tag ? `/ikony?${new URLSearchParams({ temat: filters.tag })}` : "/ikony";
}

/** The `?temat=` filter of /ikony, read from the URL — the single source for chips and grid. */
export function useGalleryFilters(): { filters: IconFilters; search: string } {
  const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const filters = parseIconFilters(Object.fromEntries(new URLSearchParams(search)));

  return { filters, search };
}

/** Updates the URL in place (no history entry, no request) and keeps the section hash. */
export function replaceGalleryUrl(filters: IconFilters): void {
  window.history.replaceState(null, "", `${buildGalleryUrl(filters)}${window.location.hash}`);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
