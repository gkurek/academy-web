import Link from "next/link";
import type { ReactNode } from "react";

import { AdminTabs } from "@/components/AdminTabs";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { ThemeToggle } from "@/components/ThemeToggle";
import { pl } from "@/i18n/pl";
import { PLACEHOLDER_USER_EMAIL, PUBLIC_SITE_URL } from "@/lib/site";

type AdminShellProps = {
  children: ReactNode;
};

// Panel frame (mockup PanelShell, screen 4.0): header, section tabs, page content.
// PublishStatusBar joins in v1 together with publishing.
export function AdminShell({ children }: AdminShellProps) {
  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-b border-line-gold px-pad pt-header-pt pb-header-pb">
        <Link
          href="/"
          className="flex flex-wrap items-baseline gap-x-3 font-serif text-signature leading-logo tracking-logo text-heading uppercase no-underline"
        >
          {/* Spaces keep the accessible name as separate words; flex ignores them in layout. */}
          <span>{pl.header.signature}</span>{" "}
          <span aria-hidden="true">{pl.header.signatureSeparator}</span>{" "}
          <span>{pl.header.subtitle}</span>
        </Link>
        <div className="flex flex-wrap items-center gap-x-6 text-ui">
          <a
            href={PUBLIC_SITE_URL}
            target="_blank"
            rel="noopener"
            className="flex min-h-tap items-center gap-1.5 text-gold underline decoration-line-gold underline-offset-4 hover:text-gold-hover"
          >
            {pl.header.publicSite}
            <ExternalLinkIcon />
            <span className="sr-only">{pl.header.externalNewTab}</span>
          </a>
          <ThemeToggle />
          <span className="flex min-h-tap items-center text-tertiary">{PLACEHOLDER_USER_EMAIL}</span>
          {/* Placeholder until Cloudflare Access logout (12b-3). */}
          <button
            type="button"
            className="min-h-tap cursor-pointer px-1 text-body underline decoration-line underline-offset-4 hover:text-gold"
          >
            {pl.header.logout}
          </button>
        </div>
      </header>
      <AdminTabs />
      {children}
    </>
  );
}
