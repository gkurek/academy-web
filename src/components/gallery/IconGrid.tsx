import Image from "next/image";
import type { IconWork } from "@/content/types";

export interface IconGridProps {
  items: IconWork[];
  /** On mobile, show only the first N items — used for the home page's
   * curated "Wybrane ikony" preview. Omit to show all items. */
  mobileCount?: number;
}

function formatCaption(item: IconWork): string {
  if (item.author === "student") {
    return `${item.title}, pisana ręką ${item.authorName}`;
  }
  return item.size ? `${item.title}, ${item.size.w}×${item.size.h} cm` : item.title;
}

/**
 * Read-only grid — no lightbox/filters here (design/components/gallery/IconGrid.jsx
 * adds those); this pod-etap only needs the "Wybrane ikony" preview on the home page.
 */
export function IconGrid({ items, mobileCount }: IconGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-space-4 md:gap-icon-grid-gap">
      {items.map((item, index) => (
        <figure
          key={item.slug}
          className={mobileCount != null && index >= mobileCount ? "hidden md:block" : undefined}
        >
          <div className="flex h-icon-grid-h-m md:h-icon-grid-h w-full items-center justify-center bg-surface-tile">
            <Image
              src={item.image.src}
              alt={item.image.alt}
              width={item.image.width}
              height={item.image.height}
              sizes="(min-width: 768px) 25vw, 50vw"
              className="h-full w-full object-contain"
            />
          </div>
          <figcaption className="font-serif text-size-body text-text-tertiary mt-space-2 md:mt-space-3">
            <span className="md:hidden">{item.title}</span>
            <span className="hidden md:inline">{formatCaption(item)}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
