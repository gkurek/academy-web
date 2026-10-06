"use client";

import { useEffect, useRef, useState } from "react";

import { pl } from "@/i18n/pl";

export interface MapBlockProps {
  /** Google Maps embed URL; without it, renders an empty tile with a short note. */
  embedSrc?: string;
}

export function MapBlock({ embedSrc }: MapBlockProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [focused, setFocused] = useState(false);

  // A cross-origin frame matches no focus pseudo-class, so the wrapper draws the ring: the window
  // loses focus to the frame (blur) and gets it back when focus leaves it (focus).
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) {
      return undefined;
    }

    const onBlur = () => setFocused(document.activeElement === frame);
    const onFocus = () => setFocused(false);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, [embedSrc]);

  if (!embedSrc) {
    return (
      <div className="flex h-contact-map-m md:h-contact-map items-center justify-center bg-surface-tile px-page-margin-mobile text-center text-size-ui text-text-tertiary md:px-space-6">
        {pl.contact.mapPlaceholder}
      </div>
    );
  }

  return (
    <div className="map-frame" data-focused={focused ? "" : undefined}>
      <iframe
        ref={frameRef}
        src={embedSrc}
        title={pl.contact.mapTitle}
        className="block h-contact-map-m md:h-contact-map w-full border-0 bg-surface-tile"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
