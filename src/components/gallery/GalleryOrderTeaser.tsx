import Image from "next/image";

import { TextLink } from "@/components/core/TextLink";
import { pl } from "@/i18n/pl";

export function GalleryOrderTeaser() {
  const { title, lead, linkLabel, image } = pl.gallery.orderTeaser;

  return (
    <section
      aria-labelledby="gallery-order-teaser-heading"
      className="pt-space-8 mt-space-8 border-t border-line-gold"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-6 items-start">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="w-full h-auto"
        />
        <div>
          <h2
            id="gallery-order-teaser-heading"
            className="font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2 mb-space-4"
          >
            {title}
          </h2>
          <p className="text-size-body leading-body text-text-secondary max-w-measure-prose mb-space-5">
            {lead}
          </p>
          <TextLink href="/ikony/na-zamowienie" className="text-size-body">
            {linkLabel}
          </TextLink>
        </div>
      </div>
    </section>
  );
}
