import Image from "next/image";
import { useId, type ReactNode } from "react";

import { Button } from "@/components/core/Button";
import { pl } from "@/i18n/pl";
import { buildMailtoHref } from "@/lib/mailto";
import { Prose } from "@/components/core/Prose";

export interface OfferSideCtaProps {
  /** MDX body of the left column. */
  children: ReactNode;
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  email: string;
  /** Exact `mailto:` subject from brief §7. */
  subject: string;
}

/**
 * Offer MDX section with a right column (LY1): text on the left, photo + small
 * mail CTA on the right. Same grid as the offer header, so the column lines up with FactsBox.
 */
export function OfferSideCta({
  children,
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  email,
  subject,
}: OfferSideCtaProps) {
  const headingId = useId();
  const { sideCta } = pl.offers;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-offer-main gap-space-7 lg:gap-offer-main-gap items-start">
      <Prose variant="offer" className="min-w-0">
        {children}
      </Prose>

      <div>
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          sizes="(min-width: 1024px) 400px, 100vw"
          className="w-full aspect-offer-side-photo object-cover"
        />
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
