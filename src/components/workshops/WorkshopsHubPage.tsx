import { OfferCard } from "@/components/content/OfferCard";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { OfferQuoteGrid } from "@/components/offers/OfferQuoteGrid";
import { getOfferDateValues, type LoadedOffer } from "@/content/offers";
import { getWorkshopsHub } from "@/content/workshops-hub";
import type { Testimonial } from "@/content/types";
import { pl } from "@/i18n/pl";
import { fillRequiredTemplate } from "@/lib/fillTemplate";

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

  const dateValues = getOfferDateValues(offer.facts);
  const context = `workshops-hub.json cards.${offer.slug}`;

  return (
    <OfferCard
      eyebrow={fillRequiredTemplate(card.eyebrow, dateValues, context)}
      title={offer.title}
      excerpt={card.excerpt}
      bullets={card.bullets.map((bullet) => fillRequiredTemplate(bullet, dateValues, context))}
      href={`/warsztaty/${offer.slug}`}
      ctaLabel={card.ctaLabel}
      ctaVariant={card.ctaVariant}
      image={card.image}
    />
  );
}

export function WorkshopsHubPage({ path, offers, quotes }: WorkshopsHubPageProps) {
  return (
    <SectionPageShell path={path}>
      <section className="pb-offer-hub-lead-pb">
        <h1 className="font-serif text-size-h1-m md:text-size-h1 leading-tight text-text-h1 mb-space-5">
          {pl.workshopsHub.title}
        </h1>
        <p className="text-size-lead-m md:text-size-lead leading-body text-text-secondary max-w-measure-lead mb-space-5">
          {hub.lead}
        </p>
        <p className="text-size-body-lg leading-prose text-text-secondary max-w-measure-prose">
          {hub.leadSecondary}
        </p>
      </section>

      <section>
        <div className="hairline-grid-2">
          {offers.map((offer) => (
            <WorkshopOfferCard key={offer.slug} offer={offer} />
          ))}
        </div>
      </section>

      <OfferQuoteGrid heading={pl.workshopsHub.quotesHeading} quotes={quotes} />
    </SectionPageShell>
  );
}
