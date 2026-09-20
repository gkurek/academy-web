import { Button } from "@/components/core/Button";
import { pl } from "@/i18n/pl";

/** K-46: no photo until a proper shoot; the button is the page's one sales CTA. */
export function GalleryOrderTeaser() {
  const { title, lead, linkLabel } = pl.gallery.orderTeaser;

  return (
    <section
      aria-labelledby="gallery-order-teaser-heading"
      className="mt-section-gap-mobile md:mt-section-gap pt-space-7 pb-section-gap-mobile md:pb-section-gap border-t border-line-gold"
    >
      <h2
        id="gallery-order-teaser-heading"
        className="font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2 mb-space-4"
      >
        {title}
      </h2>
      <p className="text-size-body leading-body text-text-secondary max-w-measure-prose mb-space-5">
        {lead}
      </p>
      <Button href="/ikony/na-zamowienie">{linkLabel}</Button>
    </section>
  );
}
