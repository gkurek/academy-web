import type { MouseEventHandler, ReactNode } from "react";

export interface FilterChipProps {
  children: ReactNode;
  active?: boolean;
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className?: string;
}

export function FilterChip({
  children,
  active = false,
  href = "#",
  onClick,
  className,
}: FilterChipProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={[
        "inline-block rounded-none px-space-5 py-space-3 text-size-ui no-underline",
        "transition-colors duration-150 ease-out",
        active
          ? "border border-accent bg-accent font-semibold text-text-on-gold"
          : "border border-border-button bg-transparent font-normal text-text-body hover:border-accent-text hover:text-accent-text",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </a>
  );
}
