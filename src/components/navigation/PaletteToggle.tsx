"use client";

import { useSyncExternalStore } from "react";
import { pl } from "@/i18n/pl";

const PALETTE_ATTRIBUTE = "data-palette";
const ALTERNATIVE_PALETTE = "malachit";

export interface PaletteToggleProps {
  className?: string;
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: [PALETTE_ATTRIBUTE] });
  return () => observer.disconnect();
}

const getSnapshot = () => document.documentElement.getAttribute(PALETTE_ATTRIBUTE) === ALTERNATIVE_PALETTE;
const getServerSnapshot = () => false;

export function PaletteToggle({ className = "" }: PaletteToggleProps) {
  // <html> outlives client-side navigation, so the attribute carries the choice between pages
  // and keeps the desktop and mobile toggles in sync.
  const isAlternative = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    if (isAlternative) {
      document.documentElement.removeAttribute(PALETTE_ATTRIBUTE);
    } else {
      document.documentElement.setAttribute(PALETTE_ATTRIBUTE, ALTERNATIVE_PALETTE);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isAlternative}
      aria-label={pl.header.paletteToggleLabel}
      className={
        "flex h-tap-min-mobile-header w-tap-min-mobile-header flex-none items-center justify-center border border-border-button text-text-body " +
        className
      }
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4 A8 8 0 0 1 12 20 Z" fill="currentColor" />
      </svg>
    </button>
  );
}
