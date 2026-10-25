"use client";

import { useId, useState } from "react";

import type { SemesterItem } from "@/content/offers";
import { ChevronIcon } from "@/components/core/icons";
import { PageHeading } from "@/components/core/PageHeading";

export interface SemesterTileProps {
  semester: SemesterItem;
  /** Decorative numeral shown beside the title (I–VI). */
  numeral: string;
  /** Spoken ordinal ("Semestr pierwszy") — screen readers only. */
  ordinal: string;
}

/** One semester tile: a collapsible accordion item below md, a static tile from md up. */
export function SemesterTile({ semester, numeral, ordinal }: SemesterTileProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const srOrdinal = <span className="sr-only">{`${ordinal}: `}</span>;

  return (
    <article className="bg-surface-tile flex flex-col md:flex-row md:gap-offer-semester-gap md:px-offer-semester-x md:py-offer-semester-y">
      <div
        aria-hidden="true"
        className="hidden md:block font-serif text-size-offer-semester-num leading-none text-accent-text shrink-0 w-offer-semester-num-width text-left"
      >
        {numeral}
      </div>
      <div className="min-w-0 md:flex-1">
        <PageHeading level="sub">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
            className="md:hidden flex w-full cursor-pointer items-center gap-offer-semester-gap-m px-space-4 py-offer-semester-y-m text-left"
          >
            {/* The numeral is decorative; the ordinal stays in the heading for screen readers only. */}
            <span
              aria-hidden="true"
              className="font-serif text-size-offer-semester-num-m leading-none text-accent-text shrink-0 w-offer-semester-num-width-m"
            >
              {numeral}
            </span>
            <span className="min-w-0 flex-1">
              {srOrdinal}
              {semester.title}
            </span>
            <ChevronIcon expanded={open} size={20} className="shrink-0 text-accent-text" />
          </button>
          <span className="hidden md:inline">
            {srOrdinal}
            {semester.title}
          </span>
        </PageHeading>
        <div
          id={panelId}
          className={`md:mt-space-3 ${open ? "px-space-4 pb-offer-semester-y-m md:px-0 md:pb-0" : "hidden md:block"}`}
        >
          {semester.topics && semester.topics.length > 0 ? (
            <ul className="text-size-body leading-body text-text-tertiary list-disc ps-space-4 md:ps-space-5 space-y-space-1">
              {semester.topics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          ) : semester.body ? (
            <p className="text-size-body leading-body text-text-tertiary">{semester.body}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
