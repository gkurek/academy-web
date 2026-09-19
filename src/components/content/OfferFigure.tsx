import Image from "next/image";

export interface OfferFigureProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

/**
 * Full-width offer photo — desktop: content column (1068px @ 1180 canvas);
 * mobile: edge-to-edge bleed per #3b / #1a-oferta mockup DOM.
 */
export function OfferFigure({ src, alt, width, height, caption }: OfferFigureProps) {
  return (
    <figure
      className="offer-figure w-[calc(100%+2*var(--spacing-page-margin-mobile))] -mx-page-margin-mobile md:mx-0 md:w-full mb-space-3 md:mb-space-4"
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 768px) 1068px, 100vw"
        className="w-full h-offer-figure-h-m md:h-offer-figure-h object-cover"
      />
      {caption && (
        <figcaption className="font-serif italic text-size-body text-text-tertiary mt-space-3 px-page-margin-mobile md:px-0 mb-space-7 md:mb-space-8">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
