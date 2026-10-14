import Image from "next/image";

import { ExhibitionFrame } from "@/components/exhibition/ExhibitionFrame";
import { pl } from "@/i18n/pl";

export type OfferFigurePlaceholderKey = keyof typeof pl.offers.figurePlaceholders;

type OfferFigureImageProps = {
  placeholder?: never;
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

type OfferFigurePlaceholderProps = {
  placeholder: OfferFigurePlaceholderKey;
  src?: never;
  alt?: never;
  width?: never;
  height?: never;
  caption?: never;
};

export type OfferFigureProps = OfferFigureImageProps | OfferFigurePlaceholderProps;

/**
 * Full-width offer photo — desktop: content column (1068px @ 1180 canvas);
 * mobile: edge-to-edge bleed per #3b / #1a-oferta mockup DOM.
 */
export function OfferFigure(props: OfferFigureProps) {
  // Section gap below, so the next h2 sits as far from the photo as other h2s from their copy.
  const figureClass = "offer-figure bleed-x-mobile mb-section-gap";

  if ("placeholder" in props && props.placeholder) {
    return (
      <figure className={figureClass}>
        <ExhibitionFrame
          aspect="tile"
          placeholderLabel={pl.offers.figurePlaceholders[props.placeholder]}
          className="offer-figure-exhibition-frame"
        />
      </figure>
    );
  }

  const { src, alt, width, height, caption } = props;

  return (
    <figure className={figureClass}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 768px) 1068px, 100vw"
        className="w-full h-offer-figure-h-m md:h-offer-figure-h object-cover"
      />
      {caption ? (
        <figcaption className="font-serif italic text-size-body text-text-tertiary mt-space-3 px-page-margin-mobile md:px-0">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
