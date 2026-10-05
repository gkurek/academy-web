"use client";

import { useState } from "react";

import { GallerySection } from "@/components/gallery/GallerySection";
import { IconLightbox } from "@/components/gallery/IconLightbox";
import { useGalleryFilters } from "@/components/gallery/useGalleryFilters";
import { useLightboxIndex } from "@/components/lightbox/useLightboxIndex";
import { filterIconWorks, getStudentNames, groupIconSections } from "@/content/icons";
import type { IconWork } from "@/content/types";
import { pl } from "@/i18n/pl";

export interface GalleryIconGridProps {
  /** All works; the theme filter from the URL is applied here, in the client (R3-04). */
  works: IconWork[];
}

/** Leading tiles of the first section loaded eagerly: the first row on desktop, two rows on mobile. */
const EAGER_TILE_COUNT = 4;

export function GalleryIconGrid({ works }: GalleryIconGridProps) {
  const { filters } = useGalleryFilters();
  const sections = groupIconSections(filterIconWorks(works, filters)).map(({ id, works: sectionWorks }) => ({
    id,
    title: pl.gallery.sections[id].title,
    works: sectionWorks,
    names: id === "uczniowie" ? getStudentNames(sectionWorks) : undefined,
  }));

  // One sequence for the lightbox, in visual order (EJK → students), matching the active filter.
  const items = sections.flatMap((section) => section.works);
  const lightbox = useLightboxIndex(items.length);

  // A change of filter changes the sequence, so an open lightbox closes.
  const listKey = filters.tag ?? "";
  const [storedListKey, setStoredListKey] = useState(listKey);
  if (listKey !== storedListKey) {
    setStoredListKey(listKey);
    lightbox.close();
  }

  // Each section starts where the previous one ended in the sequence.
  const startIndexes = sections.map((_, index) =>
    sections.slice(0, index).reduce((total, section) => total + section.works.length, 0),
  );

  return (
    <>
      {sections.map((section, index) => (
        <GallerySection
          key={section.id}
          id={section.id}
          title={section.title}
          items={section.works}
          startIndex={startIndexes[index]}
          eagerCount={index === 0 ? EAGER_TILE_COUNT : 0}
          onSelect={lightbox.open}
          names={section.names}
          className={
            index > 0
              ? "mt-section-gap border-t border-line-gold pt-space-5 md:pt-space-6"
              : undefined
          }
        />
      ))}
      <IconLightbox
        items={items}
        index={lightbox.index}
        onPrev={lightbox.prev}
        onNext={lightbox.next}
        onClose={lightbox.close}
      />
    </>
  );
}
