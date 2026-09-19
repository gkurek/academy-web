import Image from "next/image";
import type { ReactNode } from "react";
import type { Image as ImageType } from "@/content/types";

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
    <section className="md:grid md:grid-cols-hero md:gap-space-9 md:items-center md:px-page-margin md:pt-hero-pt md:pb-hero-pb md:min-w-0">
      {/* Padding sits on the text block on mobile (not the section) so the image
          below computes its 72% width against the full viewport, matching the
          resolved mockup DOM — there the <img> is an unpadded sibling of this
          text div, not nested inside its padding. */}
      <div className="px-page-margin-mobile pt-hero-pt-m pb-hero-pb-m md:p-0">
        <h1 className="font-serif text-size-h1-m md:text-size-h1-home leading-tight text-text-h1 mb-space-4 md:mb-space-6">
          {title}
        </h1>
        {lead && (
          <p className="text-size-lead-m md:text-size-lead leading-body text-text-secondary max-w-measure-lead mb-space-5 md:mb-0">
            {lead}
          </p>
        )}
        {children}
      </div>
      <figure className="mx-auto md:ml-auto md:mr-0 md:min-w-0 md:w-full w-hero-image-w-m max-w-full mb-hero-pb-m md:mb-0">
        {/* The source icon is a tall portrait photo — shown whole (contain), not
            cropped. Mobile: 72% viewport width (centered). Desktop (md+): width
            derived from min(920px, 76vh) and aspect ratio, capped by the grid
            column so the layout never overflows (K-33). */}
        <div className="w-full md:ml-auto md:w-fit md:max-w-full">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            priority
            sizes="(min-width: 768px) min(486px, 38vw), 72vw"
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
