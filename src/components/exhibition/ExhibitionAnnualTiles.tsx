"use client";

import Image from "next/image";

import { useExhibitionLightbox } from "@/components/exhibition/ExhibitionLightboxProvider";
import type { Image as ContentImage } from "@/content/types";
import { pl } from "@/i18n/pl";

export interface ExhibitionAnnualTilesProps {
  photos: ContentImage[];
  placeholderLabels: readonly string[];
  caption?: string;
}

export function ExhibitionAnnualTiles({
  photos,
  placeholderLabels,
  caption,
}: ExhibitionAnnualTilesProps) {
  const { openPhoto } = useExhibitionLightbox();
  const slotCount = 4;
  const slots = Array.from({ length: slotCount }, (_, index) => photos[index] ?? null);

  return (
    <div className="exhibition-annual-tiles">
      <div className="exhibition-annual-tiles-row">
        {slots.map((photo, index) => {
          const placeholderLabel = placeholderLabels[index] ?? placeholderLabels[0] ?? "";
          const key = photo?.src ?? `placeholder-${index}`;

          if (photo) {
            return (
              <figure key={key} className="exhibition-annual-tile">
                <button
                  type="button"
                  className="exhibition-annual-tile-button"
                  onClick={() => openPhoto(photos, index)}
                  aria-label={pl.exhibition.lightbox.openPhoto.replace("{alt}", photo.alt)}
                >
                  <span
                    className="exhibition-frame-media exhibition-frame--tile exhibition-annual-tile-frame"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className="exhibition-frame-image exhibition-annual-tile-image"
                    />
                  </span>
                </button>
              </figure>
            );
          }

          return (
            <figure key={key} className="exhibition-annual-tile">
              <div
                className="exhibition-media-placeholder exhibition-frame-placeholder exhibition-frame--tile exhibition-annual-tile-placeholder"
                aria-hidden="true"
              >
                <p className="exhibition-media-placeholder-text">{placeholderLabel}</p>
              </div>
            </figure>
          );
        })}
      </div>
      {caption && photos.length > 0 ? (
        <p className="exhibition-annual-tiles-caption">
          <button
            type="button"
            className="exhibition-annual-tiles-caption-button"
            onClick={() => openPhoto(photos, 0)}
          >
            {caption}
          </button>
        </p>
      ) : null}
    </div>
  );
}
