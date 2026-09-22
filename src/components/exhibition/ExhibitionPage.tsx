import Image from "next/image";

import { TextLink } from "@/components/core/TextLink";
import { ExhibitionEditionCard } from "@/components/exhibition/ExhibitionEditionCard";
import { ExhibitionEditionGallery } from "@/components/exhibition/ExhibitionEditionGallery";
import { ExhibitionPhotoPlaceholder } from "@/components/exhibition/ExhibitionPhotoPlaceholder";
import { ExhibitionFacts } from "@/components/exhibition/ExhibitionFacts";
import { ExhibitionPoster } from "@/components/exhibition/ExhibitionPoster";
import { ExhibitionPreviewBanner } from "@/components/exhibition/ExhibitionPreviewBanner";
import { ExhibitionTourList } from "@/components/exhibition/ExhibitionTourList";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import {
  getCurrentEdition,
  getExhibitionPage,
  getPreviousEditions,
  resolveExhibitionState,
} from "@/content/exhibition";
import { pl } from "@/i18n/pl";
import { filterExistingPhotos, mediaFileExists } from "@/lib/mediaFileExists";

export interface ExhibitionPageProps {
  active: string;
  sectionActive: string;
}

export function ExhibitionPage({ active, sectionActive }: ExhibitionPageProps) {
  const page = getExhibitionPage();
  const currentEdition = getCurrentEdition();
  const previousEditions = getPreviousEditions();
  const state = resolveExhibitionState();
  const photos = filterExistingPhotos(currentEdition.photos);

  const currentHeading = pl.exhibition.currentEdition.heading.replace(
    "{year}",
    String(currentEdition.year),
  );

  return (
    <SectionPageShell active={active} section="ikony" sectionActive={sectionActive}>
      <div className="mx-auto w-full max-w-content-max">
        <header>
          <h1 className="font-serif text-size-h1-m md:text-size-h1 leading-tight text-text-h1 mb-space-4 md:mb-space-5">
            {page.title}
          </h1>
          <p className="text-size-lead-m md:text-size-lead leading-body text-text-secondary max-w-measure-lead">
            {page.lead}
          </p>
        </header>

        <div className="exhibition-facts-wrap">
          {state === "zapowiedz" ? <ExhibitionPreviewBanner edition={currentEdition} /> : null}
          <ExhibitionFacts currentEdition={currentEdition} />
        </div>

        <section className="exhibition-section" aria-labelledby="exhibition-current-heading">
          <h2
            id="exhibition-current-heading"
            className="font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2 mb-space-5"
          >
            {currentHeading}
          </h2>

          <div className="exhibition-current-grid">
            <div className="exhibition-current-main">
              <ExhibitionEditionGallery
                photos={photos}
                placeholderLabel={pl.exhibition.currentEdition.photoPlaceholder.replace(
                  "{year}",
                  String(currentEdition.year),
                )}
                heroAlt={pl.exhibition.currentEdition.heroAlt.replace(
                  "{year}",
                  String(currentEdition.year),
                )}
              >
                {currentEdition.summary ? (
                  <p className="text-size-body md:text-size-body-lg leading-body md:leading-prose text-text-secondary mb-space-4">
                    {currentEdition.summary}
                  </p>
                ) : null}

                {currentEdition.seasonTheme ? (
                  <p className="text-size-body md:text-size-body-lg leading-body md:leading-prose text-text-secondary">
                    {pl.exhibition.currentEdition.seasonIntro.replace(
                      "{theme}",
                      currentEdition.seasonTheme,
                    )}{" "}
                    <TextLink href="/wyklady">{pl.exhibition.currentEdition.seasonLink}</TextLink>
                  </p>
                ) : null}
              </ExhibitionEditionGallery>
            </div>

            <ExhibitionPoster edition={currentEdition} />
          </div>
        </section>

        <section className="exhibition-section" aria-labelledby="exhibition-description-heading">
          <h2
            id="exhibition-description-heading"
            className="font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2 mb-space-5"
          >
            {pl.exhibition.description.heading}
          </h2>
          <div className="exhibition-description-grid">
            <div className="exhibition-description-copy">
              {page.descriptionParagraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-size-body md:text-size-body-lg leading-body md:leading-prose text-text-secondary mb-space-4 last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="exhibition-description-photos">
              {page.interiorPhotos.map((photo) => (
                <figure key={photo.src} className="exhibition-interior-figure">
                  {mediaFileExists(photo.src) ? (
                    <span className="exhibition-interior-frame">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="exhibition-interior-image"
                      />
                    </span>
                  ) : (
                    <ExhibitionPhotoPlaceholder
                      className="exhibition-interior-placeholder"
                      label={pl.exhibition.description.photoPlaceholder}
                    />
                  )}
                  {photo.caption ? (
                    <figcaption className="exhibition-interior-caption">{photo.caption}</figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </div>
        </section>

        <ExhibitionTourList edition={currentEdition} state={state} />

        <section className="exhibition-section" aria-labelledby="exhibition-previous-heading">
          <h2
            id="exhibition-previous-heading"
            className="font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2 mb-space-5"
          >
            {pl.exhibition.previousEdition.heading}
          </h2>
          <p className="text-size-body md:text-size-body-lg leading-body md:leading-prose text-text-secondary max-w-measure-prose mb-space-6">
            {pl.exhibition.previousEdition.lead}
          </p>
          <ul className="exhibition-edition-list">
            {previousEditions.map((edition) => (
              <ExhibitionEditionCard
                key={edition.year}
                edition={edition}
                photos={filterExistingPhotos(edition.photos)}
              />
            ))}
          </ul>
        </section>

        <footer className="exhibition-footer-links">
          <span className="text-size-body text-text-secondary">{pl.exhibition.footer.intro}</span>
          <TextLink href="/ikony">{pl.exhibition.footer.galleryLink}</TextLink>
          <TextLink href="/ikony/na-zamowienie">{pl.exhibition.footer.orderLink}</TextLink>
        </footer>
      </div>
    </SectionPageShell>
  );
}
