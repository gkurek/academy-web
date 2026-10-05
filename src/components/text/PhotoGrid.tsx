"use client";

import Image from "next/image";

import {
  GalleryTileHoverOverlay,
  galleryTileButtonClass,
  galleryTileFrameClass,
} from "@/components/gallery/galleryJustifiedShared";
import type { Image as ContentImage } from "@/content/types";
import { pl } from "@/i18n/pl";

export interface PhotoGridProps {
  photos: ContentImage[];
  mobileCaption: string;
  onOpen: (index: number) => void;
}

export function PhotoGrid({ photos, mobileCaption, onOpen }: PhotoGridProps) {
  return (
    <div className="photo-grid">
      <ul className="photo-grid-list">
        {photos.map((photo, index) => (
          <li key={photo.src} className="photo-grid-item">
            <button
              type="button"
              className={[galleryTileButtonClass, "photo-grid-tile"].join(" ")}
              onClick={() => onOpen(index)}
              aria-label={pl.lightbox.openPhoto.replace("{alt}", photo.alt)}
            >
              <span className={[galleryTileFrameClass, "block w-full"].join(" ")}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="photo-grid-image"
                />
                <GalleryTileHoverOverlay />
              </span>
            </button>
            {photo.caption ? (
              <p className="photo-grid-caption">{photo.caption}</p>
            ) : (
              <p className="photo-grid-caption photo-grid-caption-empty" aria-hidden="true">
                {"\u00a0"}
              </p>
            )}
          </li>
        ))}
      </ul>
      <p className="photo-grid-mobile-caption">{mobileCaption}</p>
    </div>
  );
}
