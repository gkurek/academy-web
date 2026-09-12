import Link from "next/link";
import { pl } from "@/i18n/pl";
import type { NavLink } from "@/navigation";

export interface SectionNavProps {
  items: NavLink[];
  /** Label of the current item, e.g. "Archiwum" — the first item stands in for the hub itself. */
  active?: string;
}

export function SectionNav({ items, active }: SectionNavProps) {
  return (
    <nav
      aria-label={pl.sectionNav.ariaLabel}
      className="flex flex-wrap gap-space-6 pb-space-4 mb-space-6 text-size-ui font-sans"
    >
      {items.map((item) => {
        const isActive = item.label === active;
        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "border-b border-accent pb-link-underline-gap text-accent-text"
                : "border-b border-transparent pb-link-underline-gap text-text-secondary hover:border-accent-hover hover:text-accent-hover"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
