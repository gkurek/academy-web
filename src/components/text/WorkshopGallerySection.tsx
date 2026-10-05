"use client";

import { Lightbox } from "@/components/lightbox/Lightbox";
import { useLightboxIndex } from "@/components/lightbox/useLightboxIndex";
import { PhotoGrid } from "@/components/text/PhotoGrid";
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
  const lightbox = useLightboxIndex(photos.length);

  return (
    <section id="ze-wspolnej-pracy" className="workshop-section scroll-mt-space-6">
      <h2 className="workshop-section-heading">{heading}</h2>
      <PhotoGrid photos={photos} mobileCaption={mobileCaption} onOpen={lightbox.open} />
      <Lightbox
        photos={photos}
        index={lightbox.index}
        onPrev={lightbox.prev}
        onNext={lightbox.next}
        onClose={lightbox.close}
      />
    </section>
  );
}
