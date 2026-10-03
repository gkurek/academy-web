import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

import { ExternalLink } from "@/components/core/ExternalLink";

export interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /** Appends ↗ and opens in a new tab — external links only (blog, social). */
  external?: boolean;
  children: ReactNode;
}

const linkClass =
  "text-link text-accent-text no-underline hover:text-accent-hover";

const underlineTargetClass = "link-underline-target link-underline-target--border";

export function TextLink({ href, external = false, children, className, ...rest }: TextLinkProps) {
  const classes = [linkClass, className].filter(Boolean).join(" ");

  if (external) {
    return (
      <ExternalLink href={href} className={classes} {...rest}>
        <span className={underlineTargetClass}>{children}</span>
      </ExternalLink>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      <span className={underlineTargetClass}>{children}</span>
    </Link>
  );
}
