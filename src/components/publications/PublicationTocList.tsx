import { PublicationTocItem } from "@/components/publications/PublicationTocItem";
import type { Publication, PublicationTocEntry } from "@/content/types";
import { pl } from "@/i18n/pl";
import { PageHeading } from "@/components/core/PageHeading";

export interface PublicationTocListProps {
  chapters: Publication["chapters"];
  items: Publication["toc"];
}

type TocGroup = {
  title?: string;
  pages?: string;
  intro: PublicationTocEntry[];
  entries: PublicationTocEntry[];
};

// AL1: one group per album chapter; publications without chapters render a single untitled group.
function buildGroups(
  chapters: Publication["chapters"],
  items: Publication["toc"],
): TocGroup[] {
  if (!chapters) {
    return [{ intro: [], entries: items }];
  }

  return chapters.map((chapter, index) => {
    const chapterItems = items.filter((item) => item.chapter === index);
    return {
      title: chapter.title,
      pages: chapter.pages,
      intro: chapterItems.filter((item) => item.intro),
      entries: chapterItems.filter((item) => !item.intro),
    };
  });
}

export function PublicationTocList({ chapters, items }: PublicationTocListProps) {
  const groups = buildGroups(chapters, items);

  return (
    <section className="publication-toc" aria-labelledby="publication-toc-heading">
      <PageHeading level="section" id="publication-toc-heading" className="mb-heading-gap">
        {pl.publications.tocHeading}
      </PageHeading>
      <p className="publication-section-lead">{pl.publications.tocLead}</p>

      <ol className="publication-toc-chapters">
        {groups.map((group, index) => (
          <li key={group.pages ?? index} className="publication-toc-chapter">
            {group.intro.length > 0 ? (
              <ul className="publication-toc-list publication-toc-intro">
                {group.intro.map((item) => (
                  <PublicationTocItem key={item.title} item={item} />
                ))}
              </ul>
            ) : null}
            {group.pages ? (
              <p className="publication-toc-pages">
                {pl.publications.tocPages.replace("{pages}", group.pages)}
              </p>
            ) : null}
            {group.title ? <h3 className="publication-toc-chapter-title heading-sub">{group.title}</h3> : null}
            {group.entries.length > 0 ? (
              <ul className="publication-toc-list">
                {group.entries.map((item) => (
                  <PublicationTocItem key={item.title} item={item} />
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
