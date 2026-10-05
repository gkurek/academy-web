import { useId } from "react";

import { Button } from "@/components/core/Button";
import { pl } from "@/i18n/pl";
import { PageHeading } from "@/components/core/PageHeading";

/** K-46: no photo until a proper shoot; the button is the page's one sales CTA. */
export function GalleryOrderTeaser() {
  const headingId = useId();
  const { title, lead, linkLabel } = pl.gallery.orderTeaser;

  return (
    <section
      aria-labelledby={headingId}
      className="mt-section-gap"
    >
      <div className="exhibition-tours-pass border-b-0">
        <div className="exhibition-tours-pass__content">
          <PageHeading level="section" id={headingId} className="mb-heading-gap">
            {title}
          </PageHeading>
          <p className="exhibition-section-copy exhibition-tours-pass__intro max-w-measure-lead">
            {lead}
          </p>
        </div>
        <Button
          href="/ikony/na-zamowienie"
          variant="primary"
          block
          size="lg"
          className="exhibition-tours-pass__cta md:inline-block"
        >
          {linkLabel}
        </Button>
      </div>
    </section>
  );
}
