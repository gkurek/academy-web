import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";

import { OfferFigure } from "@/components/content/OfferFigure";
import { SemesterProgram } from "@/components/content/SemesterProgram";
import { StepList } from "@/components/content/StepList";
import { NewsCta } from "@/components/news/NewsCta";

type ImgProps = ComponentPropsWithoutRef<"img">;

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
      <h2 className="font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2 mt-space-8 mb-space-4 first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-size-h3-m md:text-size-h3 leading-heading text-text-list-title mt-space-6 mb-space-3">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-size-body md:text-size-body-lg leading-body md:leading-prose text-text-body max-w-measure-prose mb-space-4 last:mb-0 [&:has(>em:only-child)]:font-serif [&:has(>em:only-child)]:italic [&:has(>em:only-child)]:text-size-body [&:has(>em:only-child)]:text-text-tertiary [&:has(>em:only-child)]:mt-space-3 [&:has(>em:only-child)]:mb-space-7">
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
    OfferFigure,
    SemesterProgram,
    StepList,
    NewsCta,
    ...components,
  };
}
