import Image from "next/image";
import { TextLink } from "@/components/core/TextLink";
import { pl } from "@/i18n/pl";

/** "Warsztaty / Wykłady / Ikony" — three static entry points into the main sections. */
export function Pillars() {
  return (
    <section className="px-page-margin-mobile md:px-page-margin py-space-7 md:py-space-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-7 md:gap-pillars-gap">
        {pl.home.pillars.map((pillar) => (
          <div key={pillar.title}>
            <Image
              src={pillar.image.src}
              alt={pillar.image.alt}
              width={pillar.image.width}
              height={pillar.image.height}
              sizes="(min-width: 768px) 33vw, 100vw"
              className="w-full h-pillar-image-h-m md:h-pillar-image-h object-cover"
            />
            {/* h2, not h3: this is the first heading after the H1 (design/README's
                "H3 / tytuł w liście" is a type-scale role, not a required DOM
                tag) — an h3 here with no h2 before it breaks heading order
                (Lighthouse a11y: heading-order). */}
            <h2 className="font-serif font-normal text-size-h2-m md:text-size-h2-sm leading-heading text-text-h2 mt-space-5 md:mt-space-6 mb-space-3">
              {pillar.title}
            </h2>
            <p className="text-size-body leading-body text-text-secondary mb-space-4">{pillar.body}</p>
            <TextLink href={pillar.href} className="text-size-ui-m md:text-size-body">
              {pillar.linkLabel}
            </TextLink>
          </div>
        ))}
      </div>
    </section>
  );
}
