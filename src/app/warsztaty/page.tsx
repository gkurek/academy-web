import { OfferCard } from "@/components/content/OfferCard";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { OfferQuoteGrid } from "@/components/offers/OfferQuoteGrid";
import { getWorkshopOffers } from "@/content/offers";
import { getWorkshopTestimonials } from "@/content/testimonials";
import { pl } from "@/i18n/pl";
import { mainNav, sectionNav } from "@/navigation";

const mainNavActive = mainNav.find((item) => item.href === "/warsztaty")!.label;
const sectionActive = sectionNav.warsztaty[0].label;

export default function WorkshopsPage() {
  const offers = getWorkshopOffers();
  const quotes = getWorkshopTestimonials();

  return (
    <SectionPageShell active={mainNavActive} section="warsztaty" sectionActive={sectionActive}>
      <section className="pb-offer-hub-lead-pb">
        <h1 className="font-serif text-size-h1-m md:text-size-h1 leading-tight text-text-h1 mb-space-5">
          {pl.workshopsHub.title}
        </h1>
        <p className="text-size-lead-m md:text-size-lead leading-body text-text-secondary max-w-measure-lead mb-space-5">
          {pl.workshopsHub.lead}
        </p>
        <p className="text-size-body-lg leading-prose text-text-secondary max-w-measure-prose">
          {pl.workshopsHub.leadSecondary}
        </p>
      </section>

      <section>
        <div className="hairline-grid-2">
          {offers.map((offer) => {
            const image = pl.workshopsHub.cardImages[offer.slug as keyof typeof pl.workshopsHub.cardImages];
            const card = pl.workshopsHub.cards[offer.slug as keyof typeof pl.workshopsHub.cards];
            if (!image || !card) {
              return null;
            }

            return (
              <OfferCard
                key={offer.slug}
                eyebrow={card.eyebrow}
                title={offer.title}
                excerpt={card.excerpt}
                bullets={card.bullets}
                href={`/warsztaty/${offer.slug}`}
                ctaLabel={card.ctaLabel}
                ctaVariant={card.ctaVariant}
                image={image}
              />
            );
          })}
        </div>
      </section>

      <OfferQuoteGrid heading={pl.workshopsHub.quotesHeading} quotes={quotes} />
    </SectionPageShell>
  );
}
