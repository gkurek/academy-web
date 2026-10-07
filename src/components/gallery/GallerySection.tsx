import { IconGrid } from "@/components/gallery/IconGrid";
import type { IconWork } from "@/content/types";
import { PageHeading } from "@/components/core/PageHeading";
import { pl } from "@/i18n/pl";

export interface GallerySectionProps {
  id: string;
  title: string;
  items: IconWork[];
  /** Position of the section's first work in the whole gallery sequence (lightbox index). */
  startIndex: number;
  /** Leading tiles that load eagerly — only the first section's first row. */
  eagerCount: number;
  onSelect: (index: number) => void;
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
  onSelect,
  names,
  className,
}: GallerySectionProps) {
  const headingId = `${id}-heading`;
  const hasNames = (names?.length ?? 0) > 0;

  return (
    <section id={id} aria-labelledby={headingId} className={className}>
      <PageHeading level="section" id={headingId} className="mb-heading-gap">
        {title}
      </PageHeading>

      {hasNames ? (
        <p className="text-size-body leading-body text-text-tertiary max-w-measure-prose mb-space-6">
          <span className="text-text-secondary">{pl.gallery.sections.uczniowie.authorsLabel}</span>{" "}
          {names?.join(", ")}
        </p>
      ) : null}

      <IconGrid items={items} eagerCount={eagerCount} onSelect={(index) => onSelect(startIndex + index)} />
    </section>
  );
}
