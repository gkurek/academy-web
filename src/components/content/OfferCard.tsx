import Image from "next/image";
import { Button } from "@/components/core/Button";
import type { Image as ContentImage } from "@/content/types";

export interface OfferCardProps {
  eyebrow: string;
  title: string;
  excerpt: string;
  bullets: readonly string[];
  href: string;
  ctaLabel: string;
  ctaVariant: "primary" | "secondary";
  image: ContentImage;
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
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes="(min-width: 768px) 50vw, 100vw"
        className="w-full h-offer-card-image-h object-cover"
      />
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
        <Button href={href} variant={ctaVariant} size="lg">
          {ctaLabel}
        </Button>
      </div>
    </article>
  );
}
