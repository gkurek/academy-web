"use client";

import Image from "next/image";
import { useCallback, useRef, useState, type RefObject } from "react";

import { WorkshopLightbox } from "@/components/text/WorkshopLightbox";
import type { NewsLayout } from "@/content/types";
import type { Image as ContentImage } from "@/content/types";
import { pl } from "@/i18n/pl";

const GALLERY_VISIBLE_CAP = 12;

export interface NewsGalleryProps {
  images: ContentImage[];
  layout: NewsLayout;
  showHeading?: boolean;
}

function formatEnlargeAria(index: number, total: number): string {
  return pl.news.enlargePhotoAria
    .replace("{n}", String(index + 1))
    .replace("{total}", String(total));
}

function formatShowAllLabel(count: number): string {
  return pl.news.showAllGallery.replace("{count}", String(count));
}

function NewsGalleryZoomIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15 L20 20" />
    </svg>
  );
}

type NewsGalleryTileProps = {
  photo: ContentImage;
  index: number;
  total: number;
  onOpen: (index: number) => void;
  buttonRef?: RefObject<HTMLButtonElement | null>;
  variant: "single" | "row" | "grid";
  flexGrow?: number;
};

function NewsGalleryTile({
  photo,
  index,
  total,
  onOpen,
  buttonRef,
  variant,
  flexGrow,
}: NewsGalleryTileProps) {
  const style = flexGrow !== undefined ? { flex: `${flexGrow} 1 0` } : undefined;

  return (
    <li
      className={[
        "news-gallery-item",
        variant === "single" ? "news-gallery-item-single" : "",
        variant === "row" ? "news-gallery-item-row" : "",
        variant === "grid" ? "news-gallery-item-grid" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      <button
        ref={buttonRef}
        type="button"
        className="news-gallery-tile"
        onClick={() => onOpen(index)}
        aria-label={formatEnlargeAria(index, total)}
      >
        <span className="news-gallery-tile-frame">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes={
              variant === "grid"
                ? "(min-width: 768px) 25vw, 50vw"
                : "(min-width: 768px) 50vw, 100vw"
            }
            className="news-gallery-tile-image"
          />
          <span className="news-gallery-tile-zoom" aria-hidden="true">
            <NewsGalleryZoomIcon />
          </span>
        </span>
      </button>
    </li>
  );
}

export function NewsGallery({ images, layout, showHeading = false }: NewsGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const expandFocusRef = useRef<HTMLButtonElement>(null);

  const handleOpen = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const handleClose = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    setLightboxIndex((current) => {
      if (current === null) {
        return null;
      }
      return (current - 1 + images.length) % images.length;
    });
  }, [images.length]);

  const handleNext = useCallback(() => {
    setLightboxIndex((current) => {
      if (current === null) {
        return null;
      }
      return (current + 1) % images.length;
    });
  }, [images.length]);

  const handleShowAll = useCallback(() => {
    setShowAll(true);
    requestAnimationFrame(() => {
      expandFocusRef.current?.focus();
    });
  }, []);

  if (images.length === 0) {
    return null;
  }

  const columnModifier =
    layout === "tekst" ? "news-gallery--cols-3" : "news-gallery--cols-4";
  const hiddenCount = Math.max(0, images.length - GALLERY_VISIBLE_CAP);
  const visibleImages = showAll ? images : images.slice(0, GALLERY_VISIBLE_CAP);
  const total = images.length;

  const layoutVariant =
    visibleImages.length === 1 ? "single" : visibleImages.length <= 3 ? "row" : "grid";

  const listClassName = [
    "news-gallery-list",
    layoutVariant === "single" ? "news-gallery-list-single" : "",
    layoutVariant === "row" ? "news-gallery-list-row" : "",
    layoutVariant === "grid" ? `news-gallery-list-grid ${columnModifier}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={["news-gallery", layout === "tekst" ? "news-gallery--narrow" : ""]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby={showHeading ? "news-gallery-heading" : undefined}
    >
      {showHeading ? (
        <h2 id="news-gallery-heading" className="news-gallery-heading">
          {pl.news.galleryHeading}
        </h2>
      ) : null}
      <ul className={listClassName}>
        {visibleImages.map((photo, visibleIndex) => {
          const flexGrow =
            layoutVariant === "row" ? photo.width / photo.height : undefined;
          const isFirstExpanded = showAll && visibleIndex === GALLERY_VISIBLE_CAP;

          return (
            <NewsGalleryTile
              key={photo.src}
              photo={photo}
              index={visibleIndex}
              total={total}
              onOpen={handleOpen}
              variant={layoutVariant}
              flexGrow={flexGrow}
              buttonRef={isFirstExpanded ? expandFocusRef : undefined}
            />
          );
        })}
      </ul>
      {!showAll && hiddenCount > 0 ? (
        <button type="button" className="news-gallery-show-all" onClick={handleShowAll}>
          {formatShowAllLabel(images.length)}
        </button>
      ) : null}
      <p className="news-gallery-mobile-caption">{pl.news.galleryMobileCaption}</p>
      <WorkshopLightbox
        photos={images}
        index={lightboxIndex}
        onPrev={handlePrev}
        onNext={handleNext}
        onClose={handleClose}
      />
    </section>
  );
}
