"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";

import { focusNewsYearCardTitleAfterLayout } from "@/components/news/focusNewsYearCardTitle";
import {
  NEWS_ARCHIVE_EXPAND_EVENT,
  type NewsArchiveExpandDetail,
} from "@/components/news/newsArchiveEvents";
import { pl } from "@/i18n/pl";

const entryPluralRules = new Intl.PluralRules("pl");

function getEntryWord(count: number): string {
  const rule = entryPluralRules.select(count);
  if (rule === "one") {
    return pl.news.archiveEntryForms.one;
  }
  if (rule === "few") {
    return pl.news.archiveEntryForms.few;
  }
  return pl.news.archiveEntryForms.many;
}

export interface NewsArchiveShellProps {
  archiveYears: string[];
  entryCount: number;
  yearRange: string;
  firstYearId: string;
  children: ReactNode;
}

function isArchiveHash(hash: string, archiveYears: string[]): boolean {
  const year = hash.replace(/^#/, "");
  return archiveYears.includes(year);
}

export function NewsArchiveShell({
  archiveYears,
  entryCount,
  yearRange,
  firstYearId,
  children,
}: NewsArchiveShellProps) {
  const [expanded, setExpanded] = useState(true);

  const expandArchive = useCallback(
    (detail?: NewsArchiveExpandDetail) => {
      setExpanded(true);

      const targetYear = detail?.year;
      const shouldFocus = detail?.focus ?? false;

      requestAnimationFrame(() => {
        const focusTargetYear = shouldFocus ? firstYearId : targetYear;
        if (targetYear) {
          window.location.hash = targetYear;
        }

        if (!focusTargetYear) {
          return;
        }

        if (shouldFocus) {
          focusNewsYearCardTitleAfterLayout(focusTargetYear);
        }
      });
    },
    [firstYearId],
  );

  useEffect(() => {
    if (isArchiveHash(window.location.hash, archiveYears)) {
      const year = window.location.hash.replace(/^#/, "");
      requestAnimationFrame(() => {
        document.getElementById(year)?.scrollIntoView();
      });
      return;
    }

    // Progressive enhancement: archive stays visible without JS; collapse after hydration (K-66).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional post-hydration collapse
    setExpanded(false);
  }, [archiveYears]);

  useEffect(() => {
    const handleHashChange = () => {
      if (!isArchiveHash(window.location.hash, archiveYears)) {
        return;
      }

      expandArchive({ year: window.location.hash.replace(/^#/, ""), focus: false });
    };

    const handleExpandEvent = (event: Event) => {
      const detail = (event as CustomEvent<NewsArchiveExpandDetail>).detail;
      expandArchive(detail);
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener(NEWS_ARCHIVE_EXPAND_EVENT, handleExpandEvent);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener(NEWS_ARCHIVE_EXPAND_EVENT, handleExpandEvent);
    };
  }, [archiveYears, expandArchive]);

  const showArchiveLabel = pl.news.showArchiveLabel
    .replace("{range}", yearRange)
    .replace("{count}", String(entryCount))
    .replace("{word}", getEntryWord(entryCount));

  return (
    <>
      {!expanded ? (
        <button
          type="button"
          className="news-archive-toggle tap-target-nav"
          onClick={() => expandArchive({ focus: true })}
        >
          {showArchiveLabel}
        </button>
      ) : null}
      <div id="news-archive-content" className="news-archive-content" hidden={!expanded}>
        {children}
      </div>
    </>
  );
}
