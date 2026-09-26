import Image from "next/image";

import { Button } from "@/components/core/Button";
import { TextLink } from "@/components/core/TextLink";
import { pl } from "@/i18n/pl";
import { mediaFileExists } from "@/lib/mediaFileExists";

export interface ExhibitionToursSectionProps {
  mailtoHref: string;
}

export function ExhibitionToursSection({ mailtoHref }: ExhibitionToursSectionProps) {
  const { tours } = pl.exhibition;

  return (
    <section
      id={tours.sectionId}
      className="exhibition-section scroll-mt-space-6"
      aria-labelledby="exhibition-tours-heading"
    >
      <h2
        id="exhibition-tours-heading"
        className="font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2 mb-space-5"
      >
        {tours.title}
      </h2>

      <div className="exhibition-tours-grid">
        <div className="exhibition-tours-copy">
          <p className="exhibition-section-copy mb-space-4">{tours.intro}</p>
          <p className="exhibition-section-copy">
            {tours.scheduleNoteBefore}
            <TextLink href="/aktualnosci">{tours.scheduleNewsLink}</TextLink>
            {tours.scheduleNoteAfter}
          </p>
        </div>

        <aside className="exhibition-cta-block">
          <p className="exhibition-cta-intro">{tours.ctaIntro}</p>
          <Button href={mailtoHref} variant="primary" block size="lg">
            {tours.mailtoLabel}
          </Button>
        </aside>
      </div>
    </section>
  );
}

export type TravelingExhibitionListItem = {
  label: string;
  newsSlug: string;
};

export interface ExhibitionTravelingSectionProps {
  mailtoHref: string;
  items: TravelingExhibitionListItem[];
}

export function ExhibitionTravelingSection({ mailtoHref, items }: ExhibitionTravelingSectionProps) {
  const { traveling } = pl.exhibition;
  const photoSrc = "/media/sample/news/wystawa-ikona-korzenie-i-owoce-wiary-2018-1.jpg";

  return (
    <section
      id={traveling.sectionId}
      className="exhibition-section scroll-mt-space-6"
      aria-labelledby="exhibition-traveling-heading"
    >
      <h2
        id="exhibition-traveling-heading"
        className="font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2 mb-space-5"
      >
        {traveling.heading}
      </h2>

      <p className="exhibition-section-lead mb-space-5">{traveling.intro}</p>

      <div className="exhibition-traveling-grid">
        <div className="exhibition-traveling-main">
          <figure className="exhibition-traveling-photo">
            {mediaFileExists(photoSrc) ? (
              <span className="exhibition-traveling-photo-frame">
                <Image
                  src={photoSrc}
                  alt={traveling.photoAlt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="exhibition-traveling-photo-image"
                />
              </span>
            ) : null}
            <figcaption className="exhibition-photo-caption">
              {traveling.photoCaption}{" "}
              <span className="exhibition-photo-caption-note">{traveling.photoCaptionNote}</span>
            </figcaption>
          </figure>

          <ul className="exhibition-traveling-list" aria-label={traveling.heading}>
            {items.map((item) => (
              <li key={item.newsSlug} className="exhibition-traveling-row">
                <span className="exhibition-traveling-place">{item.label}</span>
                <TextLink href={`/aktualnosci/${item.newsSlug}`}>{traveling.relationLink}</TextLink>
              </li>
            ))}
            {items.length === 0 ? (
              <li className="exhibition-traveling-pending">
                <span className="exhibition-traveling-pending-text">{traveling.pendingRow}</span>
              </li>
            ) : null}
          </ul>
        </div>

        <aside className="exhibition-cta-block">
          <p className="exhibition-cta-intro">{traveling.inviteCta}</p>
          <Button href={mailtoHref} variant="primary" block size="lg">
            {traveling.mailtoLabel}
          </Button>
        </aside>
      </div>
    </section>
  );
}
