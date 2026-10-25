import { TextLink } from "@/components/core/TextLink";
import { getExhibitionCopy } from "@/content/exhibition";
import { pl } from "@/i18n/pl";
import { PageHeading } from "@/components/core/PageHeading";

export function ExhibitionToursSection() {
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
          <PageHeading level="section" id="exhibition-tours-heading" className="mb-space-2">
            {tours.title}
          </PageHeading>
          <p className="exhibition-section-copy exhibition-tours-pass__intro max-w-measure-lead">
            {toursCopy.introBefore}
            <TextLink href="/aktualnosci">{tours.scheduleNewsLink}</TextLink>
            {toursCopy.introAfter}
          </p>
        </div>
      </div>
    </section>
  );
}
