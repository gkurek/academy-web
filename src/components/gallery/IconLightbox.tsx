"use client";

import { IconLightboxMeta } from "@/components/gallery/IconLightboxMeta";
import { Lightbox } from "@/components/lightbox/Lightbox";
import type { IconWork } from "@/content/types";

export interface IconLightboxProps {
  items: IconWork[];
  index: number | null;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

/** Icon works in the shared Lightbox: side panel with title, meta fields and the order link. */
export function IconLightbox({ items, index, onPrev, onNext, onClose }: IconLightboxProps) {
  const item = index !== null ? items[index] : undefined;

  return (
    <Lightbox
      photos={items.map((work) => work.image)}
      index={index}
      variant="icons"
      ariaLabel={item?.title}
      meta={({ positionLabel }) =>
        item ? <IconLightboxMeta item={item} positionLabel={positionLabel} /> : null
      }
      onPrev={onPrev}
      onNext={onNext}
      onClose={onClose}
    />
  );
}
