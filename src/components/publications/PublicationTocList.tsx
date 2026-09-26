"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { TextLink } from "@/components/core/TextLink";
import { getAuthorDisplayName, getAuthorProfileHref } from "@/content/authors";
import type { Publication } from "@/content/types";
import { pl } from "@/i18n/pl";

export interface PublicationTocListProps {
  items: Publication["toc"];
}

const TOC_PREVIEW_LIMIT = 10;

export function PublicationTocList({ items }: PublicationTocListProps) {
  const listId = useId();
  const [expanded, setExpanded] = useState(items.length <= TOC_PREVIEW_LIMIT);
  const hasHiddenItems = items.length > TOC_PREVIEW_LIMIT;

  return (
    <section className="publication-toc" aria-labelledby="publication-toc-heading">
      <h2 id="publication-toc-heading" className="publication-section-heading">
        {pl.publications.tocHeading}
      </h2>
      <p className="publication-section-lead publication-toc-lead-desktop">
        {pl.publications.tocLead}
      </p>
      <p className="publication-section-lead publication-toc-lead-mobile">
        {pl.publications.tocLeadMobile}
      </p>

      <ol id={listId} className="publication-toc-list">
        {items.map((item, index) => {
          const roleLabel = item.author.lecturerSlug
            ? pl.publications.roles.lecturer
            : pl.publications.roles.participant;
          const authorHref = getAuthorProfileHref(item.author);
          const authorName = getAuthorDisplayName(item.author);
          const isCollapsed = hasHiddenItems && !expanded && index >= TOC_PREVIEW_LIMIT;

          return (
            <li
              key={`${item.title}-${item.author.lecturerSlug ?? item.author.name}`}
              data-index={index}
              className={[
                item.articleSlug
                  ? "publication-toc-item publication-toc-item-linked"
                  : "publication-toc-item",
                isCollapsed ? "publication-toc-item-collapsed" : "",
              ]
                .filter(Boolean)
                .join(" ")}
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
                  <p className="publication-toc-author">
                    {authorHref ? (
                      <TextLink href={authorHref}>{authorName}</TextLink>
                    ) : (
                      authorName
                    )}
                    {" · "}
                    {roleLabel}
                  </p>
                </div>
                {item.articleSlug ? (
                  <span className="publication-toc-read-desktop" aria-hidden="true">
                    {pl.publications.tocReadOnline}
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      {hasHiddenItems && !expanded ? (
        <button
          type="button"
          className="publication-toc-expand btn-secondary"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded(true)}
        >
          {pl.publications.tocShowFull.replace("{count}", String(items.length))}
        </button>
      ) : null}
    </section>
  );
}
