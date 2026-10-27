import type { ImageLoaderProps } from "next/image";

import { isVariantSource, variantPath } from "@/lib/imageVariants";

/** `next/image` loader (11b): points at WebP files prebuilt by `scripts/generate-image-variants.ts`. */
export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  return isVariantSource(src) ? variantPath(src, width, quality) : src;
}
