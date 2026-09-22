"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

import { ExhibitionPhotoPlaceholder } from "@/components/exhibition/ExhibitionPhotoPlaceholder";
import { WorkshopLightbox } from "@/components/text/WorkshopLightbox";
import type { ExhibitionEdition, Image as ContentImage } from "@/content/types";
import { pl } from "@/i18n/pl";

export interface ExhibitionEditionCardProps {
  edition: ExhibitionEdition;
  photos: ContentImage[];
}

const EDITION_THUMB_COUNT = 3;

function formatEditionMeta(edition: ExhibitionEdition): string | undefined {
  const parts: string[] = [];

  if (edition.subtitle) {
    parts.push(`„${edition.subtitle}”`);
  }

  if (edition.iconCount) {
    parts.push(
      pl.exhibition.previousEdition.iconCount.replace("{count}", String(edition.iconCount)),
    );
  }

  return parts.length > 0 ? parts.join(" · ") : undefined;
}

export function ExhibitionEditionCard({ edition, photos }: ExhibitionEditionCardProps) {
  const hasGallery = photos.length > 0;
  const meta = formatEditionMeta(edition);
  const thumbSlots = Array.from({ length: EDITION_THUMB_COUNT }, (_, index) => photos[index] ?? null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleOpen = useCallback(() => {
    setLightboxIndex(0);
  }, []);

  const handleClose = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    setLightboxIndex((current) => {
      if (current === null) {
        return null;
      }
      return (current - 1 + photos.length) % photos.length;
    });
  }, [photos.length]);

  const handleNext = useCallback(() => {
    setLightboxIndex((current) => {
      if (current === null) {
        return null;
      }
      return (current + 1) % photos.length;
    });
  }, [photos.length]);

  return (
    <li className="exhibition-edition-card">
      <span className="exhibition-edition-year">{edition.year}</span>
      <div className="exhibition-edition-card-text">
        {meta ? <p className="exhibition-edition-meta">{meta}</p> : null}
        {hasGallery ? (
          <button type="button" className="exhibition-edition-gallery-trigger" onClick={handleOpen}>
            {pl.exhibition.previousEdition.viewPhotos}
          </button>
        ) : null}
      </div>
      <ul className="exhibition-edition-thumbs" aria-hidden="true">
        {thumbSlots.map((photo, index) => (
          <li key={photo?.src ?? `${edition.year}-thumb-${index}`}>
            {photo ? (
              <span className="exhibition-edition-thumb-frame">
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  sizes="82px"
                  className="exhibition-edition-thumb-image"
                />
              </span>
            ) : (
              <ExhibitionPhotoPlaceholder
                className="exhibition-edition-thumb-placeholder"
                label={pl.exhibition.previousEdition.photoThumbPlaceholder}
              />
            )}
          </li>
        ))}
      </ul>

      {hasGallery ? (
        <WorkshopLightbox
          photos={photos}
          index={lightboxIndex}
          onPrev={handlePrev}
          onNext={handleNext}
          onClose={handleClose}
        />
      ) : null}
    </li>
  );
}
