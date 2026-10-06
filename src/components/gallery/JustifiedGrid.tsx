"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

import {
  GalleryTileHoverOverlay,
  galleryTileButtonClass,
  galleryTileFrameClass,
} from "@/components/gallery/galleryJustifiedShared";
import { justifyGalleryRows } from "@/components/gallery/justifyGalleryRows";
import type { Image as ContentImage } from "@/content/types";

export interface JustifiedGridTile {
  key: string;
  image: ContentImage;
  /** Serif caption below the tile; omitted when undefined. */
  caption?: string;
  /** Accessible name of the tile button (what the lightbox will show). */
  label: string;
}

export interface JustifiedGridProps {
  tiles: JustifiedGridTile[];
  onSelect: (index: number) => void;
  /** Leading tiles that load eagerly (the first row, above the fold). */
  eagerCount?: number;
  /** Stretch the last row to the container width (single-row previews). Default: FooGallery smart last row. */
  fillLastRow?: boolean;
  /** Below md show only the first N tiles (home „Wybrane ikony”). */
  mobileCount?: number;
}

/**
 * Row grouping happens once, on the server, for the desktop content width at the 1440 px design
 * viewport (--content-max 1180 minus two page margins). CSS then turns each tile's photo ratio into
 * its share of the row (flex-grow), so the row height follows the real container with no measurement
 * in JS — see `.justified-grid` in globals.css. FooGallery settings from akademiaikony.pl (K-40 B).
 */
const DESKTOP_LAYOUT_WIDTH = 1180 - 2 * 56;
const DESKTOP_TARGET_ROW_HEIGHT = 300;
const DESKTOP_MAX_ROW_HEIGHT = 400;
const DESKTOP_GAP = 22;
const DESKTOP_MAX_TILES_PER_ROW = 4;

const tileImageSizes =
  "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw";

const captionClass =
  "font-serif text-size-body text-text-tertiary text-center mt-space-2 md:mt-space-3 pb-space-5 md:pb-space-7";

export function JustifiedGrid({
  tiles,
  onSelect,
  eagerCount = 0,
  fillLastRow = false,
  mobileCount,
}: JustifiedGridProps) {
  const rows = justifyGalleryRows(
    tiles.map((tile) => tile.image.width / tile.image.height),
    {
      containerWidth: DESKTOP_LAYOUT_WIDTH,
      targetRowHeight: DESKTOP_TARGET_ROW_HEIGHT,
      maxRowHeight: DESKTOP_MAX_ROW_HEIGHT,
      gap: DESKTOP_GAP,
      lastRowSmart: !fillLastRow,
      maxTilesPerRow: DESKTOP_MAX_TILES_PER_ROW,
    },
  );

  return (
    <div className="justified-grid">
      {fillLastRow ? null : <span aria-hidden="true" className="justified-grid-filler" />}
      {rows.map((row, rowIndex) => {
        const isSmartLastRow = !fillLastRow && rowIndex === rows.length - 1;

        return (
          <div
            key={rowIndex}
            className={
              isSmartLastRow ? "justified-grid-row justified-grid-row--smart-last" : "justified-grid-row"
            }
          >
            {row.tiles.map(({ index }) => {
              const tile = tiles[index];
              const hiddenOnMobile = mobileCount != null && index >= mobileCount;
              const tileStyle = {
                "--tile-ratio": `${tile.image.width} / ${tile.image.height}`,
              } as CSSProperties;

              return (
                <figure
                  key={tile.key}
                  className={hiddenOnMobile ? "justified-grid-tile hidden md:block" : "justified-grid-tile"}
                  style={tileStyle}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(index)}
                    aria-label={tile.label}
                    className={[galleryTileButtonClass, "w-full"].join(" ")}
                  >
                    <div className={[galleryTileFrameClass, "justified-grid-frame"].join(" ")}>
                      <Image
                        src={tile.image.src}
                        alt={tile.image.alt}
                        width={tile.image.width}
                        height={tile.image.height}
                        sizes={tileImageSizes}
                        loading={index < eagerCount ? "eager" : undefined}
                        className="justified-grid-image"
                      />
                      <GalleryTileHoverOverlay />
                    </div>
                  </button>
                  {tile.caption ? <figcaption className={captionClass}>{tile.caption}</figcaption> : null}
                </figure>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
