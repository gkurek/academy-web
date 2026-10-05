import type { CSSProperties } from "react";

/** Horizontal travel (px) of a touch that counts as a swipe. */
export const LIGHTBOX_SWIPE_THRESHOLD_PX = 50;

/** Desktop layout starts here; keep in sync with lightbox `lg:` classes. */
export const LIGHTBOX_DESKTOP_QUERY = "(min-width: 1024px)";

export type LightboxImageDimensions = {
  width: number;
  height: number;
};

function getLightboxImageRatio(image: LightboxImageDimensions): string {
  return (image.width / image.height).toFixed(4);
}

/**
 * Intrinsic dimensions capped by viewport tokens (--lightbox-image-h on .lightbox-dialog).
 * Never upscale beyond source width/height (D2).
 */
export function getLightboxImageDisplayStyle(image: LightboxImageDimensions): CSSProperties {
  const ratio = getLightboxImageRatio(image);

  return {
    width: "auto",
    height: "auto",
    maxHeight: `min(var(--lightbox-image-h), ${image.height}px)`,
    maxWidth: `min(100%, ${image.width}px, calc(var(--lightbox-image-h) * ${ratio}))`,
  };
}

/** `sizes` for next/image — same cap as display style (no upscale in src selection). */
export function getLightboxImageSizes(image: LightboxImageDimensions): string {
  const ratio = getLightboxImageRatio(image);
  const { width } = image;

  return `(min-width: 1024px) min(${width}px, 60vw, calc(80vh * ${ratio})), min(${width}px, 100vw, calc(60svh * ${ratio}))`;
}
