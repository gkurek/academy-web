import type { GalleryLayoutMode } from "@/components/gallery/GalleryLayoutContext";
import { IconGrid } from "@/components/gallery/IconGrid";
import type { IconWork } from "@/content/types";

export interface GallerySectionProps {
  id: string;
  title: string;
  items: IconWork[];
  /** Position of the section's first work in the whole gallery sequence (lightbox index). */
  startIndex: number;
  /** Leading tiles that load eagerly — only the first section's first row. */
  eagerCount: number;
  layoutMode: GalleryLayoutMode;
  onSelect: (index: number, trigger: HTMLButtonElement) => void;
  /** Students' section: names generated from the works. */
  names?: string[];
  className?: string;
}

export function GallerySection({
  id,
  title,
  items,
  startIndex,
  eagerCount,
  layoutMode,
  onSelect,
  names,
  className,
}: GallerySectionProps) {
  const headingId = `${id}-heading`;
  const hasNames = (names?.length ?? 0) > 0;

  return (
    <section id={id} aria-labelledby={headingId} className={className}>
      <h2
        id={headingId}
        className={[
          "font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2",
          id === "ejk" ? "mb-space-6" : "mb-space-5",
        ].join(" ")}
      >
        {title}
      </h2>

      {hasNames ? (
        <p className="text-size-body leading-body text-text-tertiary max-w-measure-prose mb-space-6">
          {names?.join(", ")}
        </p>
      ) : null}

      <IconGrid
        items={items}
        variant="gallery"
        layoutMode={layoutMode}
        eagerCount={eagerCount}
        onSelect={(index, trigger) => onSelect(startIndex + index, trigger)}
      />
    </section>
  );
}
