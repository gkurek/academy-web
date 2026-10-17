import Link from "next/link";

import { getAuthorDisplayName, getAuthorProfileHref } from "@/content/authors";
import type { Author } from "@/content/types";

export interface PublicationTocAuthorProps {
  author: Author;
  className: string;
  /** Muted link for the compact list, so gold stays reserved for readable titles. */
  muted?: boolean;
}

/** Author line of an album TOC entry; links to the author's note when one exists. */
export function PublicationTocAuthor({ author, className, muted = false }: PublicationTocAuthorProps) {
  const href = getAuthorProfileHref(author);
  const name = getAuthorDisplayName(author);
  const linkClassName = muted
    ? "text-text-secondary no-underline hover:text-accent-hover"
    : "text-accent-text no-underline hover:text-accent-hover";

  return (
    <p className={className}>
      {href ? (
        <Link href={href} className={linkClassName}>
          {name}
        </Link>
      ) : (
        name
      )}
    </p>
  );
}
