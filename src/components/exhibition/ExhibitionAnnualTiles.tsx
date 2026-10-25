"use client";

import Image from "next/image";

import {
  GalleryTileHoverOverlay,
  galleryTileButtonClass,
} from "@/components/gallery/galleryJustifiedShared";
import { useLightbox } from "@/components/lightbox/LightboxProvider";
import type { Image as ContentImage } from "@/content/types";
import { pl } from "@/i18n/pl";

export interface ExhibitionAnnualTilesProps {
  /** Curated tiles from `content/exhibition/page.mdx` (K-154); only the first four are shown. */
  photos: ContentImage[];
  /** Lightbox list for the tiles: the tiles first, then the rest of the gallery. */
  gallery: ContentImage[];
}

const TILE_COUNT = 4;

export function ExhibitionAnnualTiles({ photos, gallery }: ExhibitionAnnualTilesProps) {
  const { openPhoto } = useLightbox();
  const tiles = photos.slice(0, TILE_COUNT);

  if (tiles.length === 0) {
    return null;
  }

  return (
    <div className="exhibition-annual-tiles">
      <div className="exhibition-annual-tiles-row">
        {tiles.map((photo, index) => (
          <figure key={photo.src} className="exhibition-frame exhibition-frame--tile exhibition-annual-tile">
            <button
              type="button"
              onClick={() => openPhoto(gallery, index)}
              aria-label={pl.lightbox.openPhoto.replace("{alt}", photo.alt)}
              className={[galleryTileButtonClass, "w-full"].join(" ")}
            >
              <span className="exhibition-frame-media">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="exhibition-frame-image"
                />
                <GalleryTileHoverOverlay />
              </span>
            </button>
          </figure>
        ))}
      </div>
    </div>
  );
}
