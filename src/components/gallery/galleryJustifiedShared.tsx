"use client";

import { useEffect, useRef, useState } from "react";

import { justifyGalleryRows } from "@/components/gallery/justifyGalleryRows";

/** FooGallery justified settings from akademiaikony.pl/ikona/galeria/. */
export const JUSTIFIED_TARGET_ROW_HEIGHT = 240;
export const JUSTIFIED_MAX_ROW_HEIGHT = 350;
export const JUSTIFIED_GAP_MOBILE = 14;
export const JUSTIFIED_GAP_DESKTOP = 22;
export const JUSTIFIED_GAP_BREAKPOINT = 768;
export const JUSTIFIED_DESKTOP_MIN_WIDTH = 1024;
export const JUSTIFIED_DESKTOP_TARGET_ROW_HEIGHT = 300;
export const JUSTIFIED_DESKTOP_MAX_ROW_HEIGHT = 400;
export const JUSTIFIED_DESKTOP_MAX_TILES_PER_ROW = 4;
export const JUSTIFIED_SINGLE_COLUMN_MAX_W = 480;

export const galleryTileButtonClass = [
  "group block cursor-pointer border-0 bg-transparent p-0",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
].join(" ");

export const galleryTileFrameClass = "relative overflow-hidden bg-surface-tile";

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

export function GalleryTileHoverOverlay() {
  return (
    <span className={galleryTileOverlayClass} aria-hidden="true">
      <span className="text-text-h2">
        <GalleryZoomIcon />
      </span>
    </span>
  );
}

export function useGalleryContainerWidth<T extends HTMLElement>() {
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

export function computeJustifiedGalleryRows(aspectRatios: number[], containerWidth: number) {
  const singleColumn =
    containerWidth > 0 && containerWidth <= JUSTIFIED_SINGLE_COLUMN_MAX_W;
  const isDesktop = containerWidth >= JUSTIFIED_DESKTOP_MIN_WIDTH;
  const gap =
    containerWidth >= JUSTIFIED_GAP_BREAKPOINT ? JUSTIFIED_GAP_DESKTOP : JUSTIFIED_GAP_MOBILE;

  return justifyGalleryRows(aspectRatios, {
    containerWidth,
    targetRowHeight: isDesktop ? JUSTIFIED_DESKTOP_TARGET_ROW_HEIGHT : JUSTIFIED_TARGET_ROW_HEIGHT,
    maxRowHeight: isDesktop ? JUSTIFIED_DESKTOP_MAX_ROW_HEIGHT : JUSTIFIED_MAX_ROW_HEIGHT,
    gap,
    lastRowSmart: true,
    singleColumn,
    maxTilesPerRow: isDesktop ? JUSTIFIED_DESKTOP_MAX_TILES_PER_ROW : undefined,
  });
}

export function justifiedImageSizes(singleColumn: boolean) {
  return singleColumn
    ? "90vw"
    : "(min-width: 1024px) 25vw, (min-width: 768px) 30vw, 90vw";
}

export function isJustifiedSingleColumn(containerWidth: number) {
  return containerWidth > 0 && containerWidth <= JUSTIFIED_SINGLE_COLUMN_MAX_W;
}
