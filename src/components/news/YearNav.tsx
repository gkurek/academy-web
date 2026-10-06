"use client";

import { useEffect, useRef, type MouseEvent } from "react";

import { useRevealFocus } from "@/components/core/useRevealFocus";
import { focusNewsYearCardTitleAfterLayout } from "@/components/news/focusNewsYearCardTitle";
import { NavUnderlineLink } from "@/components/navigation/NavUnderlineLink";
import { useYearActiveId } from "@/components/news/useYearActiveId";
import { NEWS_ARCHIVE_EXPAND_EVENT } from "@/components/news/newsArchiveEvents";
import { pl } from "@/i18n/pl";
import { scrollBehavior, scrollToId } from "@/lib/scroll";

export interface YearNavProps {
  years: string[];
  archiveYears: string[];
}

export function YearNav({ years, archiveYears }: YearNavProps) {
  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRevealFocus<HTMLDivElement>();
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
      behavior: scrollBehavior(),
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
        return;
      }
    }

    event.preventDefault();
    window.history.pushState(null, "", `#${year}`);
    scrollToId(year);
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
      <div ref={linksRef} className="year-nav-links">
        {years.map((year) => {
          const isActive = year === activeYear;
          return (
            <NavUnderlineLink
              key={year}
              href={`#${year}`}
              label={year}
              variant="section"
              isActive={isActive}
              ariaCurrent={isActive ? "true" : undefined}
              onClick={(event) => handleYearClick(event, year)}
              className="year-nav-link"
            />
          );
        })}
      </div>
    </nav>
  );
}
