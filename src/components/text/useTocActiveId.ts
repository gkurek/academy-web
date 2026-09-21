"use client";

import { useEffect, useState } from "react";

import type { TocItem } from "@/content/types";

function flattenTocIds(items: TocItem[]): string[] {
  return items.flatMap((item) => [item.id, ...(item.children?.map((child) => child.id) ?? [])]);
}

/** Highlights the TOC entry for the section most visible in the viewport. */
export function useTocActiveId(items: TocItem[]): string | undefined {
  const [activeId, setActiveId] = useState<string | undefined>(items[0]?.id);

  useEffect(() => {
    const ids = flattenTocIds(items);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element != null);

    if (elements.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const topEntry = visible[0];
        if (topEntry?.target.id) {
          setActiveId(topEntry.target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.1, 0.25, 0.5, 1] },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [items]);

  return activeId;
}
