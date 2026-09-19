"use client";

import { useGalleryLayoutMode, type GalleryLayoutMode } from "@/components/gallery/GalleryLayoutContext";
import { pl } from "@/i18n/pl";

const buttonClass = [
  "inline-flex shrink-0 items-center justify-center rounded-none border border-border-button bg-transparent",
  "px-space-2 py-space-1 text-size-caption font-normal text-text-tertiary",
  "transition-colors duration-150 ease-out",
  "hover:border-accent-text hover:text-accent-text",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
].join(" ");

function nextLayoutMode(mode: GalleryLayoutMode): GalleryLayoutMode {
  return mode === "shelf" ? "justified" : "shelf";
}

/** Small A/B switch for comparing K-40 shelf vs justified rows during visual review. */
export function GalleryLayoutToggle() {
  const { layoutMode, setLayoutMode } = useGalleryLayoutMode();
  const nextMode = nextLayoutMode(layoutMode);

  return (
    <button
      type="button"
      onClick={() => setLayoutMode(nextMode)}
      title={`${pl.gallery.layoutToggle.titles[layoutMode]}. ${pl.gallery.layoutToggle.switchTo} ${pl.gallery.layoutToggle.titles[nextMode]}`}
      aria-label={`${pl.gallery.layoutToggle.groupAria}. ${pl.gallery.layoutToggle.titles[layoutMode]}. ${pl.gallery.layoutToggle.switchTo} ${pl.gallery.layoutToggle.titles[nextMode]}`}
      className={buttonClass}
    >
      {pl.gallery.layoutToggle[layoutMode]}
    </button>
  );
}
