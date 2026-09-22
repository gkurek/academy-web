"use client";

import { useEffect } from "react";

import { NEWS_ARCHIVE_EXPAND_EVENT } from "@/components/news/newsArchiveEvents";

export interface NewsListScrollRestoreProps {
  years: string[];
  archiveYears: string[];
}

function getHashYear(): string {
  return window.location.hash.replace(/^#/, "");
}

function isBackNavigation(): boolean {
  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  return navigation?.type === "back_forward";
}

function scrollToYear(year: string): void {
  document.getElementById(year)?.scrollIntoView({ block: "start" });
}

function restoreYearScroll(years: string[], archiveYears: string[]): void {
  const year = getHashYear();
  if (!years.includes(year)) {
    return;
  }

  if (archiveYears.includes(year)) {
    window.dispatchEvent(
      new CustomEvent(NEWS_ARCHIVE_EXPAND_EVENT, { detail: { year, focus: false } }),
    );
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => scrollToYear(year));
  });
}

export function NewsListScrollRestore({ years, archiveYears }: NewsListScrollRestoreProps) {
  useEffect(() => {
    if (isBackNavigation()) {
      restoreYearScroll(years, archiveYears);
    }

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        restoreYearScroll(years, archiveYears);
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [years, archiveYears]);

  return null;
}
