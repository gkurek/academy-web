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
    <section className="md:grid md:grid-cols-hero md:gap-space-9 md:items-center md:px-page-margin md:pt-hero-pt md:pb-hero-pb">
      {/* Padding sits on the text block on mobile (not the section) so the image
          below computes its 62% width against the full viewport, matching the
          resolved mockup DOM — there the <img> is an unpadded sibling of this
          text div, not nested inside its padding. */}
      <div className="px-page-margin-mobile pt-hero-pt-m pb-hero-pb-m md:p-0">
        <h1 className="font-serif text-size-h1-m md:text-size-h1-home leading-tight text-text-h1 mb-space-4 md:mb-space-6">
          {title}
        </h1>
        {lead && (
          <p className="text-size-lead-m md:text-size-lead leading-body text-text-secondary max-w-measure mb-space-5 md:mb-0">
            {lead}
          </p>
        )}
        {children}
      </div>
      <div>
        {/* The source icon is a tall portrait photo — shown whole (contain), not
            cropped, sized per the resolved mockup DOM: 62% width on mobile,
            a fixed 760px height on desktop (both centered, width:auto/auto). */}
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          priority
          sizes="(min-width: 768px) 401px, 62vw"
          className="mx-auto w-hero-image-w-m h-auto md:w-auto md:h-hero-image-h md:max-w-full object-contain shadow-hero-image-m md:shadow-hero-image"
        />
        {image.caption && (
          <p className="font-serif italic text-size-caption-m md:text-size-caption text-text-tertiary text-center md:text-left px-page-margin-mobile md:px-0 mt-space-3 md:mt-space-4 mb-hero-pb-m md:mb-0">
            {image.caption}
          </p>
        )}
      </div>
    </section>
  );
}
