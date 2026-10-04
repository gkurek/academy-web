import Link from "next/link";
import { Fragment } from "react";

import type { OfferLeadExtra as OfferLeadExtraData, OfferLeadExtraPlace } from "@/content/offers";
import { pl } from "@/i18n/pl";

const whereWeWereLinkClass =
  "text-link text-accent-text no-underline hover:text-accent-hover";

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
            <Link href={`/aktualnosci/${entry.newsSlug}`} className={whereWeWereLinkClass}>
              {entry.place}
            </Link>
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
  return (
    <section aria-labelledby="offer-lead-extra-heading" className="max-w-measure-prose">
      <h2
        id="offer-lead-extra-heading"
        className="font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2 mb-space-4"
      >
        {leadExtra.heading}
      </h2>
      {leadExtra.items.map((item) => (
        <div key={item.title} className="mb-space-5 last:mb-0">
          <h3 className="font-serif text-size-role-row-title-m md:text-size-role-row-title leading-heading text-text-list-title mb-space-2">
            {item.title}
          </h3>
          <p className="text-size-body md:text-size-body-lg leading-body md:leading-prose text-text-secondary">
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
