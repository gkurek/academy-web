import { existsSync } from "node:fs";
import { join } from "node:path";

import type { Image as ContentImage } from "@/content/types";

/** True when a `/public/...` asset is present at build/render time. */
export function mediaFileExists(src: string): boolean {
  return existsSync(join(process.cwd(), "public", src.replace(/^\//, "")));
}

export function filterExistingPhotos(photos?: ContentImage[]): ContentImage[] {
  return (photos ?? []).filter((photo) => mediaFileExists(photo.src));
}
