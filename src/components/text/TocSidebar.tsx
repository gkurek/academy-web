import type { TocItem } from "@/content/types";
import { pl } from "@/i18n/pl";
import { TocLink } from "@/components/text/TocLink";

export interface TocSidebarProps {
  items: TocItem[];
  activeId?: string;
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
            <TocLink item={item} activeId={activeId} variant="sidebar" />
            {item.children?.map((child) => (
              <TocLink key={child.id} item={child} activeId={activeId} nested variant="sidebar" />
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
}
