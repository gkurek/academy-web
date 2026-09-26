"use client";

import Link from "next/link";
import { useState } from "react";

import { useExhibitionLightbox } from "@/components/exhibition/ExhibitionLightboxProvider";
import type { Image as ContentImage } from "@/content/types";
import { pl } from "@/i18n/pl";

const VISIBLE_COUNT = 5;

export type ExhibitionPreviousRow = {
  seasonSlug: string;
  year: number;
  title: string;
  newsSlug?: string;
  photos: ContentImage[];
};

export interface ExhibitionPreviousSectionProps {
  exhibitions: ExhibitionPreviousRow[];
}

function ChevronDownIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function formatCollapsedRange(exhibitions: ExhibitionPreviousRow[]): string {
  const years = exhibitions.map((exhibition) => exhibition.year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  return `${minYear}–${maxYear}`;
}

export function ExhibitionPreviousSection({ exhibitions }: ExhibitionPreviousSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const { openPhoto } = useExhibitionLightbox();
  const { previous } = pl.exhibition;

  const visible = exhibitions.slice(0, VISIBLE_COUNT);
  const collapsed = exhibitions.slice(VISIBLE_COUNT);
  const rows = expanded ? exhibitions : visible;

  return (
    <section
      id={previous.sectionId}
      className="exhibition-section scroll-mt-space-6"
      aria-labelledby="exhibition-previous-heading"
    >
      <h2
        id="exhibition-previous-heading"
        className="font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2 mb-space-5"
      >
        {previous.heading}
      </h2>

      <p className="exhibition-section-lead mb-space-5">{previous.lead}</p>

      <ul className="exhibition-previous-list">
        {rows.map((exhibition) => {
          const hasPhotos = exhibition.photos.length > 0;
          const newsHref = exhibition.newsSlug ? `/aktualnosci/${exhibition.newsSlug}` : undefined;
          const headingId = `wystawa-${exhibition.year}`;

          return (
            <li
              key={exhibition.seasonSlug}
              className={newsHref ? "exhibition-previous-item exhibition-previous-item--linked" : "exhibition-previous-item"}
            >
              <div className="exhibition-previous-row">
                {newsHref ? (
                  <Link
                    href={newsHref}
                    className="exhibition-previous-row-link"
                    aria-labelledby={headingId}
                  />
                ) : null}

                <h3 id={headingId} className="exhibition-previous-heading">
                  <span className="exhibition-previous-year">{exhibition.year}</span>
                  <span className="exhibition-previous-title">„{exhibition.title}”</span>
                </h3>

                {hasPhotos ? (
                  <button
                    type="button"
                    className="exhibition-previous-photos"
                    onClick={() => openPhoto(exhibition.photos, 0)}
                  >
                    {previous.photosLink}
                  </button>
                ) : (
                  <span className="exhibition-previous-photos exhibition-previous-photos--empty" />
                )}
              </div>
            </li>
          );
        })}

        {collapsed.length > 0 && !expanded ? (
          <li className="exhibition-previous-expand-row">
            <span className="exhibition-previous-expand-label">
              <span className="md:hidden">
                {previous.expandLabelShort.replace("{range}", formatCollapsedRange(collapsed))}
              </span>
              <span className="hidden md:inline">
                {previous.expandLabel.replace("{range}", formatCollapsedRange(collapsed))}
              </span>
            </span>
            <button
              type="button"
              className="exhibition-previous-expand"
              aria-expanded={expanded}
              onClick={() => setExpanded(true)}
            >
              {previous.expandAction}
              <ChevronDownIcon />
            </button>
          </li>
        ) : null}
      </ul>
    </section>
  );
}
