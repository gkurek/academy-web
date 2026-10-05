import type { ReactNode } from "react";

import { Footer } from "@/components/navigation/Footer";
import { Header } from "@/components/navigation/Header";
import { SectionNav } from "@/components/navigation/SectionNav";
import { resolveNav, sectionNav } from "@/navigation";

export interface SectionPageShellProps {
  children: ReactNode;
  /** Route path — resolves the Header underline and the SectionNav (resolveNav). Omit outside the nav (404). */
  path?: string;
  /** No padding on main — the page's sections run edge to edge (home). */
  flush?: boolean;
  /** Full-bleed band closing the page, flush against the footer (no bottom padding under it). */
  footerBand?: ReactNode;
}

/** Shared chrome for every page: Header, main column, the section's SectionNav, Footer. */
export function SectionPageShell({ children, path, flush = false, footerBand }: SectionPageShellProps) {
  const { section, sectionActive } = resolveNav(path);
  const paddingClass = footerBand
    ? "px-page-margin-mobile pt-space-6 md:px-page-margin"
    : "px-page-margin-mobile py-space-6 md:px-page-margin";

  return (
    <>
      <Header path={path} />
      <main id="main-content" className={flush ? "flex-1" : `flex-1 ${paddingClass}`}>
        {section && <SectionNav items={sectionNav[section]} path={path} activeHref={sectionActive?.href} />}
        {children}
        {footerBand}
      </main>
      <Footer />
    </>
  );
}
