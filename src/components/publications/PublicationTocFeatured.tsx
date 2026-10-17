import Link from "next/link";

import { PublicationTocAuthor } from "@/components/publications/PublicationTocAuthor";
import type { PublicationTocEntry } from "@/content/types";
import { pl } from "@/i18n/pl";

export interface PublicationTocFeaturedProps {
  /** TOC entries with a published article (`articleSlug`). */
  items: PublicationTocEntry[];
  /** Own subheading; off when the section H2 already names the cards. */
  showHeading: boolean;
}

/** Album texts readable on the site, pulled out above the full TOC as cards. */
export function PublicationTocFeatured({ items, showHeading }: PublicationTocFeaturedProps) {
  return (
    <div className="publication-toc-featured">
      {showHeading ? (
        <h3 className="heading-sub mb-space-4">{pl.publications.tocFeaturedHeading}</h3>
      ) : null}
      <ul className="publication-toc-featured-list">
        {items.map((item) => (
          <li key={item.title} className="publication-toc-card">
            <div className="publication-toc-card-main">
              <p className="list-title publication-toc-card-title">
                <Link href={`/publikacje/${item.articleSlug}`} className="publication-toc-card-link">
                  {item.title}
                </Link>
              </p>
              {item.author ? (
                <PublicationTocAuthor author={item.author} className="publication-toc-card-author" />
              ) : null}
            </div>
            <span className="publication-toc-card-read" aria-hidden="true">
              {pl.publications.tocReadOnline}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
