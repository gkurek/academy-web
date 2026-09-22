"use client";

import { useEffect, useState } from "react";

function getYearNavOffset(): number {
  const nav = document.getElementById("year-nav");
  return nav?.offsetHeight ?? 64;
}

function isYearStartVisible(element: HTMLElement): boolean {
  return !element.closest("[hidden]");
}

function getYearStartElements(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>("[data-year-start]")].filter(
    isYearStartVisible,
  );
}

function resolveActiveYear(years: string[]): string | undefined {
  const offset = getYearNavOffset();
  const yearStarts = getYearStartElements();

  if (yearStarts.length === 0) {
    return years[0];
  }

  let active = years[0];

  yearStarts.forEach((element) => {
    if (element.getBoundingClientRect().top <= offset) {
      active = element.dataset.yearStart ?? active;
    }
  });

  return active;
}

/** Highlights the year whose first list card has crossed the sticky year nav (K-70). */
export function useYearActiveId(years: string[]): string | undefined {
  const [activeYear, setActiveYear] = useState<string | undefined>(years[0]);
  const [pinnedYear, setPinnedYear] = useState<string | undefined>(undefined);

  useEffect(() => {
    const updateActiveYear = () => {
      setActiveYear(resolveActiveYear(years));
    };

    const yearStarts = getYearStartElements();
    if (yearStarts.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      () => {
        updateActiveYear();
      },
      {
        root: null,
        rootMargin: `${-getYearNavOffset()}px 0px 0px 0px`,
        threshold: [0, 1],
      },
    );

    yearStarts.forEach((element) => observer.observe(element));
    window.addEventListener("scroll", updateActiveYear, { passive: true });
    window.addEventListener("resize", updateActiveYear);
    updateActiveYear();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateActiveYear);
      window.removeEventListener("resize", updateActiveYear);
    };
  }, [years]);

  useEffect(() => {
    const syncPinnedYear = () => {
      const hashYear = window.location.hash.replace(/^#/, "");
      setPinnedYear(years.includes(hashYear) ? hashYear : undefined);
    };

    syncPinnedYear();
    window.addEventListener("hashchange", syncPinnedYear);
    return () => window.removeEventListener("hashchange", syncPinnedYear);
  }, [years]);

  useEffect(() => {
    const clearPin = () => setPinnedYear(undefined);
    window.addEventListener("scroll", clearPin, { once: true, passive: true });
    return () => window.removeEventListener("scroll", clearPin);
  }, [pinnedYear]);

  return pinnedYear ?? activeYear;
}
