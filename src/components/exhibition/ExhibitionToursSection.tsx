import { Button } from "@/components/core/Button";
import { TextLink } from "@/components/core/TextLink";
import { getExhibitionCopy } from "@/content/exhibition";
import { pl } from "@/i18n/pl";

export interface ExhibitionToursSectionProps {
  mailtoHref: string;
}

export function ExhibitionToursSection({ mailtoHref }: ExhibitionToursSectionProps) {
  const { tours } = pl.exhibition;
  const toursCopy = getExhibitionCopy().tours;

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
            {toursCopy.introBefore}
            <TextLink href="/aktualnosci">{tours.scheduleNewsLink}</TextLink>
            {toursCopy.introAfter}
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
