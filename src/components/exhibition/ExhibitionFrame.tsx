import Image from "next/image";

import type { Image as ContentImage } from "@/content/types";

export interface ExhibitionFrameProps {
  image: ContentImage;
  className?: string;
  /** Above-the-fold image (LCP) — eager load, high fetch priority. */
  priority?: boolean;
}

/** Wide cropped photo frame (`--exhibition-aspect-wide` from md, `-standard` below) with an optional caption. */
export function ExhibitionFrame({ image, className, priority = false }: ExhibitionFrameProps) {
  const rootClass = ["exhibition-frame", "exhibition-frame--wide", className].filter(Boolean).join(" ");

  return (
    <figure className={rootClass}>
      <span className="exhibition-frame-media">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          sizes="100vw"
          className="exhibition-frame-image"
        />
      </span>
      {image.caption ? (
        <figcaption className="exhibition-frame-caption">{image.caption}</figcaption>
      ) : null}
    </figure>
  );
}
