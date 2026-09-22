"use client";

import Image from "next/image";
import { useCallback, useState, type ReactNode } from "react";

import { ExhibitionPhotoPlaceholder } from "@/components/exhibition/ExhibitionPhotoPlaceholder";
import { WorkshopLightbox } from "@/components/text/WorkshopLightbox";
import type { Image as ContentImage } from "@/content/types";
import { pl } from "@/i18n/pl";

export interface ExhibitionEditionGalleryProps {
  photos: ContentImage[];
  heroAlt?: string;
  placeholderLabel?: string;
  children?: ReactNode;
}

export function ExhibitionEditionGallery({
  photos,
  heroAlt,
  placeholderLabel,
  children,
}: ExhibitionEditionGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  if (photos.length === 0) {
    return (
      <>
        {placeholderLabel ? (
          <ExhibitionPhotoPlaceholder
            className="exhibition-gallery-placeholder"
            label={placeholderLabel}
          />
        ) : null}
        {children ?? null}
      </>
    );
  }

  const [hero, ...thumbnails] = photos;

  return (
    <>
      <button
        type="button"
        className="exhibition-gallery-hero"
        onClick={() => handleOpen(0)}
        aria-label={pl.workshop.lightbox.openPhoto.replace("{alt}", heroAlt ?? hero.alt)}
      >
        <span className="exhibition-gallery-hero-frame">
          <Image
            src={hero.src}
            alt={heroAlt ?? hero.alt}
            fill
            sizes="(min-width: 768px) 66vw, 100vw"
            className="exhibition-gallery-hero-image"
            priority
          />
        </span>
      </button>

      {children}

      {thumbnails.length > 0 ? (
        <div className="exhibition-gallery">
          <ul className="exhibition-gallery-thumbs" aria-label={pl.exhibition.galleryThumbsAria}>
            {photos.map((photo, index) => (
              <li key={photo.src}>
                <button
                  type="button"
                  className="exhibition-gallery-thumb"
                  onClick={() => handleOpen(index)}
                  aria-label={pl.workshop.lightbox.openPhoto.replace("{alt}", photo.alt)}
                >
                  <span className="exhibition-gallery-thumb-frame">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 768px) 12vw, 30vw"
                      className="exhibition-gallery-thumb-image"
                    />
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="exhibition-gallery-caption">{pl.exhibition.galleryCaption}</p>
        </div>
      ) : null}

      <WorkshopLightbox
        photos={photos}
        index={lightboxIndex}
        onPrev={handlePrev}
        onNext={handleNext}
        onClose={handleClose}
      />
    </>
  );
}
