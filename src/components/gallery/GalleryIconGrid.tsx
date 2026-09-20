"use client";

import { useRef, useState } from "react";

import { GallerySection } from "@/components/gallery/GallerySection";
import { Lightbox } from "@/components/gallery/Lightbox";
import type { IconSectionId } from "@/content/icons";
import type { IconWork } from "@/content/types";

/** Everything a section needs to render, prepared on the server. */
export interface GallerySectionData {
  id: IconSectionId;
  title: string;
  works: IconWork[];
  names?: string[];
}

export interface GalleryIconGridProps {
  sections: GallerySectionData[];
  /** Serialized filter state — when it changes, an open lightbox closes. */
  listKey: string;
}

/** Leading tiles of the first section loaded eagerly: the first row on desktop, two rows on mobile. */
const EAGER_TILE_COUNT = 4;

export function GalleryIconGrid({ sections, listKey }: GalleryIconGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [storedListKey, setStoredListKey] = useState(listKey);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  if (listKey !== storedListKey) {
    setStoredListKey(listKey);
    setActiveIndex(null);
  }

  // One sequence for the lightbox, in visual order (EJK → students), matching the active filter.
  const items = sections.flatMap((section) => section.works);
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

  // Each section starts where the previous one ended in the sequence.
  const startIndexes = sections.map((_, index) =>
    sections.slice(0, index).reduce((total, section) => total + section.works.length, 0)
  );

  return (
    <>
      {sections.map((section, index) => (
        <GallerySection
          key={section.id}
          id={section.id}
          title={section.title}
          items={section.works}
          startIndex={startIndexes[index]}
          eagerCount={index === 0 ? EAGER_TILE_COUNT : 0}
          onSelect={handleSelect}
          names={section.names}
          className={
            index > 0
              ? "mt-section-gap-mobile md:mt-section-gap border-t border-line-gold pt-space-5 md:pt-space-6"
              : undefined
          }
        />
      ))}
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
