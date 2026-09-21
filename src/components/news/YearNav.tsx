import { SectionNav } from "@/components/navigation/SectionNav";
import { pl } from "@/i18n/pl";
import type { NavLink } from "@/navigation";

export interface YearNavProps {
  years: string[];
}

export function YearNav({ years }: YearNavProps) {
  const items: NavLink[] = years.map((year) => ({
    label: year,
    href: `#${year}`,
  }));

  return <SectionNav items={items} ariaLabel={pl.news.yearNavAriaLabel} />;
}
