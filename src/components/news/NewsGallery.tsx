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
  /** Index hidden in gallery from ≥ 1024px (same image may show in column via `columnImageIndex`). */
  hideOnDesktopIndex?: number;
}

function formatEnlargeAria(index: number, total: number): string {
  return pl.news.enlargePhotoAria
    .replace("{n}", String(index + 1))
    .replace("{total}", String(total));
}

function formatShowAllLabel(count: number): string {
  return pl.news.showAllGallery.replace("{count}", String(count));
}

function galleryLayoutVariant(count: number): "single" | "row" | "grid" {
  if (count <= 1) {
    return "single";
  }
  if (count <= 3) {
    return "row";
  }
  return "grid";
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
  rowFlexGrow?: number;
  hiddenOnMobile: boolean;
  hiddenOnLg: boolean;
};

function NewsGalleryTile({
  photo,
  index,
  total,
  onOpen,
  buttonRef,
  rowFlexGrow,
  hiddenOnMobile,
  hiddenOnLg,
}: NewsGalleryTileProps) {
  const style = rowFlexGrow !== undefined ? { flex: `${rowFlexGrow} 1 0` } : undefined;

  return (
    <li
      className={[
        "news-gallery-item",
        hiddenOnMobile ? "news-gallery-item--hidden-mobile" : "",
        hiddenOnLg ? "news-gallery-item--hidden-lg" : "",
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
            sizes="(min-width: 768px) 25vw, 50vw"
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

function maxRenderedIndex(
  total: number,
  showAll: boolean,
  hideOnDesktopIndex?: number,
): number {
  if (showAll) {
    return total - 1;
  }
  const mobileLast = Math.min(GALLERY_VISIBLE_CAP - 1, total - 1);
  const desktopLast =
    hideOnDesktopIndex !== undefined
      ? Math.min(GALLERY_VISIBLE_CAP, total - 1)
      : Math.min(GALLERY_VISIBLE_CAP - 1, total - 1);
  return Math.max(mobileLast, desktopLast);
}

function visibleCountForBreakpoint(
  total: number,
  showAll: boolean,
  hideOnDesktopIndex?: number,
  lg?: boolean,
): number {
  if (showAll) {
    return hideOnDesktopIndex !== undefined && lg ? Math.max(0, total - 1) : total;
  }
  if (lg && hideOnDesktopIndex !== undefined) {
    return Math.min(GALLERY_VISIBLE_CAP, Math.max(0, total - 1));
  }
  return Math.min(GALLERY_VISIBLE_CAP, total);
}

export function NewsGallery({
  images,
  layout,
  showHeading = false,
  hideOnDesktopIndex,
}: NewsGalleryProps) {
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
  const total = images.length;

  const mobileVisible = visibleCountForBreakpoint(total, showAll, hideOnDesktopIndex, false);
  const lgVisible = visibleCountForBreakpoint(total, showAll, hideOnDesktopIndex, true);
  const mobileLayout = galleryLayoutVariant(mobileVisible);
  const lgLayout = galleryLayoutVariant(lgVisible);

  const hiddenOnMobile = total > GALLERY_VISIBLE_CAP;
  const hiddenOnDesktop =
    hideOnDesktopIndex !== undefined
      ? total - 1 > GALLERY_VISIBLE_CAP
      : total > GALLERY_VISIBLE_CAP;
  const showShowAll = !showAll && (hiddenOnMobile || hiddenOnDesktop);

  const lastIndex = maxRenderedIndex(total, showAll, hideOnDesktopIndex);
  const focusIndexForExpand =
    hideOnDesktopIndex !== undefined && hideOnDesktopIndex < GALLERY_VISIBLE_CAP
      ? GALLERY_VISIBLE_CAP + 1
      : GALLERY_VISIBLE_CAP;

  const listClassName = [
    "news-gallery-list",
    `news-gallery-list--mobile-${mobileLayout}`,
    `news-gallery-list--lg-${lgLayout}`,
    mobileLayout === "grid" ? columnModifier : "",
    lgLayout === "grid" ? `${columnModifier} news-gallery-list--lg-grid-cols` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className="news-gallery"
      aria-labelledby={showHeading ? "news-gallery-heading" : undefined}
    >
      {showHeading ? (
        <h2 id="news-gallery-heading" className="news-gallery-heading">
          {pl.news.galleryHeading}
        </h2>
      ) : null}
      <ul className={listClassName}>
        {images.map((photo, index) => {
          if (index > lastIndex) {
            return null;
          }

          const hiddenOnMobileTile = !showAll && index >= GALLERY_VISIBLE_CAP;
          const hiddenOnLgTile =
            (hideOnDesktopIndex !== undefined && index === hideOnDesktopIndex) ||
            (!showAll && index > GALLERY_VISIBLE_CAP);

          const useRowFlex =
            (mobileLayout === "row" && !hiddenOnMobileTile) ||
            (lgLayout === "row" && !hiddenOnLgTile);
          const rowFlexGrow = useRowFlex ? photo.width / photo.height : undefined;
          const isExpandFocus = showAll && index === focusIndexForExpand;

          return (
            <NewsGalleryTile
              key={photo.src}
              photo={photo}
              index={index}
              total={total}
              onOpen={handleOpen}
              hiddenOnMobile={hiddenOnMobileTile}
              hiddenOnLg={hiddenOnLgTile}
              rowFlexGrow={rowFlexGrow}
              buttonRef={isExpandFocus ? expandFocusRef : undefined}
            />
          );
        })}
      </ul>
      {showShowAll ? (
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
