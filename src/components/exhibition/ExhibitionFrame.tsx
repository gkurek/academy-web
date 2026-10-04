import Image from "next/image";

import type { Image as ContentImage } from "@/content/types";
import { mediaFileExists } from "@/lib/mediaFileExists";

export type ExhibitionFrameAspect =
  | "wide"
  | "standard"
  | "square"
  | "tile"
  | "tilePairLead";

export interface ExhibitionFrameProps {
  image?: ContentImage;
  aspect: ExhibitionFrameAspect;
  placeholderLabel: string;
  className?: string;
}

const aspectClass: Record<ExhibitionFrameAspect, string> = {
  wide: "exhibition-frame--wide",
  standard: "exhibition-frame--standard",
  square: "exhibition-frame--square",
  tile: "exhibition-frame--tile",
  tilePairLead: "exhibition-frame--tile-pair-lead",
};

export function ExhibitionFrame({
  image,
  aspect,
  placeholderLabel,
  className,
}: ExhibitionFrameProps) {
  const rootClass = ["exhibition-frame", aspectClass[aspect], className].filter(Boolean).join(" ");
  const hasImage = image?.src && mediaFileExists(image.src);

  return (
    <figure className={rootClass}>
      {hasImage && image ? (
        <span className="exhibition-frame-media">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={
              aspect === "wide"
                ? "(min-width: 768px) 100vw, 100vw"
                : aspect === "standard" ||
                    aspect === "tile" ||
                    aspect === "tilePairLead"
                  ? "(min-width: 768px) 50vw, 100vw"
                  : "(min-width: 768px) 25vw, 50vw"
            }
            className="exhibition-frame-image"
          />
        </span>
      ) : (
        <div
          className={`exhibition-media-placeholder exhibition-frame-placeholder ${aspectClass[aspect]}`}
        >
          <p className="exhibition-media-placeholder-text">{placeholderLabel}</p>
        </div>
      )}
    </figure>
  );
}
