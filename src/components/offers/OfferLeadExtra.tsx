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
        <p key={item.title} className="body-copy text-text-secondary mb-space-4 last:mb-0">
          <strong className="font-semibold text-text-list-title">{item.title}.</strong>{" "}
          {item.text.split("{link}").map((part, index) => (
            <Fragment key={index}>
              {index > 0 && item.link ? <TextLink href={item.link.href}>{item.link.label}</TextLink> : null}
              {part}
            </Fragment>
          ))}
          {item.whereWeWere && item.whereWeWere.length > 0 ? (
            <OfferLeadExtraWhereWeWere entries={item.whereWeWere} />
          ) : null}
        </p>
      ))}
    </section>
  );
}
