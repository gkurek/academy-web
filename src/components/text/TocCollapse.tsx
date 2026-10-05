"use client";

import { useState } from "react";

import { ChevronIcon } from "@/components/core/icons";
import type { TocItem } from "@/content/types";
import { pl } from "@/i18n/pl";
import { TocLink } from "@/components/text/TocLink";

export interface TocCollapseProps {
  items: TocItem[];
  activeId?: string;
}

export function TocCollapse({ items, activeId }: TocCollapseProps) {
  const [open, setOpen] = useState(false);

  const closeOnNavigate = () => setOpen(false);

  return (
    <details
      open={open}
      onToggle={(event) => setOpen((event.currentTarget as HTMLDetailsElement).open)}
      className="border-y border-line-neutral"
    >
      <summary
        className="flex min-h-tap-min cursor-pointer items-center justify-between text-size-body text-text-secondary"
      >
        {pl.textPage.tocLabel}
        <ChevronIcon expanded={open} className="shrink-0 text-accent-text" />
      </summary>
      <nav aria-label={pl.textPage.tocAriaLabel} className="flex flex-col pb-space-3">
        {items.map((item) => (
          <div key={item.id}>
            <TocLink item={item} activeId={activeId} variant="collapse" onNavigate={closeOnNavigate} />
            {item.children?.map((child) => (
              <TocLink
                key={child.id}
                item={child}
                activeId={activeId}
                nested
                variant="collapse"
                onNavigate={closeOnNavigate}
              />
            ))}
          </div>
        ))}
      </nav>
    </details>
  );
}
