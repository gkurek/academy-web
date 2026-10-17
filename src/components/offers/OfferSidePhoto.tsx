import Image from "next/image";
import type { ReactNode } from "react";

import { Prose } from "@/components/core/Prose";

export interface OfferSidePhotoProps {
  /** MDX body of the left column. */
  children: ReactNode;
  src: string;
  alt: string;
  width: number;
  height: number;
  /** CSS `object-position` of the cropped photo; defaults to center. */
  imagePosition?: string;
  caption?: string;
}

/**
 * Offer MDX section with a right column: text on the left, photo on the right.
 * Wider right column than FactsBox (60 / 40) via `grid-cols-offer-side-photo`.
 */
export function OfferSidePhoto({
  children,
  src,
  alt,
  width,
  height,
  imagePosition,
  caption,
}: OfferSidePhotoProps) {
  return (
    <div className="not-prose mt-section-gap grid grid-cols-1 lg:grid-cols-offer-side-photo gap-space-7 lg:gap-offer-main-gap items-start">
      <Prose variant="offer" className="min-w-0">
        {children}
      </Prose>

      {/* lg: the photo fills the text height instead of setting it, so the next section's gap is
          always measured from the text (the photo column has no intrinsic height). */}
      <figure className="lg:self-stretch lg:flex lg:flex-col">
        <div className="lg:relative lg:flex-1">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="w-full aspect-offer-side-photo object-cover lg:absolute lg:inset-0 lg:h-full lg:aspect-auto"
            style={imagePosition ? { objectPosition: imagePosition } : undefined}
          />
        </div>
        {/* Same caption style as OfferFigure. */}
        {caption ? (
          <figcaption className="font-serif italic text-size-body text-text-tertiary mt-space-3">
            {caption}
          </figcaption>
        ) : null}
      </figure>
    </div>
  );
}
