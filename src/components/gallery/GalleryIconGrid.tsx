"use client";

import { IconGrid } from "@/components/gallery/IconGrid";
import type { IconWork } from "@/content/types";

export interface GalleryIconGridProps {
  items: IconWork[];
  /** Serialized filter state — when it changes, an open lightbox closes. */
  listKey: string;
}

/** Client wrapper — lightbox state lands here in chunk 3. */
export function GalleryIconGrid({ items }: GalleryIconGridProps) {
  return (
    <IconGrid
      items={items}
      variant="gallery"
      onSelect={(index) => {
        void index;
      }}
    />
  );
}
