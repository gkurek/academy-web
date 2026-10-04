import type { MDXComponents } from "mdx/types";

import { LectureSeasonLink } from "@/components/news/LectureSeasonLink";

/**
 * Bare MDX elements for news articles: drops the global Tailwind classes from
 * `mdx-components.tsx` so only the `.news-prose` styles apply (D9 / E1).
 */
export const newsMdxComponents: MDXComponents = {
  h2: ({ children }) => <h2>{children}</h2>,
  h3: ({ children }) => <h3>{children}</h3>,
  p: ({ children }) => <p>{children}</p>,
  ul: ({ children }) => <ul>{children}</ul>,
  ol: ({ children }) => <ol>{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  LectureSeasonLink,
};
