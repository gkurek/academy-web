import type { AnchorHTMLAttributes, ReactNode } from "react";

import { pl } from "@/i18n/pl";

export interface ExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  /** When true, appends ↗ after the link text. */
  showIcon?: boolean;
}

export function ExternalLink({
  href,
  children,
  showIcon = true,
  className,
  ...rest
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...rest}
    >
      {children}
      {showIcon ? ` ${pl.a11y.externalLinkIcon}` : null}
      <span className="sr-only">{pl.a11y.externalLinkNewTab}</span>
    </a>
  );
}
