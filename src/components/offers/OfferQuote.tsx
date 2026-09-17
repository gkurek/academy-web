import Image from "next/image";

import type { Image as ContentImage } from "@/content/types";

import { formatAttribution } from "./formatAttribution";

export interface OfferQuoteProps {
  quote: string;
  author: string;
  role?: string;
  image?: ContentImage;
}

export function OfferQuote({ quote, author, role, image }: OfferQuoteProps) {
  return (
    <blockquote className="bg-surface-card px-offer-quote-feature-x py-offer-quote-feature-y h-full">
      <p className="font-serif italic text-size-offer-quote-m md:text-size-offer-quote leading-quote-offer text-text-body mb-space-4">
        {quote}
      </p>
      <footer className="text-size-ui text-text-tertiary">{formatAttribution(author, role)}</footer>
      {image && (
        <div className="hidden md:block mt-offer-quote-image-mt">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 768px) 448px, 100vw"
            className="w-full h-offer-quote-image-h object-cover"
          />
        </div>
      )}
    </blockquote>
  );
}
