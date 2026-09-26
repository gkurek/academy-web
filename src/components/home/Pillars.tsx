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
          <article key={pillar.title} className="group">
            <Link
              href={pillar.href}
              className="block focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2"
            >
              <Image
                src={pillar.image.src}
                alt={pillar.image.alt}
                width={pillar.image.width}
                height={pillar.image.height}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="w-full h-pillar-image-h-m md:h-pillar-image-h object-cover"
              />
              <h2 className="font-serif font-normal text-size-role-card-title-m md:text-size-role-card-title leading-heading text-text-h2 mt-space-5 md:mt-space-6 mb-space-3">
                {pillar.title}
              </h2>
            </Link>
            <p className="text-size-body leading-body text-text-secondary mb-space-4">{pillar.body}</p>
            <div className="flex flex-wrap gap-x-space-5 gap-y-space-3">
              <Link href={pillar.href} className={`text-size-ui-m md:text-size-body ${pillarLinkClass}`}>
                {pillar.linkLabel}
              </Link>
              {"secondaryLinkLabel" in pillar && pillar.secondaryLinkLabel && pillar.secondaryHref ? (
                <Link
                  href={pillar.secondaryHref}
                  className={`text-size-ui-m md:text-size-body ${pillarLinkClass}`}
                >
                  {pillar.secondaryLinkLabel}
                </Link>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
