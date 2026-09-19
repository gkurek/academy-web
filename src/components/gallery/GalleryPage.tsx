import { TextLink } from "@/components/core/TextLink";
import { GalleryFilters } from "@/components/gallery/GalleryFilters";
import { GalleryIconGrid } from "@/components/gallery/GalleryIconGrid";
import { GalleryOrderTeaser } from "@/components/gallery/GalleryOrderTeaser";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import {
  filterIconWorks,
  formatIconCount,
  getIconCounts,
  getIconTags,
  getIconWorks,
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
  const countLabel = formatIconCount(getIconCounts(filteredWorks));
  const [leadBefore, leadAfter] = pl.gallery.lead.split("{link}");

  return (
    <SectionPageShell active={active} section="ikony" sectionActive={sectionActive}>
      <section className="pb-offer-hub-lead-pb">
        <h1 className="font-serif text-size-h1-m md:text-size-h1 leading-tight text-text-h1 mb-space-5">
          {pl.gallery.title}
        </h1>
        <p className="text-size-lead-m md:text-size-lead leading-body text-text-secondary max-w-measure-lead">
          {leadBefore}
          <TextLink href="/ikony/na-zamowienie">{pl.gallery.orderLinkLabel}</TextLink>
          {leadAfter}
        </p>
      </section>

      <GalleryFilters tags={tags} filters={filters} />

      <p className="text-size-ui text-text-tertiary mb-space-5">{countLabel}</p>

      <GalleryIconGrid items={filteredWorks} />

      <GalleryOrderTeaser />
    </SectionPageShell>
  );
}
