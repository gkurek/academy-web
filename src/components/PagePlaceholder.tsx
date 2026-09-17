import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { pl } from "@/i18n/pl";
import type { SectionKey } from "@/navigation";

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
    <SectionPageShell active={active} section={section} sectionActive={sectionActive}>
      <h1 className="font-serif text-size-h1-m md:text-size-h1 text-text-h1 mb-space-4">{title}</h1>
      <p className="text-text-secondary">{pl.common.contentInProgress}</p>
    </SectionPageShell>
  );
}
