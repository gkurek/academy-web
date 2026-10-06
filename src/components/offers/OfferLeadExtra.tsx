import { Fragment, useId } from "react";

import { TextLink } from "@/components/core/TextLink";
import type { OfferLeadExtra as OfferLeadExtraData, OfferLeadExtraPlace } from "@/content/offers";
import { pl } from "@/i18n/pl";
import { PageHeading } from "@/components/core/PageHeading";

export interface OfferLeadExtraProps {
  leadExtra: OfferLeadExtraData;
}

function OfferLeadExtraWhereWeWere({ entries }: { entries: OfferLeadExtraPlace[] }) {
  return (
    <>
      {" "}
      {pl.offers.plenerWhereWeWereInline}{" "}
      {entries.map((entry, index) => (
        <Fragment key={entry.place}>
          {index > 0 ? ", " : null}
          {entry.newsSlug ? (
            <TextLink href={`/aktualnosci/${entry.newsSlug}`}>{entry.place}</TextLink>
          ) : (
            entry.place
          )}
        </Fragment>
      ))}
      .
    </>
  );
}

export function OfferLeadExtra({ leadExtra }: OfferLeadExtraProps) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="max-w-measure-prose">
      <PageHeading level="section" id={headingId} className="mb-space-4">
        {leadExtra.heading}
      </PageHeading>
      {leadExtra.items.map((item) => (
        <div key={item.title} className="mb-space-5 last:mb-0">
          <PageHeading level="sub" className="mb-space-2">
            {item.title}
          </PageHeading>
          <p className="body-copy text-text-body">
            {item.text}
            {item.whereWeWere && item.whereWeWere.length > 0 ? (
              <OfferLeadExtraWhereWeWere entries={item.whereWeWere} />
            ) : null}
          </p>
        </div>
      ))}
    </section>
  );
}
