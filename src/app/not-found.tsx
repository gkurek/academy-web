import type { Metadata } from "next";

import { TextLink } from "@/components/core/TextLink";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { NavUnderlineLink } from "@/components/navigation/NavUnderlineLink";
import { pl } from "@/i18n/pl";
import { mainNav } from "@/navigation";

export const metadata: Metadata = {
  title: pl.notFound.documentTitle,
};

export default function NotFound() {
  return (
    <SectionPageShell>
      <h1 className="mb-space-5 font-serif text-size-h1-m leading-tight text-text-h1 md:text-size-h1">
        {pl.notFound.title}
      </h1>

      <p className="mb-space-8 max-w-measure-prose text-size-body leading-body text-text-secondary md:text-size-body-lg md:leading-prose">
        {pl.notFound.lead}
      </p>

      <div className="mb-space-8">
        <TextLink href="/">{pl.notFound.homeLink}</TextLink>
      </div>

      <nav aria-label={pl.notFound.sitemapAriaLabel}>
        <h2 className="mb-space-4 font-serif text-size-role-section-h2-m leading-heading text-text-h2 md:text-size-role-section-h2">
          {pl.notFound.sitemapHeading}
        </h2>
        <ul className="grid grid-cols-1 gap-space-3 sm:grid-cols-2">
          {mainNav.map((item) => (
            <li key={item.href}>
              <NavUnderlineLink href={item.href} label={item.label} className="text-size-body" />
            </li>
          ))}
        </ul>
      </nav>
    </SectionPageShell>
  );
}
