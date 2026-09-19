"use client";

import { useRef, useState } from "react";

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
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

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

  const handleSelect = (index: number, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger;
    setActiveIndex(index);
  };

  const handleClose = () => {
    if (activeIndex === null) {
      return;
    }
    setActiveIndex(null);
    const trigger = lastTriggerRef.current;
    if (trigger) {
      requestAnimationFrame(() => trigger.focus());
    }
  };

  return (
    <>
      <IconGrid items={items} variant="gallery" onSelect={handleSelect} />
      <Lightbox
        item={activeItem}
        index={activeIndex}
        total={items.length}
        onPrev={goPrev}
        onNext={goNext}
        onClose={handleClose}
      />
    </>
  );
}
