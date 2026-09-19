import { GalleryFilters } from "@/components/gallery/GalleryFilters";
import { GalleryIconGrid } from "@/components/gallery/GalleryIconGrid";
import { GalleryLayoutProvider } from "@/components/gallery/GalleryLayoutContext";
import { GalleryOrderTeaser } from "@/components/gallery/GalleryOrderTeaser";
import { GalleryLayoutToggle } from "@/components/gallery/GalleryLayoutToggle";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import type { GallerySectionData } from "@/components/gallery/GalleryIconGrid";
import {
  filterIconWorks,
  getIconTags,
  getIconWorks,
  getStudentNames,
  groupIconSections,
  parseIconFilters,
} from "@/content/icons";
import { pl } from "@/i18n/pl";

export interface GalleryPageProps {
  active: string;
  sectionActive: string;
  searchParams: Record<string, string | string[] | undefined>;
}

export function GalleryPage({ active, sectionActive, searchParams }: GalleryPageProps) {
  const filters = parseIconFilters(searchParams);
  const allWorks = getIconWorks();
  const filteredWorks = filterIconWorks(allWorks, filters);
  const tags = getIconTags();
  const sections: GallerySectionData[] = groupIconSections(filteredWorks).map(({ id, works }) => ({
    id,
    title: pl.gallery.sections[id].title,
    works,
    ...(id === "uczniowie" ? { names: getStudentNames(works) } : {}),
  }));
  // A `temat` param that did not survive parsing is unknown (or empty/repeated) — GalleryFilters strips it from the URL.
  const hasInvalidTag = searchParams.temat !== undefined && filters.tag === undefined;

  return (
    <SectionPageShell active={active} section="ikony" sectionActive={sectionActive}>
      <GalleryLayoutProvider>
        <header className="pb-space-5 mb-space-6 border-b border-line-gold">
          <h1 className="font-serif text-size-h1-m md:text-size-h1 leading-tight text-text-h1 mb-space-5">
            {pl.gallery.title}
          </h1>
          <GalleryFilters
            tags={tags}
            filters={filters}
            hasInvalidTag={hasInvalidTag}
            trailing={<GalleryLayoutToggle />}
          />
        </header>

        <GalleryIconGrid sections={sections} listKey={filters.tag ?? ""} />

        <GalleryOrderTeaser />
      </GalleryLayoutProvider>
    </SectionPageShell>
  );
}
