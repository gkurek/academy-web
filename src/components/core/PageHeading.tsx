import type { ReactNode } from "react";

type PageHeadingLevel = "page" | "section" | "sub";

export interface PageHeadingProps {
  /** Typographic role: page title (h1), section title (h2) or subtitle inside a section (h3). */
  level: PageHeadingLevel;
  /** Page level only: "home" is the hero title, "entry" the news article title. */
  variant?: "home" | "entry";
  id?: string;
  /** Margins and layout only — the role (font, size, leading, colour) is fixed. */
  className?: string;
  children: ReactNode;
}

const roleClass = {
  page: "heading-page",
  section: "heading-section",
  sub: "heading-sub",
} as const satisfies Record<PageHeadingLevel, string>;

export function PageHeading({ level, variant, id, className, children }: PageHeadingProps) {
  const classes = [roleClass[level], variant ? `heading-page--${variant}` : null, className]
    .filter(Boolean)
    .join(" ");

  if (level === "page") {
    return (
      <h1 id={id} className={classes}>
        {children}
      </h1>
    );
  }
  if (level === "section") {
    return (
      <h2 id={id} className={classes}>
        {children}
      </h2>
    );
  }
  return (
    <h3 id={id} className={classes}>
      {children}
    </h3>
  );
}
