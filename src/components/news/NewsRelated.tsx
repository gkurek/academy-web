import Link from "next/link";

import type { NewsRelatedLink } from "@/content/types";
import { pl } from "@/i18n/pl";

export interface NewsRelatedProps {
  links: NewsRelatedLink[];
}

export function NewsRelated({ links }: NewsRelatedProps) {
  if (links.length === 0) {
    return null;
  }

  return (
    <aside
      className="news-article-related-block news-article-rail-block"
      aria-labelledby="news-related-heading"
    >
      <h2 id="news-related-heading" className="news-article-entry-label news-article-related-heading">
        {pl.news.relatedHeading}
      </h2>
      <ul className="news-article-related-list">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link href={link.href} className="news-article-entry-link">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
