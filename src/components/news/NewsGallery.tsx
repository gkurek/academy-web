"use client";

import { useCallback, useState } from "react";

import { PhotoGrid } from "@/components/text/PhotoGrid";
import { WorkshopLightbox } from "@/components/text/WorkshopLightbox";
import type { Image as ContentImage } from "@/content/types";
import { pl } from "@/i18n/pl";

export interface NewsGalleryProps {
  images: ContentImage[];
}

export function NewsGallery({ images }: NewsGalleryProps) {
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
      return (current - 1 + images.length) % images.length;
    });
  }, [images.length]);

  const handleNext = useCallback(() => {
    setLightboxIndex((current) => {
      if (current === null) {
        return null;
      }
      return (current + 1) % images.length;
    });
  }, [images.length]);

  if (images.length === 0) {
    return null;
  }

  return (
    <section className="news-gallery" aria-labelledby="news-gallery-heading">
      <h2 id="news-gallery-heading" className="news-gallery-heading">
        {pl.news.galleryHeading}
      </h2>
      <PhotoGrid
        photos={images}
        mobileCaption={pl.news.galleryMobileCaption}
        onOpen={handleOpen}
      />
      <WorkshopLightbox
        photos={images}
        index={lightboxIndex}
        onPrev={handlePrev}
        onNext={handleNext}
        onClose={handleClose}
      />
    </section>
  );
}
