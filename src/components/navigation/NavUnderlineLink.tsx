import Link from "next/link";
import type { MouseEvent } from "react";

export interface NavUnderlineLinkProps {
  href: string;
  label: string;
  /** Gold underline and accent colour. */
  isActive?: boolean;
  /** `page` for the current page, `true` for its section or a scroll-spy target. */
  ariaCurrent?: "page" | "true";
  /** `main` — Header and 404 sitemap; `section` — SectionNav and YearNav. */
  variant?: "main" | "section";
  /** Extra classes appended after the shared ones. */
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

const variantClass = {
  main: {
    active: "nav-link-underline nav-link-underline-active text-accent-text",
    idle: "nav-link-underline text-text-body hover:text-text-list-title",
  },
  section: {
    active: "nav-link-underline nav-link-underline-section nav-link-underline-active text-accent-text",
    idle: "nav-link-underline nav-link-underline-section text-text-secondary hover:text-accent-hover",
  },
};

/** Nav link with the gold underline (Header, SectionNav, YearNav, 404 sitemap). */
export function NavUnderlineLink({
  href,
  label,
  isActive = false,
  ariaCurrent,
  variant = "main",
  className,
  onClick,
}: NavUnderlineLinkProps) {
  const stateClass = isActive ? variantClass[variant].active : variantClass[variant].idle;

  return (
    <Link
      href={href}
      aria-current={ariaCurrent}
      onClick={onClick}
      className={[stateClass, "tap-target-nav", className].filter(Boolean).join(" ")}
    >
      <span className="link-underline-target">{label}</span>
    </Link>
  );
}
