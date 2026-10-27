import Image from "next/image";
import Link from "next/link";
import type { LoadedHomePillar } from "@/content/home";
import { HIGH_IMAGE_QUALITY } from "@/lib/imageVariants";

const pillarLinkClass =
  "tap-target-below-lg text-accent-text no-underline group-hover:text-accent-hover";

const pillarLinkUnderline = "link-underline-target link-underline-target--border";

export interface PillarsProps {
  pillars: LoadedHomePillar[];
}

/** "Warsztaty / Wykłady / Ikony" — three static entry points into the main sections. */
export function Pillars({ pillars }: PillarsProps) {
  return (
    <section className="px-page-margin-mobile md:px-page-margin pt-section-gap pb-section-gap">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-7 md:gap-pillars-gap">
        {pillars.map((pillar) => (
          // Column flex + mt-auto pins the link to the bottom so links align across the row.
          <article key={pillar.title} className="group flex flex-col">
            <Link href={pillar.href} className="block">
              <Image
                src={pillar.image.src}
                alt={pillar.image.alt}
                width={pillar.image.width}
                height={pillar.image.height}
                sizes="(min-width: 768px) 33vw, 100vw"
                quality={HIGH_IMAGE_QUALITY}
                className="w-full h-pillar-image-h-m md:h-pillar-image-h object-cover"
              />
              <h2 className="font-serif font-normal text-size-role-card-title-m md:text-size-role-card-title leading-heading text-text-h2 transition-ui-colors group-hover:text-accent-hover mt-space-5 md:mt-space-6 mb-space-3">
                {pillar.title}
              </h2>
            </Link>
            <p className="text-size-body leading-body text-text-secondary mb-space-4">{pillar.body}</p>
            <Link href={pillar.href} className={`mt-auto self-start text-size-ui-m md:text-size-body ${pillarLinkClass}`}>
              <span className={pillarLinkUnderline}>{pillar.linkLabel}</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
