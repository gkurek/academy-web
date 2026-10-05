import { Button } from "@/components/core/Button";

import { TextLink } from "@/components/core/TextLink";

import { pl } from "@/i18n/pl";



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

      <div className="exhibition-tours-pass">

        <div className="exhibition-tours-pass__content">

          <h2

            id="exhibition-tours-heading"

            className="font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2 mb-space-2"

          >

            {tours.title}

          </h2>

          <p className="exhibition-section-copy exhibition-tours-pass__intro max-w-measure-lead">

            {tours.introBefore}

            <TextLink href="/aktualnosci">{tours.scheduleNewsLink}</TextLink>

            {tours.introAfter}

          </p>

        </div>

        <Button

          href={mailtoHref}

          variant="primary"

          block

          size="lg"

          className="exhibition-tours-pass__cta md:inline-block"

        >

          {tours.mailtoLabel}

        </Button>

      </div>

    </section>

  );

}



export type TravelingPlaceItem = {

  place: string;

  newsSlug?: string;

};



export interface ExhibitionTravelingSectionProps {

  mailtoHref: string;

  places: TravelingPlaceItem[];

}



export function ExhibitionTravelingSection({

  mailtoHref,

  places,

}: ExhibitionTravelingSectionProps) {

  const { traveling } = pl.exhibition;



  return (

    <section

      id={traveling.sectionId}

      className="exhibition-section scroll-mt-space-6"

      aria-labelledby="exhibition-traveling-heading"

    >

      <div className="exhibition-traveling-grid">

        <div className="exhibition-traveling-grid__main min-w-0">

          <h2

            id="exhibition-traveling-heading"

            className="font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2 mb-space-5"

          >

            {traveling.heading}

          </h2>

          <p className="exhibition-section-copy">

          {traveling.introBefore}

          {places.map((place, index) => (

            <span key={place.place}>

              {index > 0 ? (index === places.length - 1 ? " i " : ", ") : null}

              {place.newsSlug ? (

                <TextLink href={`/aktualnosci/${place.newsSlug}`}>{place.place}</TextLink>

              ) : (

                place.place

              )}

            </span>

          ))}

          {traveling.introAfter}

          </p>

        </div>



        <div className="exhibition-cta-block">

          <p className="exhibition-cta-intro">{traveling.inviteCta}</p>

          <Button href={mailtoHref} variant="primary" block size="lg">

            {traveling.mailtoLabel}

          </Button>

        </div>

      </div>

    </section>

  );

}


