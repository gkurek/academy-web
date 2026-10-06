import { Fragment } from "react";
import Link from "next/link";
import { pl } from "@/i18n/pl";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

// Used on publication pages (articles and the album) — never a single item,
// never alongside SectionNav (design/README §4).
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
            <Link href={item.href} className="inline-flex min-h-tap-min-mobile-header items-center text-text-tertiary transition-ui-colors hover:text-accent-hover lg:inline lg:min-h-0 lg:border-b lg:border-border-secondary">
              <span className="border-b border-border-secondary lg:border-b-0">{item.label}</span>
            </Link>
          ) : (
            <span className="text-text-secondary">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
