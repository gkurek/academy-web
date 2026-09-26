"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

import { TextLink } from "@/components/core/TextLink";
import { LightboxDialogShell } from "@/components/lightbox/LightboxDialogShell";
import { LightboxImage } from "@/components/lightbox/LightboxImage";
import { useLightboxDialog } from "@/components/lightbox/useLightboxDialog";
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

  const activeSpread = lightboxIndex !== null ? visibleSpreads[lightboxIndex] : null;
  const isOpen = activeSpread !== null && lightboxIndex !== null;
  const positionLabel = lightboxIndex !== null
    ? labels.position
        .replace("{index}", String(lightboxIndex + 1))
        .replace("{total}", String(visibleSpreads.length))
    : "";

  const {
    dialogRef,
    handleDialogClick,
    handlePointerDown,
    handlePointerUp,
    handlePointerCancel,
  } = useLightboxDialog({ isOpen, onClose: handleClose, onPrev: handlePrev, onNext: handleNext });

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

      <LightboxDialogShell
        dialogRef={dialogRef}
        isOpen={isOpen}
        ariaLabel={isOpen && activeSpread ? activeSpread.alt : undefined}
        dialogClassName="publication-spread-lightbox"
        labels={labels}
        positionLabel={positionLabel}
        onClose={handleClose}
        onPrev={handlePrev}
        onNext={handleNext}
        onDialogClick={handleDialogClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        image={
          activeSpread ? (
            <LightboxImage
              src={activeSpread.src}
              alt={activeSpread.alt}
              width={activeSpread.width}
              height={activeSpread.height}
            />
          ) : null
        }
        meta={
          activeSpread ? (
            <div className="publication-spread-lightbox-meta">
              <p className="publication-spread-lightbox-position">{positionLabel}</p>
              {activeSpread.caption ? (
                <p className="publication-spread-lightbox-caption">{activeSpread.caption}</p>
              ) : null}
              {showMailto && mailtoHref ? (
                <TextLink href={mailtoHref} className="publication-spread-lightbox-order">
                  {pl.publications.orderSpreadMailto}
                </TextLink>
              ) : null}
            </div>
          ) : null
        }
      />
    </div>
  );
}
