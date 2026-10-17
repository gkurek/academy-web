"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { ChevronIcon } from "@/components/core/icons";

/** With `expandFromMd`, the full TOC starts expanded from md up and collapsed below it. */
const TOC_EXPANDED_QUERY = "(min-width: 768px)";

export interface PublicationTocCollapseProps {
  label: string;
  /** false: collapsed on every viewport. */
  expandFromMd: boolean;
  children: ReactNode;
}

export function PublicationTocCollapse({ label, expandFromMd, children }: PublicationTocCollapseProps) {
  const ref = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(expandFromMd);

  // Server HTML is expanded (readable without JS); collapse on mobile after mount.
  // Setting the DOM property fires `toggle`, which syncs the state below.
  useEffect(() => {
    if (expandFromMd && ref.current && !window.matchMedia(TOC_EXPANDED_QUERY).matches) {
      ref.current.open = false;
    }
  }, [expandFromMd]);

  return (
    <details
      ref={ref}
      open={open}
      onToggle={(event) => setOpen((event.currentTarget as HTMLDetailsElement).open)}
      className="publication-toc-collapse"
    >
      <summary className="publication-toc-summary">
        {label}
        <ChevronIcon expanded={open} className="shrink-0 text-accent-text" />
      </summary>
      {children}
    </details>
  );
}
