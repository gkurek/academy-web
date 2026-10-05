"use client";

import { IconGrid } from "@/components/gallery/IconGrid";
import { IconLightbox } from "@/components/gallery/IconLightbox";
import { useLightboxIndex } from "@/components/lightbox/useLightboxIndex";
import type { IconWork } from "@/content/types";

export interface FeaturedIconsGalleryProps {
  icons: IconWork[];
}

/** Curated single-row preview („Wybrane ikony”, order examples): 4 tiles on desktop, 2 below md. */
export function FeaturedIconsGallery({ icons }: FeaturedIconsGalleryProps) {
  const lightbox = useLightboxIndex(icons.length);

  return (
    <>
      <IconGrid items={icons} mobileCount={2} eagerCount={2} fillLastRow onSelect={lightbox.open} />
      <IconLightbox
        items={icons}
        index={lightbox.index}
        onPrev={lightbox.prev}
        onNext={lightbox.next}
        onClose={lightbox.close}
      />
    </>
  );
}
