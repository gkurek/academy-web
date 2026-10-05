import type { ReactNode } from "react";

import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { TextPageTocNav } from "@/components/text/TextPageTocNav";
import type { TocItem } from "@/content/types";

export interface TextPageShellProps {
  title: string;
  lead?: string;
  toc?: TocItem[];
  children: ReactNode;
  /** Route path — see SectionPageShellProps["path"]. */
  path: string;
  /** Optional id on the page header — for in-page TOC anchors (mockup 3a). */
  headerId?: string;
  /** When true, AboutPage (or similar) renders its own hero header. */
  hideHeader?: boolean;
  /** See SectionPageShellProps["footerBand"]. */
  footerBand?: ReactNode;
}

export function TextPageShell({
  title,
  lead,
  toc,
  children,
  path,
  headerId,
  hideHeader = false,
  footerBand,
}: TextPageShellProps) {
  const hasToc = Boolean(toc && toc.length > 0);

  return (
    <SectionPageShell path={path} footerBand={footerBand}>
      {hasToc ? (
        <div className="grid grid-cols-1 items-start lg:grid-cols-text-page-toc lg:gap-text-page-main-gap">
          <div className="hidden self-start lg:sticky lg:top-text-page-toc-sticky lg:block">
            <TextPageTocNav items={toc!} variant="sidebar" />
          </div>
          <div className="min-w-0">
            {!hideHeader ? <TextPageHeader id={headerId} title={title} lead={lead} /> : null}
            <div className="mb-space-5 lg:hidden">
              <TextPageTocNav items={toc!} variant="collapse" />
            </div>
            {children}
          </div>
        </div>
      ) : (
        <>
          {!hideHeader ? <TextPageHeader id={headerId} title={title} lead={lead} /> : null}
          {children}
        </>
      )}
    </SectionPageShell>
  );
}

function TextPageHeader({ id, title, lead }: { id?: string; title: string; lead?: string }) {
  return (
    <header id={id} className="mb-section-gap-tight scroll-mt-space-6">
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
