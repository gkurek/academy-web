"use client";

import { useCallback, useState } from "react";

import { PhotoGrid } from "@/components/text/PhotoGrid";
import { WorkshopLightbox } from "@/components/text/WorkshopLightbox";
import type { Image as ContentImage } from "@/content/types";

export interface WorkshopGallerySectionProps {
  heading: string;
  mobileCaption: string;
  photos: ContentImage[];
}

export function WorkshopGallerySection({
  heading,
  mobileCaption,
  photos,
}: WorkshopGallerySectionProps) {
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

  return (
    <section id="ze-wspolnej-pracy" className="workshop-section scroll-mt-space-6">
      <h2 className="workshop-section-heading">{heading}</h2>
      <PhotoGrid photos={photos} mobileCaption={mobileCaption} onOpen={handleOpen} />
      <WorkshopLightbox
        photos={photos}
        index={lightboxIndex}
        onPrev={handlePrev}
        onNext={handleNext}
        onClose={handleClose}
      />
    </section>
  );
}
