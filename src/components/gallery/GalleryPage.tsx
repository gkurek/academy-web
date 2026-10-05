import { GalleryFilters } from "@/components/gallery/GalleryFilters";
import { GalleryIconGrid } from "@/components/gallery/GalleryIconGrid";
import { GalleryOrderTeaser } from "@/components/gallery/GalleryOrderTeaser";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { getIconTags, getIconWorks } from "@/content/icons";
import { pl } from "@/i18n/pl";

export interface GalleryPageProps {
  active: string;
  sectionActive: string;
}

/** Static route: the whole gallery is in the HTML; `?temat=` narrows it in the client (R3-04, D8). */
export function GalleryPage({ active, sectionActive }: GalleryPageProps) {
  return (
    <SectionPageShell active={active} section="ikony" sectionActive={sectionActive}>
      <header className="pb-space-5 mb-space-6 border-b border-line-gold">
        <h1 className="font-serif text-size-h1-m md:text-size-h1 leading-tight text-text-h1 mb-space-5">
          {pl.gallery.title}
        </h1>
        <GalleryFilters tags={getIconTags()} />
      </header>

      <GalleryIconGrid works={getIconWorks()} />

      <GalleryOrderTeaser />
    </SectionPageShell>
  );
}
