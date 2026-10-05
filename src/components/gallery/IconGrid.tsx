import { JustifiedGrid, type JustifiedGridTile } from "@/components/gallery/JustifiedGrid";
import type { IconWork } from "@/content/types";
import { pl } from "@/i18n/pl";

export interface IconGridProps {
  items: IconWork[];
  /** Below md show only the first N items — the home page's curated "Wybrane ikony" preview. */
  mobileCount?: number;
  /** How many leading tiles load eagerly (the first row, above the fold). */
  eagerCount?: number;
  /** Stretch the last row to the container width (single-row previews on home). */
  fillLastRow?: boolean;
  onSelect: (index: number) => void;
}

/** Icon works as justified gallery tiles — title as caption, lightbox on click. */
export function IconGrid({ items, mobileCount, eagerCount, fillLastRow, onSelect }: IconGridProps) {
  const tiles: JustifiedGridTile[] = items.map((item) => ({
    key: item.slug,
    image: item.image,
    caption: item.title,
    label: pl.gallery.lightbox.openIcon.replace("{title}", item.title),
  }));

  return (
    <JustifiedGrid
      tiles={tiles}
      mobileCount={mobileCount}
      eagerCount={eagerCount}
      fillLastRow={fillLastRow}
      onSelect={onSelect}
    />
  );
}
