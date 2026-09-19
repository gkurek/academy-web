"use client";

import { useState } from "react";

import { IconGrid } from "@/components/gallery/IconGrid";
import { Lightbox } from "@/components/gallery/Lightbox";
import type { IconWork } from "@/content/types";

export interface GalleryIconGridProps {
  items: IconWork[];
  /** Serialized filter state — when it changes, an open lightbox closes. */
  listKey: string;
}

export function GalleryIconGrid({ items, listKey }: GalleryIconGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [storedListKey, setStoredListKey] = useState(listKey);

  if (listKey !== storedListKey) {
    setStoredListKey(listKey);
    setActiveIndex(null);
  }

  const activeItem = activeIndex !== null ? items[activeIndex] ?? null : null;

  const goPrev = () => {
    if (activeIndex === null || items.length === 0) {
      return;
    }
    setActiveIndex((activeIndex - 1 + items.length) % items.length);
  };

  const goNext = () => {
    if (activeIndex === null || items.length === 0) {
      return;
    }
    setActiveIndex((activeIndex + 1) % items.length);
  };

  return (
    <>
      <IconGrid
        items={items}
        variant="gallery"
        onSelect={(index) => setActiveIndex(index)}
      />
      <Lightbox
        item={activeItem}
        index={activeIndex}
        total={items.length}
        onPrev={goPrev}
        onNext={goNext}
        onClose={() => setActiveIndex(null)}
      />
    </>
  );
}
