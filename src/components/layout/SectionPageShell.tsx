import type { ReactNode } from "react";

import { Footer } from "@/components/navigation/Footer";
import { Header } from "@/components/navigation/Header";
import { SectionNav } from "@/components/navigation/SectionNav";
import { sectionNav, type SectionKey } from "@/navigation";

export interface SectionPageShellProps {
  children: ReactNode;
  /** Main nav item to underline gold in the Header. */
  active?: string;
  /** When set, renders the section's SectionNav inside main. */
  section?: SectionKey;
  /** Label of the current SectionNav item — see SectionNavProps["active"]. */
  sectionActive?: string;
}

/** Shared chrome for internal section pages: Header, main column, optional SectionNav, Footer. */
export function SectionPageShell({ children, active, section, sectionActive }: SectionPageShellProps) {
  return (
    <>
      <Header active={active} />
      <main id="main-content" className="flex-1 px-page-margin-mobile py-space-6 md:px-page-margin">
        {section && <SectionNav items={sectionNav[section]} active={sectionActive} />}
        {children}
      </main>
      <Footer />
    </>
  );
}
