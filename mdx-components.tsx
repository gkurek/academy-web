import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";

import { OfferFigure } from "@/components/content/OfferFigure";
import { LectureSeasonLink } from "@/components/news/LectureSeasonLink";
import { OfferSideCta } from "@/components/offers/OfferSideCta";
import { OfferSidePhoto } from "@/components/offers/OfferSidePhoto";
import { nbspChildren } from "@/lib/typography";

/**
 * Bare `h3` with an anchor id (`<Heading3 id="…">`) — JSX literals in MDX bypass the
 * `h3` mapping. Typography and spacing come from the `Prose` wrapper (`.prose-*`),
 * never from this file; text tags (p, h2, h3, li) are mapped only to glue single-letter words.
 * Markdown images are not used in content (figures go through `OfferFigure`).
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

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: Heading2,
    h3: Heading3,
    p: Paragraph,
    li: ListItem,
    Heading3,
    LectureSeasonLink,
    OfferFigure,
    OfferSideCta,
    OfferSidePhoto,
    ...components,
  };
}
