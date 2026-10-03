"use client";

import Image from "next/image";
import { useMemo } from "react";

import {
  GalleryTileHoverOverlay,
  JUSTIFIED_GAP_BREAKPOINT,
  computeJustifiedGalleryRows,
  galleryTileButtonClass,
  galleryTileFrameClass,
  isJustifiedSingleColumn,
  justifiedImageSizes,
  useGalleryContainerWidth,
} from "@/components/gallery/galleryJustifiedShared";
import type { IconWork } from "@/content/types";
import { formatIconCaption } from "@/i18n/formatIconCaption";

export interface IconGridProps {
  items: IconWork[];
  /** On mobile, show only the first N items — used for the home page's
   * curated "Wybrane ikony" preview. Omit to show all items. */
  mobileCount?: number;
  /** Gallery variant: clickable tiles that invoke onSelect (opens the lightbox). */
  variant?: "preview" | "gallery";
  /** Gallery variant: how many leading tiles load eagerly (the first row, above the fold). */
  eagerCount?: number;
  onSelect?: (index: number, trigger: HTMLButtonElement) => void;
}

/** Home preview (K-31): fixed-height tile, image contained. Read-only. */
function PreviewGrid({ items, mobileCount }: Pick<IconGridProps, "items" | "mobileCount">) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-space-4 md:gap-icon-grid-gap">
      {items.map((item, index) => {
        const hiddenOnMobile = mobileCount != null && index >= mobileCount;

        return (
          <figure key={item.slug} className={hiddenOnMobile ? "hidden md:block" : undefined}>
            <div className="flex h-icon-grid-h-m md:h-icon-grid-h w-full items-center justify-center bg-surface-tile">
              <Image
                src={item.image.src}
                alt={item.image.alt}
                width={item.image.width}
                height={item.image.height}
                sizes="(min-width: 768px) 25vw, 50vw"
                className="h-full w-full object-contain"
              />
            </div>
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

function GalleryTileCaption({ title, className }: { title: string; className?: string }) {
  return (
    <figcaption
      className={[
        "font-serif text-size-body text-text-tertiary text-center pb-space-5 md:pb-space-7",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {title}
    </figcaption>
  );
}

/**
 * Gallery justified rows (K-40): FooGallery algorithm — equal height per row,
 * variable width from photo ratio, rows fill the container, smart last row; captions below each tile.
 */
function GalleryJustifiedGrid({
  items,
  mobileCount,
  eagerCount = 0,
  onSelect,
}: Pick<IconGridProps, "items" | "mobileCount" | "eagerCount" | "onSelect">) {
  const { ref, width: containerWidth } = useGalleryContainerWidth<HTMLDivElement>();
  const isNarrowMobile =
    mobileCount != null && containerWidth > 0 && containerWidth < JUSTIFIED_GAP_BREAKPOINT;
  const layoutItems = isNarrowMobile ? items.slice(0, mobileCount) : items;

  const aspectRatios = useMemo(
    () => layoutItems.map((item) => item.image.width / item.image.height),
    [layoutItems],
  );
  const singleColumn = isJustifiedSingleColumn(containerWidth);

  const rows = useMemo(
    () => (containerWidth > 0 ? computeJustifiedGalleryRows(aspectRatios, containerWidth) : []),
    [aspectRatios, containerWidth],
  );

  return (
    <div ref={ref} className="w-full">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="mb-space-3 flex flex-wrap justify-center gap-x-space-4 md:gap-x-icon-grid-gap last:mb-0"
        >
          {row.tiles.map((tile) => {
            const item = layoutItems[tile.index];

            return (
              <figure key={item.slug} className="shrink-0" style={{ width: tile.width }}>
                <button
                  type="button"
                  onClick={(event) => onSelect?.(tile.index, event.currentTarget)}
                  className={[galleryTileButtonClass, "h-full w-full"].join(" ")}
                  style={{ height: tile.height }}
                >
                  <div className={[galleryTileFrameClass, "h-full w-full"].join(" ")}>
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      width={item.image.width}
                      height={item.image.height}
                      sizes={justifiedImageSizes(singleColumn)}
                      loading={tile.index < eagerCount ? "eager" : undefined}
                      className="h-full w-full object-cover"
                    />
                    <GalleryTileHoverOverlay />
                  </div>
                </button>
                <GalleryTileCaption title={item.title} className="mt-space-2 md:mt-space-3" />
              </figure>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/**
 * Icon grid — preview on home (read-only) or gallery on /ikony (clickable tiles).
 */
export function IconGrid({
  items,
  mobileCount,
  variant = "preview",
  eagerCount,
  onSelect,
}: IconGridProps) {
  if (variant === "gallery") {
    return (
      <GalleryJustifiedGrid
        items={items}
        mobileCount={mobileCount}
        eagerCount={eagerCount}
        onSelect={onSelect}
      />
    );
  }

  return <PreviewGrid items={items} mobileCount={mobileCount} />;
}
