import Link from "next/link";

import { pl } from "@/i18n/pl";

export function ExhibitionPageNav() {
  const { toc } = pl.exhibition.page;

  return (
    <nav aria-label={pl.textPage.tocAriaLabel} className="exhibition-page-nav">
      {toc.map((item) => (
        <Link key={item.id} href={`#${item.id}`} className="exhibition-page-nav-link">
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
