import Link from "next/link";

import type { TocItem } from "@/content/types";
import { pl } from "@/i18n/pl";

export interface TocSidebarProps {
  items: TocItem[];
  activeId?: string;
}

function TocLink({
  item,
  activeId,
  nested = false,
}: {
  item: TocItem;
  activeId?: string;
  nested?: boolean;
}) {
  const isActive = item.id === activeId;

  return (
    <Link
      href={`#${item.id}`}
      className={[
        "tap-target-nav flex items-center text-size-body leading-body",
        nested ? "pl-space-4 text-size-ui" : "",
        isActive ? "text-accent-text" : "text-text-tertiary hover:text-accent-hover",
      ].join(" ")}
    >
      {item.label}
    </Link>
  );
}

export function TocSidebar({ items, activeId }: TocSidebarProps) {
  return (
    <nav
      aria-label={pl.textPage.tocAriaLabel}
      className="text-size-body leading-body text-text-tertiary"
    >
      <p className="mb-space-2 text-size-caption uppercase tracking-caption-wide text-text-tertiary">
        {pl.textPage.tocLabel}
      </p>
      <div className="flex flex-col">
        {items.map((item) => (
          <div key={item.id}>
            <TocLink item={item} activeId={activeId} />
            {item.children?.map((child) => (
              <TocLink key={child.id} item={child} activeId={activeId} nested />
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
}
