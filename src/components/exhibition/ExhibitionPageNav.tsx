import Link from "next/link";

import { pl } from "@/i18n/pl";

export interface ExhibitionPageNavProps {
  className?: string;
}

export function ExhibitionPageNav({ className }: ExhibitionPageNavProps) {
  const { toc } = pl.exhibition.page;
  const navClass = ["exhibition-page-nav", className].filter(Boolean).join(" ");

  return (
    <nav aria-label={pl.textPage.tocAriaLabel} className={navClass}>
      {toc.map((item) => (
        <Link key={item.id} href={`#${item.id}`} className="exhibition-page-nav-link">
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
