import { NavUnderlineLink } from "@/components/navigation/NavUnderlineLink";
import { pl } from "@/i18n/pl";
import { navAriaCurrent, type NavLink } from "@/navigation";

export interface SectionNavProps {
  items: NavLink[];
  /** Route path — `aria-current="page"` on the link to it. */
  path?: string;
  /** Href of the current item (the first item stands in for the hub itself). */
  activeHref?: string;
}

export function SectionNav({ items, path, activeHref }: SectionNavProps) {
  return (
    <nav
      aria-label={pl.sectionNav.ariaLabel}
      className="flex flex-wrap gap-x-space-6 gap-y-space-3 pb-space-4 mb-space-6 text-size-nav font-sans"
    >
      {items.map((item) => (
        <NavUnderlineLink
          key={item.label}
          href={item.href}
          label={item.label}
          variant="section"
          isActive={item.href === activeHref}
          ariaCurrent={navAriaCurrent(item.href, activeHref, path)}
        />
      ))}
    </nav>
  );
}
