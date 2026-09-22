"use client";

import Link from "next/link";
import { useEffect, useRef, type MouseEvent } from "react";

import { focusNewsYearCardTitleAfterLayout } from "@/components/news/focusNewsYearCardTitle";
import { useYearActiveId } from "@/components/news/useYearActiveId";
import { NEWS_ARCHIVE_EXPAND_EVENT } from "@/components/news/newsArchiveEvents";
import { pl } from "@/i18n/pl";

export interface YearNavClientProps {
  years: string[];
  archiveYears: string[];
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function YearNavClient({ years, archiveYears }: YearNavClientProps) {
  const navRef = useRef<HTMLElement>(null);
  const activeYear = useYearActiveId(years);
  const archiveYearSet = new Set(archiveYears);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) {
      return undefined;
    }

    const setScrollOffset = () => {
      document.documentElement.style.setProperty(
        "--year-nav-scroll-offset",
        `${nav.offsetHeight}px`,
      );
    };

    setScrollOffset();

    const resizeObserver = new ResizeObserver(setScrollOffset);
    resizeObserver.observe(nav);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!activeYear || !navRef.current) {
      return;
    }

    const activeLink = navRef.current.querySelector<HTMLElement>(`a[href="#${activeYear}"]`);
    if (!activeLink) {
      return;
    }

    activeLink.scrollIntoView({
      inline: "nearest",
      block: "nearest",
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [activeYear]);

  useEffect(() => {
    const handleHashFocus = () => {
      const year = window.location.hash.replace(/^#/, "");
      if (!years.includes(year)) {
        return;
      }

      focusNewsYearCardTitleAfterLayout(year);
    };

    window.addEventListener("hashchange", handleHashFocus);
    return () => window.removeEventListener("hashchange", handleHashFocus);
  }, [years]);

  const handleYearClick = (event: MouseEvent<HTMLAnchorElement>, year: string) => {
    if (archiveYearSet.has(year)) {
      const archiveContent = document.getElementById("news-archive-content");
      if (archiveContent?.hasAttribute("hidden")) {
        event.preventDefault();
        window.dispatchEvent(
          new CustomEvent(NEWS_ARCHIVE_EXPAND_EVENT, { detail: { year, focus: false } }),
        );
        focusNewsYearCardTitleAfterLayout(year);
        return;
      }
    }

    focusNewsYearCardTitleAfterLayout(year);
  };

  return (
    <nav
      ref={navRef}
      id="year-nav"
      aria-label={pl.news.yearNavAriaLabel}
      className="year-nav"
    >
      <p className="year-nav-label">{pl.news.yearNavLabel}</p>
      <div className="year-nav-links">
        {years.map((year) => {
          const isActive = year === activeYear;
          return (
            <Link
              key={year}
              href={`#${year}`}
              aria-current={isActive ? "true" : undefined}
              onClick={(event) => handleYearClick(event, year)}
              className={
                (isActive
                  ? "nav-link-underline nav-link-underline-section nav-link-underline-active text-accent-text"
                  : "nav-link-underline nav-link-underline-section text-text-secondary hover:text-accent-hover") +
                " tap-target-nav year-nav-link"
              }
            >
              {year}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
