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
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          // Measured frame width: ~84–88% of the viewport below 1280px, then ~80% up to the 1168px cap.
          sizes="(min-width: 1280px) min(1168px, 80vw), 92vw"
          className="exhibition-frame-image"
        />
      </span>
      {image.caption ? (
        <figcaption className="exhibition-frame-caption">{image.caption}</figcaption>
      ) : null}
    </figure>
  );
}
