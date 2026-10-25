import { OfferCard } from "@/components/content/OfferCard";
import { Button } from "@/components/core/Button";
import { ExhibitionFrame } from "@/components/exhibition/ExhibitionFrame";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { OfferQuoteGrid } from "@/components/offers/OfferQuoteGrid";
import { WorkshopsFaq } from "@/components/workshops/WorkshopsFaq";
import { WorkshopsStudentIcons } from "@/components/workshops/WorkshopsStudentIcons";
import { getEnrollmentState, getUpcomingOfferFacts, type LoadedOffer } from "@/content/offers";
import { getEnrollmentEmail } from "@/content/settings";
import {
  getWorkshopCardEyebrow,
  getWorkshopsHub,
  getWorkshopsHubQuotes,
  getWorkshopsHubStudentIcons,
} from "@/content/workshops-hub";
import { pl } from "@/i18n/pl";
import { PageHeading } from "@/components/core/PageHeading";
import { todayInWarsaw } from "@/lib/isoDate";

const hub = getWorkshopsHub();

export interface WorkshopsHubPageProps {
  /** Route path — see SectionPageShellProps["path"]. */
  path: string;
  offers: LoadedOffer[];
}

function WorkshopOfferCard({ offer }: { offer: LoadedOffer }) {
  const card = hub.cards[offer.slug];
  // A workshop offer without its hub card would silently vanish from /warsztaty — fail the build instead.
  if (!card) {
    throw new Error(`content/pages/workshops-hub.json: missing card for offer "${offer.slug}"`);
  }

  return (
    <OfferCard
      eyebrow={getWorkshopCardEyebrow(offer.kind, getUpcomingOfferFacts(), todayInWarsaw())}
      title={offer.title}
      excerpt={card.excerpt}
      bullets={card.bullets}
      href={`/warsztaty/${offer.slug}`}
      ctaLabel={card.ctaLabel}
      // Same enrollment state as the offer FactsBox: gold only while enrollment is open.
      ctaVariant={getEnrollmentState(offer) === "open" ? "primary" : "secondary"}
    />
  );
}

export function WorkshopsHubPage({ path, offers }: WorkshopsHubPageProps) {
  const { closing } = pl.workshopsHub;

  return (
    <SectionPageShell path={path}>
      <section className="pb-section-gap-tight">
        <PageHeading level="page" className="mb-space-5">
          {pl.workshopsHub.title}
        </PageHeading>
        <p className="text-size-lead-m md:text-size-lead leading-body text-text-secondary max-w-measure-lead">
          {hub.lead}
        </p>
      </section>

      <ExhibitionFrame image={hub.image} className="workshops-hub-photo" priority />

      <section className="mt-section-gap">
        <div className="offer-card-grid">
          {offers.map((offer) => (
            <WorkshopOfferCard key={offer.slug} offer={offer} />
          ))}
        </div>
      </section>

      <div className="mt-section-gap">
        <WorkshopsStudentIcons icons={getWorkshopsHubStudentIcons()} intro={hub.studentIcons.intro} />
      </div>

      <div className="mt-section-gap">
        <WorkshopsFaq items={hub.faq} />
      </div>

      <div className="mt-section-gap">
        <OfferQuoteGrid heading={pl.workshopsHub.quotesHeading} quotes={getWorkshopsHubQuotes()} columns={3} />
      </div>

      <section
        aria-labelledby="workshops-closing-heading"
        className="mt-section-gap flex flex-col gap-space-5 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <PageHeading level="section" id="workshops-closing-heading" className="mb-space-2">
            {closing.heading}
          </PageHeading>
          <p className="body-copy text-text-secondary">{closing.text}</p>
        </div>
        <Button href={`mailto:${getEnrollmentEmail()}`} variant="primary" size="lg" className="w-full md:w-auto">
          {closing.ctaLabel}
        </Button>
      </section>
    </SectionPageShell>
  );
}
