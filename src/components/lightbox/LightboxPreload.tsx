import Image from "next/image";

import { getLightboxImageSizes } from "@/components/lightbox/lightboxUtils";
import type { Image as ContentImage } from "@/content/types";

export interface LightboxPreloadProps {
  photos: ContentImage[];
  index: number;
}

const isPublicMedia = (src: string) => src.startsWith("/media/");

/** Fetches the neighbouring photos into the browser cache (hidden, same src/sizes as the visible one). */
export function LightboxPreload({ photos, index }: LightboxPreloadProps) {
  const total = photos.length;
  if (total < 2) return null;

  const neighbours = [(index + 1) % total, (index - 1 + total) % total]
    .filter((value, position, all) => value !== index && all.indexOf(value) === position)
    .map((value) => photos[value]);

  return (
    <div hidden aria-hidden="true">
      {neighbours.map((photo) => {
        const original = isPublicMedia(photo.src);
        return (
          <Image
            key={photo.src}
            src={photo.src}
            alt=""
            width={photo.width}
            height={photo.height}
            unoptimized={original}
            sizes={original ? undefined : getLightboxImageSizes(photo)}
            loading="eager"
          />
        );
      })}
    </div>
  );
}
