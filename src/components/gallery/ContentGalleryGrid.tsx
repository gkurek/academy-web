"use client";

import Image from "next/image";
import { useMemo } from "react";

import {
  GalleryTileHoverOverlay,
  galleryTileButtonClass,
  galleryTileFrameClass,
  isJustifiedSingleColumn,
  justifiedImageSizes,
  useGalleryContainerWidth,
  computeJustifiedGalleryRows,
} from "@/components/gallery/galleryJustifiedShared";
import type { Image as ContentImage } from "@/content/types";

export type ContentGalleryGridCaptionMode = "none" | "always" | "desktop-only";

export interface ContentGalleryGridProps {
  photos: ContentImage[];
  onSelect: (index: number) => void;
  openPhotoAriaLabel: (photo: ContentImage) => string;
  captionMode?: ContentGalleryGridCaptionMode;
  /** Shown below the grid on mobile when `captionMode` is `desktop-only`. */
  mobileCollectiveCaption?: string;
  eagerCount?: number;
}

function GalleryTileCaption({ caption, className }: { caption: string; className?: string }) {
  return (
    <figcaption
      className={[
        "font-serif text-size-body text-text-tertiary text-center pb-space-5 md:pb-space-7",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {caption}
    </figcaption>
  );
}

export function ContentGalleryGrid({
  photos,
  onSelect,
  openPhotoAriaLabel,
  captionMode = "desktop-only",
  mobileCollectiveCaption,
  eagerCount = 0,
}: ContentGalleryGridProps) {
  const { ref, width: containerWidth } = useGalleryContainerWidth<HTMLDivElement>();
  const aspectRatios = useMemo(
    () => photos.map((photo) => photo.width / photo.height),
    [photos],
  );
  const singleColumn = isJustifiedSingleColumn(containerWidth);

  const rows = useMemo(
    () => (containerWidth > 0 ? computeJustifiedGalleryRows(aspectRatios, containerWidth) : []),
    [aspectRatios, containerWidth],
  );

  const showPerTileCaption = captionMode !== "none";
  const hideCaptionOnMobile = captionMode === "desktop-only";

  return (
    <div className="content-gallery-grid">
      <div ref={ref} className="w-full">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="mb-space-3 flex flex-wrap justify-center gap-x-space-4 md:gap-x-icon-grid-gap last:mb-0"
          >
            {row.tiles.map((tile) => {
              const photo = photos[tile.index];

              return (
                <figure key={photo.src} className="shrink-0" style={{ width: tile.width }}>
                  <button
                    type="button"
                    onClick={() => onSelect(tile.index)}
                    aria-label={openPhotoAriaLabel(photo)}
                    className={[galleryTileButtonClass, "h-full w-full"].join(" ")}
                    style={{ height: tile.height }}
                  >
                    <div className={[galleryTileFrameClass, "h-full w-full"].join(" ")}>
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        width={photo.width}
                        height={photo.height}
                        sizes={justifiedImageSizes(singleColumn)}
                        loading={tile.index < eagerCount ? "eager" : undefined}
                        className="h-full w-full object-cover"
                      />
                      <GalleryTileHoverOverlay />
                    </div>
                  </button>
                  {showPerTileCaption && photo.caption ? (
                    <GalleryTileCaption
                      caption={photo.caption}
                      className={[
                        "mt-space-2 md:mt-space-3",
                        hideCaptionOnMobile ? "hidden md:block" : undefined,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    />
                  ) : null}
                </figure>
              );
            })}
          </div>
        ))}
      </div>
      {mobileCollectiveCaption && hideCaptionOnMobile ? (
        <p className="content-gallery-collective-caption md:hidden">{mobileCollectiveCaption}</p>
      ) : null}
    </div>
  );
}
