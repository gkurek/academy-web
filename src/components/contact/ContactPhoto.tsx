import Image from "next/image";

import type { Image as ImageData } from "@/content/types";

export interface ContactPhotoProps {
  photo: ImageData;
}

/** Church facade photo on /kontakt (own photo by EJK — no credit line). */
export function ContactPhoto({ photo }: ContactPhotoProps) {
  return (
    <figure className="-mx-page-margin-mobile md:mx-0">
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes="(min-width: 1024px) 422px, 100vw"
        className="block h-auto w-full bg-surface-tile"
      />
    </figure>
  );
}
