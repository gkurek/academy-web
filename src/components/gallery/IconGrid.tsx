"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { justifyGalleryRows } from "@/components/gallery/justifyGalleryRows";
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

const galleryTileButtonClass = [
  "group block cursor-pointer border-0 bg-transparent p-0",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
].join(" ");

const galleryTileFrameClass = "relative overflow-hidden bg-surface-tile";

const galleryTileOverlayClass = [
  "pointer-events-none absolute inset-0 flex items-center justify-center bg-scrim-gallery-hover opacity-0",
  "motion-safe:transition-opacity motion-safe:duration-150 motion-safe:ease-out",
  "group-hover:opacity-100 group-focus-visible:opacity-100",
].join(" ");

function GalleryZoomIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="10.5" cy="10.5" r="5.75" />
      <path d="M15 15 L20 20" />
    </svg>
  );
}

function GalleryTileHoverOverlay() {
  return (
    <span className={galleryTileOverlayClass} aria-hidden="true">
      <span className="text-text-h2">
        <GalleryZoomIcon />
      </span>
    </span>
  );
}

/** FooGallery justified settings from akademiaikony.pl/ikona/galeria/. */
const JUSTIFIED_TARGET_ROW_HEIGHT = 240;
const JUSTIFIED_MAX_ROW_HEIGHT = 350;
/** Horizontal tile gap (`gap-x-space-4` / `gap-x-icon-grid-gap`). */
const JUSTIFIED_GAP_MOBILE = 14;
const JUSTIFIED_GAP_DESKTOP = 22;
const JUSTIFIED_GAP_BREAKPOINT = 768;
/** Wide desktop: fewer, larger tiles per row than the WP defaults above. */
const JUSTIFIED_DESKTOP_MIN_WIDTH = 1024;
const JUSTIFIED_DESKTOP_TARGET_ROW_HEIGHT = 300;
const JUSTIFIED_DESKTOP_MAX_ROW_HEIGHT = 400;
const JUSTIFIED_DESKTOP_MAX_TILES_PER_ROW = 4;

function useContainerWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const updateWidth = () => {
      setWidth(element.clientWidth);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, width };
}

/** WP mobile: one centered column when the gallery container is narrow. */
const JUSTIFIED_SINGLE_COLUMN_MAX_W = 480;

/**
 * Gallery justified rows (K-40): FooGallery algorithm — equal height per row,
 * variable width from photo ratio, rows fill the container, smart last row; captions below each tile.
 */
function GalleryJustifiedGrid({
  items,
  eagerCount = 0,
  onSelect,
}: Pick<IconGridProps, "items" | "eagerCount" | "onSelect">) {
  const { ref, width: containerWidth } = useContainerWidth<HTMLDivElement>();
  const aspectRatios = useMemo(
    () => items.map((item) => item.image.width / item.image.height),
    [items],
  );
  const singleColumn =
    containerWidth > 0 && containerWidth <= JUSTIFIED_SINGLE_COLUMN_MAX_W;
  const isDesktop = containerWidth >= JUSTIFIED_DESKTOP_MIN_WIDTH;
  const gap =
    containerWidth >= JUSTIFIED_GAP_BREAKPOINT ? JUSTIFIED_GAP_DESKTOP : JUSTIFIED_GAP_MOBILE;

  const rows = useMemo(
    () =>
      containerWidth > 0
        ? justifyGalleryRows(aspectRatios, {
            containerWidth,
            targetRowHeight: isDesktop
              ? JUSTIFIED_DESKTOP_TARGET_ROW_HEIGHT
              : JUSTIFIED_TARGET_ROW_HEIGHT,
            maxRowHeight: isDesktop
              ? JUSTIFIED_DESKTOP_MAX_ROW_HEIGHT
              : JUSTIFIED_MAX_ROW_HEIGHT,
            gap,
            lastRowSmart: true,
            singleColumn,
            maxTilesPerRow: isDesktop ? JUSTIFIED_DESKTOP_MAX_TILES_PER_ROW : undefined,
          })
        : [],
    [aspectRatios, containerWidth, singleColumn, isDesktop, gap],
  );

  return (
    <div ref={ref} className="w-full">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="mb-space-3 flex flex-wrap justify-center gap-x-space-4 md:gap-x-icon-grid-gap last:mb-0"
        >
          {row.tiles.map((tile) => {
            const item = items[tile.index];

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
                      sizes={
                        singleColumn
                          ? "90vw"
                          : "(min-width: 1024px) 25vw, (min-width: 768px) 30vw, 90vw"
                      }
                      loading={tile.index < eagerCount ? "eager" : undefined}
                      className="h-full w-full object-cover"
                    />
                    <GalleryTileHoverOverlay />
                  </div>
                </button>
                {/* K-42: one caption format for every work — the title only. */}
                <GalleryTileCaption
                  title={item.title}
                  className="mt-space-2 md:mt-space-3"
                />
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
    return <GalleryJustifiedGrid items={items} eagerCount={eagerCount} onSelect={onSelect} />;
  }

  return <PreviewGrid items={items} mobileCount={mobileCount} />;
}
