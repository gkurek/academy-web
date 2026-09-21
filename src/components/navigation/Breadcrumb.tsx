import { Fragment } from "react";
import Link from "next/link";
import { pl } from "@/i18n/pl";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

// Only used on a news entry — never a single item, never alongside SectionNav
// (design/README §4). Not wired into any route yet; that lands in etap 06.
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      aria-label={pl.breadcrumb.ariaLabel}
      className="flex flex-wrap items-baseline gap-space-2 text-size-caption text-text-tertiary font-sans"
    >
      {items.map((item, index) => (
        <Fragment key={item.label}>
          {index > 0 && <span aria-hidden="true">›</span>}
          {item.href ? (
            <Link href={item.href} className="text-text-tertiary border-b border-border-secondary">
              {item.label}
            </Link>
          ) : (
            <span className="text-text-secondary">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
