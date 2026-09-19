import Image from "next/image";
import Link from "next/link";
import { pl } from "@/i18n/pl";

const pillarLinkClass =
  "text-accent-text no-underline border-b border-accent-veil group-hover:text-accent-hover group-hover:border-accent-hover";

/** "Warsztaty / Wykłady / Ikony" — three static entry points into the main sections. */
export function Pillars() {
  return (
    <section className="px-page-margin-mobile md:px-page-margin py-space-7 md:py-space-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-7 md:gap-pillars-gap">
        {pl.home.pillars.map((pillar) => (
          <Link
            key={pillar.title}
            href={pillar.href}
            className="group block focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2"
          >
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
            <h2 className="font-serif font-normal text-size-role-card-title-m md:text-size-role-card-title leading-heading text-text-h2 mt-space-5 md:mt-space-6 mb-space-3">
              {pillar.title}
            </h2>
            <p className="text-size-body leading-body text-text-secondary mb-space-4">{pillar.body}</p>
            <span className={`inline-block text-size-ui-m md:text-size-body ${pillarLinkClass}`}>
              {pillar.linkLabel}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
