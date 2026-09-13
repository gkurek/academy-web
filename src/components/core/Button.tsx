import type { MouseEventHandler, ReactNode } from "react";

export interface ButtonProps {
  children: ReactNode;
  /** Target href — usually a mailto: link with a subject from design/README §5. */
  href?: string;
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
  /** Full width — variant used in FactsBox. */
  block?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className?: string;
}

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  md: "px-btn-x-md py-btn-y-md text-size-body",
  lg: "px-btn-x-lg py-btn-y-lg text-size-body-lg",
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "border-transparent bg-accent text-text-on-gold font-semibold hover:bg-accent-text " +
    "aria-disabled:bg-state-disabled aria-disabled:text-text-tertiary aria-disabled:cursor-not-allowed",
  secondary:
    "border-border-button text-text-body font-medium hover:border-accent-text hover:text-accent-text " +
    "aria-disabled:border-line-neutral aria-disabled:text-state-disabled aria-disabled:cursor-not-allowed",
};

export function Button({
  children,
  href = "#",
  variant = "primary",
  size = "md",
  block = false,
  disabled = false,
  onClick,
  className,
}: ButtonProps) {
  return (
    <a
      href={disabled ? undefined : href}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled || undefined}
      className={[
        "rounded-none border text-center cursor-pointer box-border",
        block ? "block" : "inline-block",
        sizeClasses[size],
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </a>
  );
}
