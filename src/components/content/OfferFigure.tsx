import Image from "next/image";

export type OfferFigureProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

/**
 * Full-width offer photo — desktop: content column (1068px @ 1180 canvas);
 * mobile: edge-to-edge bleed per #3b / #1a-oferta mockup DOM.
 */
export function OfferFigure({ src, alt, width, height, caption }: OfferFigureProps) {
  return (
    // Section gap below, so the next h2 sits as far from the photo as other h2s from their copy.
    <figure className="offer-figure bleed-x-mobile mb-section-gap">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 768px) 1068px, 100vw"
        className="w-full h-auto"
      />
      {caption ? (
        <figcaption className="font-serif italic text-size-body text-text-tertiary mt-space-3 px-page-margin-mobile md:px-0">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
