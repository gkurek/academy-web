"use client";

import Link from "next/link";
import { useState } from "react";

import { TextLink } from "@/components/core/TextLink";
import type { Publication } from "@/content/types";
import { pl } from "@/i18n/pl";

export interface PublicationTocListProps {
  items: Publication["toc"];
}

const TOC_PREVIEW_LIMIT = 10;

export function PublicationTocList({ items }: PublicationTocListProps) {
  const [expanded, setExpanded] = useState(items.length <= TOC_PREVIEW_LIMIT);
  const visibleItems = expanded ? items : items.slice(0, TOC_PREVIEW_LIMIT);
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

      <ul className="publication-toc-list">
        {visibleItems.map((item) => {
          const roleLabel = item.author.lecturerSlug
            ? pl.publications.roles.lecturer
            : pl.publications.roles.participant;
          const authorHref = item.author.lecturerSlug
            ? `/wyklady/wykladowcy#${item.author.lecturerSlug}`
            : undefined;

          return (
            <li
              key={`${item.title}-${item.author.name}`}
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
                  <p className="publication-toc-author">
                    {authorHref ? (
                      <TextLink href={authorHref}>{item.author.name}</TextLink>
                    ) : (
                      item.author.name
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
      </ul>

      {hasHiddenItems && !expanded ? (
        <button
          type="button"
          className="publication-toc-expand btn-secondary"
          onClick={() => setExpanded(true)}
        >
          {pl.publications.tocShowFull.replace("{count}", String(items.length))}
        </button>
      ) : null}

      <p className="publication-toc-footnote">
        {pl.publications.tocFootnote.replace("{count}", String(items.length))}
      </p>
    </section>
  );
}
