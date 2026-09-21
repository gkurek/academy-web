/** Horizontal travel (px) of a touch that counts as a swipe. */
export const LIGHTBOX_SWIPE_THRESHOLD_PX = 50;

/** Desktop layout starts here; keep in sync with lightbox `lg:` classes. */
export const LIGHTBOX_DESKTOP_QUERY = "(min-width: 1024px)";

export type LightboxImageDimensions = {
  width: number;
  height: number;
};

export function getLightboxImageRatio(image: LightboxImageDimensions): string {
  return (image.width / image.height).toFixed(4);
}

/** Capped by window height (80vh desktop, 60svh stacked) — width follows from ratio. */
export function getLightboxImageSizes(image: LightboxImageDimensions): string {
  const ratio = getLightboxImageRatio(image);
  return `(min-width: 1024px) min(60vw, calc(80vh * ${ratio})), min(100vw, calc(60svh * ${ratio}))`;
}
