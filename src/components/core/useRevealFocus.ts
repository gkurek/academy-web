"use client";

import { useEffect, useRef } from "react";

import { scrollBehavior } from "@/lib/scroll";

/**
 * Scrolls a sideways-scrolling row so the focused item is fully visible (WCAG 2.4.11).
 * Browsers skip the scroll when the item is only partly hidden; scroll-padding keeps the ring inside.
 */
export function useRevealFocus<T extends HTMLElement>() {
  const rowRef = useRef<T>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) {
      return undefined;
    }

    const reveal = (event: FocusEvent) => {
      if (event.target instanceof HTMLElement) {
        event.target.scrollIntoView({ inline: "nearest", block: "nearest", behavior: scrollBehavior() });
      }
    };

    row.addEventListener("focusin", reveal);
    return () => row.removeEventListener("focusin", reveal);
  }, []);

  return rowRef;
}
