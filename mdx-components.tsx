import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";

import { OfferFigure } from "@/components/content/OfferFigure";
import { ArticleFigure } from "@/components/publications/ArticleFigure";
import { LectureSeasonLink } from "@/components/news/LectureSeasonLink";
import { OfferSideCta } from "@/components/offers/OfferSideCta";
import { OfferSidePhoto } from "@/components/offers/OfferSidePhoto";
import { linkEvent } from "@/lib/analytics";
import { nbspChildren } from "@/lib/typography";

/**
 * Bare `h3` with an anchor id (`<Heading3 id="…">`) — JSX literals in MDX bypass the
 * `h3` mapping. Typography and spacing come from the `Prose` wrapper (`.prose-*`),
 * never from this file; text tags (p, h2, h3, li) are mapped only to glue single-letter words.
 * Markdown images are not used in content (figures go through `OfferFigure` / `ArticleFigure`).
 */
function Heading3({ id, children }: ComponentPropsWithoutRef<"h3">) {
  return <h3 id={id}>{nbspChildren(children)}</h3>;
}

function Heading2({ id, children }: ComponentPropsWithoutRef<"h2">) {
  return <h2 id={id}>{nbspChildren(children)}</h2>;
}

function Paragraph({ children }: ComponentPropsWithoutRef<"p">) {
  return <p>{nbspChildren(children)}</p>;
}

function ListItem({ children }: ComponentPropsWithoutRef<"li">) {
  return <li>{nbspChildren(children)}</li>;
}

/** Plain markdown link, unchanged except for the analytics event of a `mailto:` / `tel:` href (K-15). */
function Anchor({ href, children, ...rest }: ComponentPropsWithoutRef<"a">) {
  return (
    <a href={href} {...(href ? linkEvent(href) : {})} {...rest}>
      {children}
    </a>
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: Heading2,
    h3: Heading3,
    p: Paragraph,
    li: ListItem,
    a: Anchor,
    ArticleFigure,
    Heading3,
    LectureSeasonLink,
    OfferFigure,
    OfferSideCta,
    OfferSidePhoto,
    ...components,
  };
}
