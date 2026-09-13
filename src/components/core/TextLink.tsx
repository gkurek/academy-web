import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /** Appends ↗ and opens in a new tab — external links only (blog, social). */
  external?: boolean;
  children: ReactNode;
}

const linkClass =
  "text-accent-text no-underline border-b border-accent-veil hover:text-accent-hover hover:border-accent-hover";

export function TextLink({ href, external = false, children, className, ...rest }: TextLinkProps) {
  const classes = [linkClass, className].filter(Boolean).join(" ");

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes} {...rest}>
        {children} ↗
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
