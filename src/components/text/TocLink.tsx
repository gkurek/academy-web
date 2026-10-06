import Link from "next/link";

import type { TocItem } from "@/content/types";

export interface TocLinkProps {
  item: TocItem;
  activeId?: string;
  /** Second-level entry, indented. */
  nested?: boolean;
  /** `sidebar` — desktop sticky list; `collapse` — mobile details panel. */
  variant: "sidebar" | "collapse";
  onNavigate?: () => void;
}

function idleClass(variant: TocLinkProps["variant"], nested: boolean): string {
  if (variant === "sidebar") {
    return "text-text-tertiary hover:text-accent-hover";
  }
  return nested ? "text-text-tertiary" : "text-text-secondary";
}

/** In-page table of contents link — scroll-spy state via `aria-current="location"`. */
export function TocLink({ item, activeId, nested = false, variant, onNavigate }: TocLinkProps) {
  const isActive = item.id === activeId;
  const nestedClass = variant === "sidebar" ? "pl-space-4 text-size-ui" : "pl-space-4 text-size-ui text-text-tertiary";

  return (
    <Link
      href={`#${item.id}`}
      onClick={onNavigate}
      aria-current={isActive ? "location" : undefined}
      className={[
        "tap-target-nav flex items-center text-size-body leading-body",
        nested ? nestedClass : "",
        isActive ? "text-accent-text" : idleClass(variant, nested),
      ].join(" ")}
    >
      {item.label}
    </Link>
  );
}
