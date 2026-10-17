import Image from "next/image";
import { Button } from "@/components/core/Button";
import { ExhibitionFrame } from "@/components/exhibition/ExhibitionFrame";
import type { Image as ContentImage } from "@/content/types";
import { pl } from "@/i18n/pl";

export interface OfferCardProps {
  eyebrow: string;
  title: string;
  excerpt: string;
  bullets: readonly string[];
  href: string;
  ctaLabel: string;
  ctaVariant: "primary" | "secondary";
  image?: ContentImage;
}

export function OfferCard({
  eyebrow,
  title,
  excerpt,
  bullets,
  href,
  ctaLabel,
  ctaVariant,
  image,
}: OfferCardProps) {
  return (
    <article className="bg-surface-tile flex flex-col">
      {image?.src ? (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="w-full h-offer-card-image-h object-cover"
        />
      ) : (
        <ExhibitionFrame
          aspect="tile"
          placeholderLabel={pl.workshopsHub.imagePlaceholder}
          className="offer-card-exhibition-frame"
        />
      )}
      <div className="flex flex-1 flex-col px-offer-card-x pt-offer-card-y pb-offer-card-pb">
        <p className="font-serif text-size-body text-accent-text mb-space-3">{eyebrow}</p>
        <h2 className="font-serif text-size-role-card-title-m md:text-size-role-card-title leading-heading text-text-h2 mb-space-4">
          {title}
        </h2>
        <p className="text-size-body leading-body text-text-secondary mb-space-4">{excerpt}</p>
        <ul className="mb-space-5 list-none text-size-body leading-body text-text-secondary">
          {bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {/* mt-auto pins the CTA to the card bottom so buttons align across the row. */}
        <Button href={href} variant={ctaVariant} size="lg" className="mt-auto">
          {ctaLabel}
        </Button>
      </div>
    </article>
  );
}
