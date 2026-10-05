import { GalleryFilters } from "@/components/gallery/GalleryFilters";
import { GalleryIconGrid } from "@/components/gallery/GalleryIconGrid";
import { GalleryOrderTeaser } from "@/components/gallery/GalleryOrderTeaser";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import type { IconWork } from "@/content/types";
import { pl } from "@/i18n/pl";
import { PageHeading } from "@/components/core/PageHeading";

export interface GalleryPageProps {
  /** Route path — see SectionPageShellProps["path"]. */
  path: string;
  works: IconWork[];
  tags: string[];
}

/** Static route: the whole gallery is in the HTML; `?temat=` narrows it in the client (R3-04, D8). */
export function GalleryPage({ path, works, tags }: GalleryPageProps) {
  return (
    <SectionPageShell path={path}>
      <header className="pb-space-5 mb-space-6 border-b border-line-gold">
        <PageHeading level="page" className="mb-space-5">
          {pl.gallery.title}
        </PageHeading>
        <GalleryFilters tags={tags} />
      </header>

      <GalleryIconGrid works={works} />

      <GalleryOrderTeaser />
    </SectionPageShell>
  );
}
