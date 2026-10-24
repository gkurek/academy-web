import Image from "next/image";

import { pl } from "@/i18n/pl";

/** Church facade photo on /kontakt (own photo by EJK — no credit line). */
export function ContactPhoto() {
  const { photo } = pl.contact;

  return (
    <figure className="-mx-page-margin-mobile md:mx-0">
      <Image
        src="/media/contact/kosciol-srodowisk-tworczych.jpg"
        alt={photo.alt}
        width={1280}
        height={959}
        sizes="(min-width: 1024px) 422px, 100vw"
        className="block h-auto w-full bg-surface-tile"
      />
    </figure>
  );
}
