import Image from "next/image";
import type { ReactNode } from "react";
import type { Image as ImageType } from "@/content/types";
import { PageHeading } from "@/components/core/PageHeading";

export interface HeroProps {
  title: ReactNode;
  lead?: ReactNode;
  image: ImageType;
  /** Usually two <Button> CTAs. */
  children?: ReactNode;
}

/** Home page variant of Hero — icon image + two CTAs (design/components/content/Hero.jsx). */
export function Hero({ title, lead, image, children }: HeroProps) {
  return (
    <section className="lg:grid lg:grid-cols-hero lg:gap-space-9 lg:items-center lg:px-page-margin lg:pt-hero-pt lg:pb-hero-pb lg:min-w-0">
      {/* Padding sits on the text block on mobile (not the section) so the image
          below computes its 72% width against the full viewport, matching the
          resolved mockup DOM — there the <img> is an unpadded sibling of this
          text div, not nested inside its padding. */}
      <div className="px-page-margin-mobile pt-hero-pt-m pb-hero-pb-m lg:p-0">
        <PageHeading level="page" variant="home" className="mb-space-4 md:mb-space-6">
          {title}
        </PageHeading>
        {lead && (
          <p className="text-size-lead-m md:text-size-lead leading-body text-text-secondary max-w-measure-lead mb-space-5 lg:mb-0">
            {lead}
          </p>
        )}
        {children}
      </div>
      <figure className="mx-auto lg:ml-auto lg:mr-0 lg:min-w-0 lg:w-full w-hero-image-w-m max-w-full mb-hero-pb-m lg:mb-0">
        {/* The source icon is a tall portrait photo — shown whole (contain), not
            cropped. Mobile: 72% viewport width (centered). Desktop (md+): width
            derived from min(920px, 76vh) and aspect ratio, capped by the grid
            column so the layout never overflows (K-33). */}
        <div className="w-full md:mx-auto md:w-fit md:max-w-full lg:ml-auto lg:mr-0">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            priority
            sizes="(min-width: 1024px) min(486px, 38vw), (min-width: 768px) 486px, 72vw"
            className="block w-full h-auto md:w-hero-image-w md:max-w-full md:h-auto md:max-h-hero-image-h object-contain shadow-hero-image-m md:shadow-hero-image"
          />
          {image.caption && (
            <figcaption className="font-serif italic text-size-body text-text-tertiary text-center mt-space-3 md:mt-space-4">
              {image.caption}
            </figcaption>
          )}
        </div>
      </figure>
    </section>
  );
}
