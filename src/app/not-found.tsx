import type { Metadata } from "next";

import { TextLink } from "@/components/core/TextLink";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { NavUnderlineLink } from "@/components/navigation/NavUnderlineLink";
import { pl } from "@/i18n/pl";
import { mainNav } from "@/navigation";
import { PageHeading } from "@/components/core/PageHeading";

export const metadata: Metadata = {
  title: pl.notFound.documentTitle,
};

export default function NotFound() {
  return (
    <SectionPageShell>
      <PageHeading level="page" className="mb-space-5">
        {pl.notFound.title}
      </PageHeading>

      <p className="mb-space-8 max-w-measure-prose text-size-body leading-body text-text-secondary md:text-size-body-lg md:leading-prose">
        {pl.notFound.lead}
      </p>

      <div className="mb-space-8">
        <TextLink href="/">{pl.notFound.homeLink}</TextLink>
      </div>

      <nav aria-label={pl.notFound.sitemapAriaLabel}>
        <PageHeading level="section" className="mb-space-4">
          {pl.notFound.sitemapHeading}
        </PageHeading>
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
