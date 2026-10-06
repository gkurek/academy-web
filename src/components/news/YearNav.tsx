"use client";

import { useEffect, useRef, type MouseEvent } from "react";

import { ChevronSideIcon } from "@/components/core/icons";
import { useRevealFocus } from "@/components/core/useRevealFocus";
import { useScrollEdges } from "@/components/core/useScrollEdges";
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
  const { canScrollPrev, canScrollNext } = useScrollEdges(linksRef);
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

  const scrollLinks = (direction: -1 | 1) => {
    const row = linksRef.current;
    if (!row) {
      return;
    }

    row.scrollBy({ left: direction * row.clientWidth * 0.75, behavior: scrollBehavior() });
  };

  const hasOverflow = canScrollPrev || canScrollNext;

  // Arrows are mouse-only: keyboard focus already scrolls the row (useRevealFocus).
  const renderArrow = (direction: "prev" | "next") => (
    <button
      type="button"
      tabIndex={-1}
      aria-hidden="true"
      hidden={!hasOverflow}
      disabled={direction === "prev" ? !canScrollPrev : !canScrollNext}
      onClick={() => scrollLinks(direction === "prev" ? -1 : 1)}
      className="year-nav-arrow"
    >
      <ChevronSideIcon direction={direction} size={16} />
    </button>
  );

  const renderMore = (visible: boolean) => (
    <span
      aria-hidden="true"
      hidden={!hasOverflow}
      className={visible ? "year-nav-more" : "year-nav-more invisible"}
    >
      {pl.news.yearNavMore}
    </span>
  );

  return (
    <nav
      ref={navRef}
      id="year-nav"
      aria-label={pl.news.yearNavAriaLabel}
      className="year-nav"
    >
      <p className="year-nav-label">{pl.news.yearNavLabel}</p>
      <div className="year-nav-scroller">
        {renderArrow("prev")}
        {renderMore(canScrollPrev)}
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
        {renderMore(canScrollNext)}
        {renderArrow("next")}
      </div>
    </nav>
  );
}
