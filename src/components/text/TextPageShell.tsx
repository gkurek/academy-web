import type { ReactNode } from "react";

import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { TextPageTocNav } from "@/components/text/TextPageTocNav";
import type { TocItem } from "@/content/types";
import type { SectionKey } from "@/navigation";

export interface TextPageShellProps {
  title: string;
  lead?: string;
  toc?: TocItem[];
  children: ReactNode;
  /** Main nav item to underline gold in the Header — read from navigation.ts. */
  active: string;
  section: SectionKey;
  sectionActive: string;
  /** When true, AboutPage (or similar) renders its own hero header. */
  hideHeader?: boolean;
}

export interface TextPageSectionProps {
  id: string;
  heading: string;
  children: ReactNode;
}

/** Two-column section row: 280 px H2 column + prose (mockup 6a). */
export function TextPageSection({ id, heading, children }: TextPageSectionProps) {
  return (
    <section
      id={id}
      className="mt-section-gap-mobile scroll-mt-space-6 md:mt-section-gap grid grid-cols-1 items-start gap-space-5 lg:grid-cols-text-page-section lg:gap-text-page-main-gap"
    >
      <h2 className="font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2">
        {heading}
      </h2>
      <div className="min-w-0 text-page-mdx">{children}</div>
    </section>
  );
}

export function TextPageShell({
  title,
  lead,
  toc,
  children,
  active,
  section,
  sectionActive,
  hideHeader = false,
}: TextPageShellProps) {
  const hasToc = Boolean(toc && toc.length > 0);

  return (
    <SectionPageShell active={active} section={section} sectionActive={sectionActive}>
      <div className="mx-auto w-full max-w-content-max">
        {hasToc ? (
          <div className="grid grid-cols-1 items-start lg:grid-cols-text-page-toc lg:gap-text-page-main-gap">
            <div className="hidden self-start lg:sticky lg:top-text-page-toc-sticky lg:block">
              <TextPageTocNav items={toc!} variant="sidebar" />
            </div>
            <div className="min-w-0">
              {!hideHeader ? <TextPageHeader title={title} lead={lead} /> : null}
              <div className="mb-space-5 lg:hidden">
                <TextPageTocNav items={toc!} variant="collapse" />
              </div>
              {children}
            </div>
          </div>
        ) : (
          <>
            {!hideHeader ? <TextPageHeader title={title} lead={lead} /> : null}
            {children}
          </>
        )}
      </div>
    </SectionPageShell>
  );
}

function TextPageHeader({ title, lead }: { title: string; lead?: string }) {
  return (
    <header className="mb-space-6">
      <h1 className="mb-space-5 font-serif text-size-h1-m leading-tight text-text-h1 md:text-size-h1">
        {title}
      </h1>
      {lead ? (
        <p className="max-w-measure-lead text-size-lead-m leading-body text-text-secondary md:text-size-lead">
          {lead}
        </p>
      ) : null}
    </header>
  );
}
