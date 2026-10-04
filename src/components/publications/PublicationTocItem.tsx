import Link from "next/link";

import { getAuthorDisplayName, getAuthorProfileHref } from "@/content/authors";
import type { PublicationTocEntry } from "@/content/types";
import { pl } from "@/i18n/pl";

export interface PublicationTocItemProps {
  item: PublicationTocEntry;
}

export function PublicationTocItem({ item }: PublicationTocItemProps) {
  const { author } = item;
  const authorHref = author ? getAuthorProfileHref(author) : undefined;
  const authorName = author ? getAuthorDisplayName(author) : undefined;

  return (
    <li
      className={
        item.articleSlug
          ? "publication-toc-item publication-toc-item-linked"
          : "publication-toc-item"
      }
    >
      {item.articleSlug ? (
        <p className="publication-toc-read-label">{pl.publications.tocReadOnline}</p>
      ) : null}
      <div className="publication-toc-row">
        <div className="publication-toc-main">
          {item.articleSlug ? (
            <Link href={`/publikacje/${item.articleSlug}`} className="publication-toc-title-link">
              {item.title}
            </Link>
          ) : (
            <p className="publication-toc-title">{item.title}</p>
          )}
          {authorName ? (
            <p className="publication-toc-author">
              {authorHref ? (
                <Link
                  href={authorHref}
                  className="text-accent-text no-underline hover:text-accent-hover"
                >
                  {authorName}
                </Link>
              ) : (
                authorName
              )}
            </p>
          ) : null}
        </div>
        {item.articleSlug ? (
          <span className="publication-toc-read-desktop" aria-hidden="true">
            {pl.publications.tocReadOnline}
          </span>
        ) : null}
      </div>
    </li>
  );
}
