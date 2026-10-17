import Link from "next/link";

import { PublicationTocAuthor } from "@/components/publications/PublicationTocAuthor";
import type { PublicationTocEntry } from "@/content/types";

export interface PublicationTocItemProps {
  item: PublicationTocEntry;
}

/** Compact book-style TOC row: title, author below. Only texts published on the site are links. */
export function PublicationTocItem({ item }: PublicationTocItemProps) {
  return (
    <li className="publication-toc-item">
      {item.articleSlug ? (
        <Link href={`/publikacje/${item.articleSlug}`} className="publication-toc-title-link">
          {item.title}
        </Link>
      ) : (
        <p className="publication-toc-title">{item.title}</p>
      )}
      {item.author ? (
        <PublicationTocAuthor author={item.author} className="publication-toc-author" muted />
      ) : null}
    </li>
  );
}
