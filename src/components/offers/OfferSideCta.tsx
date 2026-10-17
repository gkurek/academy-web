import Image from "next/image";
import { useId, type ReactNode } from "react";

import { Button } from "@/components/core/Button";
import { pl } from "@/i18n/pl";
import { buildMailtoHref } from "@/lib/mailto";
import { Prose } from "@/components/core/Prose";

export type OfferSideCtaPlaceholderKey = keyof typeof pl.offers.sideCta.photoPlaceholders;

/** Optional photo (or its placeholder) above the CTA card; photo fields all together or none. */
type OfferSideCtaPhoto =
  | {
      imageSrc: string;
      imageAlt: string;
      imageWidth: number;
      imageHeight: number;
      /** CSS `object-position` of the cropped photo (focal point of this image); defaults to center. */
      imagePosition?: string;
      placeholder?: never;
    }
  | {
      imageSrc?: never;
      imageAlt?: never;
      imageWidth?: never;
      imageHeight?: never;
      imagePosition?: never;
      /** Striped frame with a label until the photo arrives. */
      placeholder?: OfferSideCtaPlaceholderKey;
    };

export type OfferSideCtaProps = OfferSideCtaPhoto & {
  /** MDX body of the left column. */
  children: ReactNode;
  email: string;
  /** Exact `mailto:` subject from brief §7. */
  subject: string;
};

/**
 * Offer MDX section with a right column (LY1): text on the left, small mail CTA (optionally
 * under a photo) on the right. Same grid as the offer header, so the column lines up with FactsBox.
 * Put the section's `##` heading inside `children`, so the right column starts level with it.
 */
export function OfferSideCta({
  children,
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  imagePosition,
  placeholder,
  email,
  subject,
}: OfferSideCtaProps) {
  const headingId = useId();
  const { sideCta } = pl.offers;

  return (
    // The section h2 sits inside the left column, so the right column starts level with it (as
    // FactsBox with the page title) and the section gap moves to the grid.
    <div className="grid grid-cols-1 lg:grid-cols-offer-main gap-space-7 lg:gap-offer-main-gap items-start mt-section-gap first:mt-0">
      <Prose variant="offer" className="min-w-0">
        {children}
      </Prose>

      <div>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
            sizes="(min-width: 1024px) 400px, 100vw"
            className="w-full aspect-offer-side-photo object-cover"
            style={imagePosition ? { objectPosition: imagePosition } : undefined}
          />
        ) : placeholder ? (
          <div className="exhibition-media-placeholder w-full aspect-offer-side-photo">
            <p className="exhibition-media-placeholder-text">
              {sideCta.photoPlaceholders[placeholder]}
            </p>
          </div>
        ) : null}
        <aside
          aria-labelledby={headingId}
          className="bg-surface-card px-offer-facts-x pt-offer-facts-y pb-offer-facts-pb border-t-offer-facts-top border-accent"
        >
          <h3
            id={headingId}
            className="font-serif text-size-role-box-title-m md:text-size-role-box-title leading-heading text-text-h2 mb-space-5"
          >
            {sideCta.title}
          </h3>
          <Button href={buildMailtoHref(email, subject)} variant="secondary" block size="lg">
            {sideCta.mailtoLabel}
          </Button>
        </aside>
      </div>
    </div>
  );
}
