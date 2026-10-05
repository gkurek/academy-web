import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";

import { OfferFigure } from "@/components/content/OfferFigure";
import { LectureSeasonLink } from "@/components/news/LectureSeasonLink";
import { OfferSideCta } from "@/components/offers/OfferSideCta";

/**
 * Bare `h3` with an anchor id (`<Heading3 id="…">`) — JSX literals in MDX bypass the
 * `h3` mapping. Typography and spacing come from the `Prose` wrapper (`.prose-*`),
 * never from this file; plain tags (p, h2, h3, ul, ol, li) are left unmapped on purpose.
 * Markdown images are not used in content (figures go through `OfferFigure`).
 */
function Heading3({ id, children }: ComponentPropsWithoutRef<"h3">) {
  return <h3 id={id}>{children}</h3>;
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Heading3,
    LectureSeasonLink,
    OfferFigure,
    OfferSideCta,
    ...components,
  };
}
