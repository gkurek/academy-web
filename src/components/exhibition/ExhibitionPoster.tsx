import Image from "next/image";

import { ExhibitionPhotoPlaceholder } from "@/components/exhibition/ExhibitionPhotoPlaceholder";
import type { ExhibitionEdition } from "@/content/types";
import { pl } from "@/i18n/pl";
import { mediaFileExists } from "@/lib/mediaFileExists";

export interface ExhibitionPosterProps {
  edition: ExhibitionEdition;
}

export function ExhibitionPoster({ edition }: ExhibitionPosterProps) {
  const caption = pl.exhibition.currentEdition.posterCaption.replace("{year}", String(edition.year));

  return (
    <aside className="exhibition-poster" aria-label={caption}>
      {edition.poster && mediaFileExists(edition.poster.src) ? (
        <Image
          src={edition.poster.src}
          alt={edition.poster.alt}
          width={edition.poster.width}
          height={edition.poster.height}
          sizes="(min-width: 768px) 260px, 180px"
          className="exhibition-poster-image"
        />
      ) : (
        <ExhibitionPhotoPlaceholder
          className="exhibition-poster-placeholder"
          label={pl.exhibition.currentEdition.posterPlaceholder.replace(
            "{year}",
            String(edition.year),
          )}
        />
      )}
      <p className="exhibition-poster-caption">{caption}</p>
    </aside>
  );
}
