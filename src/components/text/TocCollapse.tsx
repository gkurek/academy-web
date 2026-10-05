"use client";

import { useState } from "react";

import type { TocItem } from "@/content/types";
import { pl } from "@/i18n/pl";
import { TocLink } from "@/components/text/TocLink";

export interface TocCollapseProps {
  items: TocItem[];
  activeId?: string;
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-accent-text"
    >
      {expanded ? <path d="M5 15 L12 8 L19 15" /> : <path d="M6 10 L12 16 L18 10" />}
    </svg>
  );
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
        className="flex min-h-tap-min cursor-pointer list-none items-center justify-between text-size-body text-text-secondary [&::-webkit-details-marker]:hidden"
      >
        {pl.textPage.tocLabel}
        <ChevronIcon expanded={open} />
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
