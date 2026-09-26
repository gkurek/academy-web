"use client";

import Image from "next/image";

import { ExhibitionPhotoPlaceholder } from "@/components/exhibition/ExhibitionPhotoPlaceholder";
import { useExhibitionLightbox } from "@/components/exhibition/ExhibitionLightboxProvider";
import type { Image as ContentImage } from "@/content/types";
import { pl } from "@/i18n/pl";

export interface ExhibitionPhotoGridProps {
  photos: ContentImage[];
  maxCount?: number;
  layout: "pair" | "quad";
  placeholderLabel?: string;
  showCaptionNote?: boolean;
}

export function ExhibitionPhotoGrid({
  photos,
  maxCount,
  layout,
  placeholderLabel = pl.exhibition.annual.photoPlaceholder,
  showCaptionNote = false,
}: ExhibitionPhotoGridProps) {
  const { openPhoto } = useExhibitionLightbox();
  const visiblePhotos = maxCount ? photos.slice(0, maxCount) : photos;
  const slotCount = layout === "pair" ? 2 : 4;
  const slots = Array.from({ length: slotCount }, (_, index) => visiblePhotos[index] ?? null);

  return (
    <div
      className={
        layout === "pair"
          ? "exhibition-photo-row exhibition-photo-row--pair"
          : "exhibition-photo-row exhibition-photo-row--quad"
      }
    >
      {slots.map((photo, index) => {
        const key = photo?.src ?? `placeholder-${index}`;

        if (photo) {
          return (
            <figure key={key} className="exhibition-photo-cell">
              <button
                type="button"
                className="exhibition-photo-button"
                onClick={() => openPhoto(visiblePhotos, index)}
                aria-label={pl.exhibition.lightbox.openPhoto.replace("{alt}", photo.alt)}
              >
                <span className="exhibition-photo-frame">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes={
                      layout === "pair"
                        ? "(min-width: 768px) 50vw, 100vw"
                        : "(min-width: 768px) 25vw, 50vw"
                    }
                    className="exhibition-photo-image"
                  />
                </span>
              </button>
              {photo.caption ? (
                <figcaption className="exhibition-photo-caption">
                  {photo.caption}
                  {showCaptionNote ? (
                    <>
                      {" "}
                      <span className="exhibition-photo-caption-note">{placeholderLabel}</span>
                    </>
                  ) : null}
                </figcaption>
              ) : null}
            </figure>
          );
        }

        return (
          <figure key={key} className="exhibition-photo-cell">
            <ExhibitionPhotoPlaceholder
              className="exhibition-photo-placeholder"
              label={placeholderLabel}
            />
          </figure>
        );
      })}
    </div>
  );
}
