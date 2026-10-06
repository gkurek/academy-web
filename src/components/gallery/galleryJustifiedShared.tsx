import { ZoomIcon } from "@/components/core/icons";

export const galleryTileButtonClass = "group block cursor-pointer border-0 bg-transparent p-0";

export const galleryTileFrameClass = "relative overflow-hidden bg-surface-tile";

const galleryTileOverlayClass = [
  "pointer-events-none absolute inset-0 flex items-center justify-center bg-scrim-gallery-hover opacity-0",
  "motion-safe:transition-opacity motion-safe:duration-150 motion-safe:ease-out",
  "group-hover:opacity-100 group-focus-visible:opacity-100",
].join(" ");

export function GalleryTileHoverOverlay() {
  return (
    <span className={galleryTileOverlayClass} aria-hidden="true">
      <span className="text-text-h2">
        <ZoomIcon />
      </span>
    </span>
  );
}
