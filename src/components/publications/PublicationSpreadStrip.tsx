"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

import { TextLink } from "@/components/core/TextLink";
import { ContentLightbox } from "@/components/lightbox/ContentLightbox";
import type { Image as ContentImage } from "@/content/types";
import { pl } from "@/i18n/pl";

export interface PublicationSpreadStripProps {
  spreads: ContentImage[];
  /** Hub shows up to four tiles; album page can pass all spreads. */
  limit?: number;
  columns?: 1 | 3 | 4;
  showMailto?: boolean;
  mailtoHref?: string;
}

export function PublicationSpreadStrip({
  spreads,
  limit,
  columns = 4,
  showMailto = false,
  mailtoHref,
}: PublicationSpreadStripProps) {
  const visibleSpreads = limit ? spreads.slice(0, limit) : spreads;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const labels = pl.publications.lightbox;

  const handleOpen = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const handleClose = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    setLightboxIndex((current) => {
      if (current === null) {
        return null;
      }
      return (current - 1 + visibleSpreads.length) % visibleSpreads.length;
    });
  }, [visibleSpreads.length]);

  const handleNext = useCallback(() => {
    setLightboxIndex((current) => {
      if (current === null) {
        return null;
      }
      return (current + 1) % visibleSpreads.length;
    });
  }, [visibleSpreads.length]);

  if (visibleSpreads.length === 0) {
    return null;
  }

  const gridClass =
    columns === 1
      ? "publication-spread-grid publication-spread-grid-single"
      : columns === 3
        ? "publication-spread-grid publication-spread-grid-album"
        : "publication-spread-grid publication-spread-grid-hub";

  return (
    <div className="publication-spread-strip">
      <ul className={gridClass}>
        {visibleSpreads.map((spread, index) => (
          <li key={spread.src}>
            <button
              type="button"
              className="publication-spread-tile"
              onClick={() => handleOpen(index)}
              aria-label={labels.openSpread.replace("{alt}", spread.alt)}
            >
              <span className="publication-spread-frame">
                <Image
                  src={spread.src}
                  alt={spread.alt}
                  fill
                  sizes={
                    columns === 1
                      ? "100vw"
                      : columns === 3
                        ? "(min-width: 768px) 33vw, 100vw"
                        : "(min-width: 768px) 25vw, 100vw"
                  }
                  className="publication-spread-image"
                />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <ContentLightbox
        photos={visibleSpreads}
        index={lightboxIndex}
        labels={labels}
        dialogClassName="publication-spread-lightbox"
        onPrev={handlePrev}
        onNext={handleNext}
        onClose={handleClose}
        renderExtra={
          showMailto && mailtoHref
            ? () => (
                <TextLink
                  href={mailtoHref}
                  className="mt-space-4 inline-flex min-h-tap-min-mobile-header items-center text-size-body"
                >
                  {pl.publications.orderSpreadMailto}
                </TextLink>
              )
            : undefined
        }
      />
    </div>
  );
}
