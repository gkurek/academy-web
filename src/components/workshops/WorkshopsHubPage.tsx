import { OfferCard } from "@/components/content/OfferCard";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { OfferQuoteGrid } from "@/components/offers/OfferQuoteGrid";
import { getEnrollmentState, getUpcomingOfferFacts, type LoadedOffer } from "@/content/offers";
import { getWorkshopCardEyebrow, getWorkshopsHub } from "@/content/workshops-hub";
import type { Testimonial } from "@/content/types";
import { pl } from "@/i18n/pl";
import { PageHeading } from "@/components/core/PageHeading";
import { todayInWarsaw } from "@/lib/isoDate";

const hub = getWorkshopsHub();

export interface WorkshopsHubPageProps {
  /** Route path — see SectionPageShellProps["path"]. */
  path: string;
  offers: LoadedOffer[];
  quotes: Testimonial[];
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
      image={card.image}
    />
  );
}

export function WorkshopsHubPage({ path, offers, quotes }: WorkshopsHubPageProps) {
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

      <section>
        <div className="hairline-grid-2">
          {offers.map((offer) => (
            <WorkshopOfferCard key={offer.slug} offer={offer} />
          ))}
        </div>
      </section>

      <div className="mt-section-gap">
        {/* Two quotes would leave an empty third column on lg. */}
        <OfferQuoteGrid
          heading={pl.workshopsHub.quotesHeading}
          quotes={quotes}
          columns={quotes.length === 2 ? 2 : 3}
        />
      </div>
    </SectionPageShell>
  );
}
