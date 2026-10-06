import type { ReactNode } from "react";

type ProseVariant = "text" | "offer" | "news";

export interface ProseProps {
  /** text: text pages and articles · offer: offer pages · news: news article body (Garamond scale). */
  variant: ProseVariant;
  /** Layout only (grid placement, outer margin) — type and block rhythm come from the variant. */
  className?: string;
  children: ReactNode;
}

const variantClass = {
  text: "prose-text",
  offer: "prose-offer",
  news: "prose-news",
} as const satisfies Record<ProseVariant, string>;

/** Wrapper whose direct children (p, h2, h3, ul, ol) are styled by the `.prose-*` rules; MDX renders bare tags into it. */
export function Prose({ variant, className, children }: ProseProps) {
  return <div className={className ? `${variantClass[variant]} ${className}` : variantClass[variant]}>{children}</div>;
}
