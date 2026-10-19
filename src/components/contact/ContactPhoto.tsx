import Image from "next/image";

import { ExternalLink } from "@/components/core/ExternalLink";
import { pl } from "@/i18n/pl";

const linkClass = "underline hover:text-accent-hover transition-ui-colors";

/** Church facade photo on /kontakt (Wikimedia Commons, CC BY-SA — credit is required). */
export function ContactPhoto() {
  const { photo } = pl.contact;

  return (
    <figure className="-mx-page-margin-mobile md:mx-0">
      <Image
        src="/media/contact/kosciol-srodowisk-tworczych.jpg"
        alt={photo.alt}
        width={1600}
        height={983}
        sizes="(min-width: 1024px) 422px, 100vw"
        className="block h-auto w-full bg-surface-tile"
      />
      <figcaption className="mt-space-2 px-page-margin-mobile text-size-caption leading-body text-text-tertiary md:px-0">
        {photo.creditLead}
        <ExternalLink href={photo.sourceUrl} showIcon={false} className={linkClass}>
          {photo.sourceLabel}
        </ExternalLink>
        {", "}
        <ExternalLink
          href={photo.licenseUrl}
          showIcon={false}
          className={`${linkClass} whitespace-nowrap`}
        >
          {photo.licenseLabel}
        </ExternalLink>
      </figcaption>
    </figure>
  );
}
