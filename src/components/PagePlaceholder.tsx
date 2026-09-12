import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { SectionNav } from "@/components/navigation/SectionNav";
import { pl } from "@/i18n/pl";
import { sectionNav, type SectionKey } from "@/navigation";

export interface PagePlaceholderProps {
  title: string;
  /** Main nav item to underline gold in the Header. */
  active?: string;
  /** When set, renders the section's SectionNav below the Header. */
  section?: SectionKey;
  /** Label of the current SectionNav item — see SectionNavProps["active"]. */
  sectionActive?: string;
}

export function PagePlaceholder({ title, active, section, sectionActive }: PagePlaceholderProps) {
  return (
    <>
      <Header active={active} />
      <main className="flex-1 px-page-margin-mobile py-space-6 md:px-page-margin">
        {section && <SectionNav items={sectionNav[section]} active={sectionActive} />}
        <h1 className="font-serif text-size-h1-m md:text-size-h1 text-text-h1 mb-space-4">{title}</h1>
        <p className="text-text-secondary">{pl.common.contentInProgress}</p>
      </main>
      <Footer />
    </>
  );
}
