import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";

import { OfferFigure } from "@/components/content/OfferFigure";
import { OfferSideCta } from "@/components/offers/OfferSideCta";
type ImgProps = ComponentPropsWithoutRef<"img">;

/**
 * MDX h3 style. Also exposed as `Heading3` so content can set an anchor id
 * (`<Heading3 id="…">`) — JSX literals in MDX bypass the `h3` mapping.
 */
function MdxHeading3({ id, children }: ComponentPropsWithoutRef<"h3">) {
  return (
    <h3
      id={id}
      className="font-serif text-size-h3-m md:text-size-h3 leading-heading text-text-list-title mt-space-6 mb-space-3 scroll-mt-space-6"
    >
      {children}
    </h3>
  );
}

function MdxImage({ src, alt, width, height }: ImgProps) {
  if (!src || typeof src !== "string") {
    return null;
  }

  const w = typeof width === "number" ? width : 960;
  const h = typeof height === "number" ? height : 540;

  return (
    <Image
      src={src}
      alt={alt ?? ""}
      width={w}
      height={h}
      sizes="(min-width: 768px) 66vw, 100vw"
      className="w-full h-offer-figure-h-m md:h-offer-figure-h object-cover"
    />
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => (
      <h2 className="font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2 mt-section-gap mb-heading-gap first:mt-0">
        {children}
      </h2>
    ),
    h3: MdxHeading3,
    p: ({ children }) => (
      <p className="text-size-body md:text-size-body-lg leading-body md:leading-prose text-text-body max-w-measure-prose mb-space-4 last:mb-0">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="mb-space-4 list-disc pl-space-6 text-size-body leading-body text-text-body">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-space-4 list-decimal pl-space-6 text-size-body leading-body text-text-body">{children}</ol>
    ),
    li: ({ children }) => <li className="mb-space-2">{children}</li>,
    img: MdxImage,
    Heading3: MdxHeading3,
    OfferFigure,
    OfferSideCta,
    ...components,
  };
}
