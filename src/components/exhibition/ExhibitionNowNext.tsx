import Link from "next/link";

import type { ExhibitionNowNext as ExhibitionNowNextState, ExhibitionNowNextRow } from "@/content/exhibition";
import { pl } from "@/i18n/pl";
import { formatDateRange } from "@/lib/formatDateRange";

export interface ExhibitionNowNextProps {
  state: ExhibitionNowNextState;
  className?: string;
}

function sectionHref(section: "ekspozycja" | "doroczna"): string {
  return section === "ekspozycja" ? "#ekspozycja" : "#doroczna";
}

function nowTitle(row: ExhibitionNowNextRow): string {
  if (row.section === "ekspozycja") {
    return row.permanentTitle ?? "";
  }

  return row.annualTitle ?? "";
}

function nowSubline(row: ExhibitionNowNextRow, copy: typeof pl.exhibition.nowNext): string {
  if (row.section === "ekspozycja") {
    return copy.permanentNowSubline.replace("{year}", String(row.untilMidJuneYear ?? ""));
  }

  const parts = [
    copy.annualNowSubline.replace("{year}", String(row.annualYear ?? "")),
    row.dateEnd
      ? copy.untilDate.replace(
          "{date}",
          formatDateRange(row.dateEnd, undefined, { withYear: true }),
        )
      : "",
  ];

  return parts.filter(Boolean).join(", ");
}

function nextTitle(row: ExhibitionNowNextRow, copy: typeof pl.exhibition.nowNext): string {
  if (row.section === "ekspozycja") {
    return row.permanentTitle ?? "";
  }

  return copy.annualNextTitle.replace("{year}", String(row.annualYear ?? ""));
}

function nextSubline(row: ExhibitionNowNextRow, copy: typeof pl.exhibition.nowNext): string {
  if (row.section === "ekspozycja") {
    return copy.permanentFromSeptemberSuffix;
  }

  if (!row.vernissageDate) {
    return "";
  }

  return copy.vernissageSubline.replace(
    "{date}",
    formatDateRange(row.vernissageDate, undefined, { withYear: false }),
  );
}

export function ExhibitionNowNext({ state, className }: ExhibitionNowNextProps) {
  const copy = pl.exhibition.nowNext;
  const { now, next } = state;
  const rootClass = ["exhibition-now-next", className].filter(Boolean).join(" ");

  return (
    <aside className={rootClass} aria-label={copy.ariaLabel}>
      <div className="exhibition-now-next-row">
        <p className="exhibition-now-next-label">{copy.nowLabel}</p>
        <Link
          href={sectionHref(now.section)}
          className="exhibition-now-next-title exhibition-now-next-title--primary"
        >
          {nowTitle(now)}
        </Link>
        <p className="exhibition-now-next-subline">{nowSubline(now, copy)}</p>
      </div>
      <div className="exhibition-now-next-row">
        <p className="exhibition-now-next-label">{copy.nextLabel}</p>
        <Link
          href={sectionHref(next.section)}
          className="exhibition-now-next-title exhibition-now-next-title--secondary"
        >
          {nextTitle(next, copy)}
        </Link>
        <p className="exhibition-now-next-subline">{nextSubline(next, copy)}</p>
      </div>
    </aside>
  );
}
