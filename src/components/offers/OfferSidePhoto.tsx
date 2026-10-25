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
  caption,
}: OfferSidePhotoProps) {
  return (
    <div className="not-prose mt-section-gap grid grid-cols-1 lg:grid-cols-offer-side-photo gap-space-7 lg:gap-offer-main-gap items-start">
      <Prose variant="offer" className="min-w-0">
        {children}
      </Prose>

      {/* Whole photo at its natural aspect ratio, no crop. */}
      <figure>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 1024px) 42vw, 100vw"
          className="w-full h-auto"
        />
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
