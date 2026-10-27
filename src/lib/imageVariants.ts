/**
 * Prebuilt WebP variants of `public/media` (11b). One source of truth for the build script
 * (`scripts/generate-image-variants.ts`), the `next/image` loader and the `images` block in `next.config.ts`.
 */

/** srcset widths for `sizes`-based images; together they cover tiles, mobile at 2–3x and wide desktop heroes. */
export const VARIANT_DEVICE_WIDTHS = [640, 1080, 1920];
export const VARIANT_IMAGE_WIDTHS = [384];
export const VARIANT_WIDTHS = [...VARIANT_IMAGE_WIDTHS, ...VARIANT_DEVICE_WIDTHS];

export const DEFAULT_IMAGE_QUALITY = 75;
/** Home pillar photos, where q75 WebP shows blocking (8c). */
export const HIGH_IMAGE_QUALITY = 90;

const MEDIA_PREFIX = "/media/";
export const VARIANT_PREFIX = "/media-webp/";

export function isVariantSource(src: string): boolean {
  return src.startsWith(MEDIA_PREFIX);
}

/** `/media/icons/x.jpg` at 640 → `/media-webp/icons/x-640.webp`; non-default quality adds `-q90`. */
export function variantPath(src: string, width: number, quality: number = DEFAULT_IMAGE_QUALITY): string {
  const stem = src.slice(MEDIA_PREFIX.length).replace(/\.[^./]+$/, "");
  const qualitySuffix = quality === DEFAULT_IMAGE_QUALITY ? "" : `-q${quality}`;
  return `${VARIANT_PREFIX}${stem}-${width}${qualitySuffix}.webp`;
}
