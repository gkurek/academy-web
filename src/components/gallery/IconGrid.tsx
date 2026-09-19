"use client";

import Image from "next/image";

import type { IconWork } from "@/content/types";
import { formatIconCaption } from "@/i18n/formatIconCaption";

export interface IconGridProps {
  items: IconWork[];
  /** On mobile, show only the first N items — used for the home page's
   * curated "Wybrane ikony" preview. Omit to show all items. */
  mobileCount?: number;
  /** Gallery variant: clickable tiles that invoke onSelect (lightbox in chunk 3). */
  variant?: "preview" | "gallery";
  onSelect?: (index: number, trigger: HTMLButtonElement) => void;
}

function TileImage({ item, isGallery }: { item: IconWork; isGallery: boolean }) {
  const tileClass = isGallery
    ? "flex h-gallery-grid-h w-full items-center justify-center bg-surface-tile"
    : "flex h-icon-grid-h-m md:h-icon-grid-h w-full items-center justify-center bg-surface-tile";

  return (
    <div className={tileClass}>
      <Image
        src={item.image.src}
        alt={item.image.alt}
        width={item.image.width}
        height={item.image.height}
        sizes="(min-width: 768px) 25vw, 50vw"
        className="h-full w-full object-contain"
      />
    </div>
  );
}

/**
 * Icon grid — preview on home (read-only) or gallery on /ikony (clickable tiles).
 */
export function IconGrid({ items, mobileCount, variant = "preview", onSelect }: IconGridProps) {
  const isGallery = variant === "gallery";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-space-4 md:gap-icon-grid-gap">
      {items.map((item, index) => {
        const hiddenOnMobile = mobileCount != null && index >= mobileCount;

        return (
          <figure
            key={item.slug}
            className={hiddenOnMobile ? "hidden md:block" : undefined}
          >
            {isGallery ? (
              <button
                type="button"
                onClick={(event) => onSelect?.(index, event.currentTarget)}
                className="block w-full cursor-pointer border-0 bg-transparent p-0 text-left"
              >
                <TileImage item={item} isGallery={isGallery} />
              </button>
            ) : (
              <TileImage item={item} isGallery={isGallery} />
            )}
            <figcaption className="font-serif text-size-body text-text-tertiary mt-space-2 md:mt-space-3">
              <span className="md:hidden">{item.title}</span>
              <span className="hidden md:inline">{formatIconCaption(item)}</span>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
