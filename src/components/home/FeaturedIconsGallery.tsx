"use client";

import { IconGrid } from "@/components/gallery/IconGrid";
import { IconLightbox } from "@/components/gallery/IconLightbox";
import { useLightboxIndex } from "@/components/lightbox/useLightboxIndex";
import type { IconWork } from "@/content/types";

export interface FeaturedIconsGalleryProps {
  icons: IconWork[];
}

/** Curated preview („Wybrane ikony”, order examples): one row on desktop, 2×2 grid below md (V3-16). */
export function FeaturedIconsGallery({ icons }: FeaturedIconsGalleryProps) {
  const lightbox = useLightboxIndex(icons.length);

  return (
    <>
      <IconGrid items={icons} mobileCount={4} eagerCount={4} fillLastRow onSelect={lightbox.open} />
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
