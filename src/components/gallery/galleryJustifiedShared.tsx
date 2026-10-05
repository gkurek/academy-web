export const galleryTileButtonClass = "group block cursor-pointer border-0 bg-transparent p-0";

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
