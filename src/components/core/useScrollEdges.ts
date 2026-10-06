"use client";

import { useEffect, useState, type RefObject } from "react";

export interface ScrollEdges {
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

/** Tracks whether a sideways-scrolling row has hidden content before / after the visible part. */
export function useScrollEdges(rowRef: RefObject<HTMLElement | null>): ScrollEdges {
  const [edges, setEdges] = useState<ScrollEdges>({ canScrollPrev: false, canScrollNext: false });

  useEffect(() => {
    const row = rowRef.current;
    if (!row) {
      return undefined;
    }

    const update = () => {
      const maxScroll = row.scrollWidth - row.clientWidth;
      const canScrollPrev = row.scrollLeft > 1;
      const canScrollNext = row.scrollLeft < maxScroll - 1;
      setEdges((current) =>
        current.canScrollPrev === canScrollPrev && current.canScrollNext === canScrollNext
          ? current
          : { canScrollPrev, canScrollNext },
      );
    };

    update();
    row.addEventListener("scroll", update, { passive: true });
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(row);

    return () => {
      row.removeEventListener("scroll", update);
      resizeObserver.disconnect();
    };
  }, [rowRef]);

  return edges;
}
