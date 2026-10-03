"use client";

import { useRef, useState } from "react";

import { IconGrid } from "@/components/gallery/IconGrid";
import { Lightbox } from "@/components/gallery/Lightbox";
import type { IconWork } from "@/content/types";

export interface FeaturedIconsGalleryProps {
  icons: IconWork[];
}

export function FeaturedIconsGallery({ icons }: FeaturedIconsGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const activeItem = activeIndex !== null ? icons[activeIndex] ?? null : null;

  const goPrev = () => {
    if (activeIndex === null || icons.length === 0) {
      return;
    }
    setActiveIndex((activeIndex - 1 + icons.length) % icons.length);
  };

  const goNext = () => {
    if (activeIndex === null || icons.length === 0) {
      return;
    }
    setActiveIndex((activeIndex + 1) % icons.length);
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
      <IconGrid
        items={icons}
        variant="gallery"
        mobileCount={2}
        eagerCount={2}
        onSelect={handleSelect}
      />
      <Lightbox
        item={activeItem}
        index={activeIndex}
        total={icons.length}
        onPrev={goPrev}
        onNext={goNext}
        onClose={handleClose}
      />
    </>
  );
}
