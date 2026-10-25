import { Button } from "@/components/core/Button";
import { TextLink } from "@/components/core/TextLink";
import { ExhibitionAnnualTiles } from "@/components/exhibition/ExhibitionAnnualTiles";
import { getExhibitionCopy } from "@/content/exhibition";
import type { ExhibitionTravelingPlace, Image } from "@/content/types";
import { pl } from "@/i18n/pl";
import { PageHeading } from "@/components/core/PageHeading";

export interface ExhibitionTravelingSectionProps {
  mailtoHref: string;
  places: ExhibitionTravelingPlace[];
  photos: Image[];
  /** Further photos behind the "more photos" link; the lightbox continues after `photos`. */
  gallery: Image[];
}

export function ExhibitionTravelingSection({
  mailtoHref,
  places,
  photos,
  gallery,
}: ExhibitionTravelingSectionProps) {
  const { traveling } = pl.exhibition;
  const travelingCopy = getExhibitionCopy().traveling;
  const lightboxPhotos = [...photos, ...gallery];

  return (
    <section
      id={traveling.sectionId}
      className="exhibition-section scroll-mt-space-6"
      aria-labelledby="exhibition-traveling-heading"
    >
      <div className="exhibition-traveling-grid">
        <div className="exhibition-traveling-grid__main min-w-0">
          <PageHeading level="section" id="exhibition-traveling-heading" className="mb-space-5">
            {traveling.heading}
          </PageHeading>
          <p className="exhibition-section-copy">
            {travelingCopy.introBefore}
            {places.map((place, index) => (
              <span key={place.place}>
                {index > 0
                  ? index === places.length - 1
                    ? traveling.placesLastJoiner
                    : traveling.placesJoiner
                  : null}
                {place.newsSlug ? (
                  <TextLink href={`/aktualnosci/${place.newsSlug}`}>{place.place}</TextLink>
                ) : (
                  place.place
                )}
              </span>
            ))}
            {travelingCopy.introAfter}
          </p>
        </div>

        <div className="min-w-0">
          <div className="exhibition-cta-block">
            <p className="exhibition-cta-intro">{traveling.inviteCta}</p>
            <Button href={mailtoHref} variant="primary" block size="lg">
              {traveling.mailtoLabel}
            </Button>
          </div>
        </div>
      </div>

      {photos.length > 0 ? (
        // Same 4:3 tile row as #doroczna, without the caption.
        <ExhibitionAnnualTiles photos={photos} gallery={lightboxPhotos} />
      ) : null}
    </section>
  );
}
