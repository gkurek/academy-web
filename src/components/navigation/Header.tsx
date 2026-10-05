import Link from "next/link";
import { getSiteSettings } from "@/content/settings";
import { pl } from "@/i18n/pl";
import { mainNav, navAriaCurrent, resolveNav } from "@/navigation";
import { HeaderMobileMenu } from "@/components/navigation/HeaderMobileMenu";
import { NavUnderlineLink } from "@/components/navigation/NavUnderlineLink";

export interface HeaderProps {
  /** Route path — the main nav item of its section is underlined gold (resolveNav). */
  path?: string;
}

export function Header({ path }: HeaderProps) {
  const settings = getSiteSettings();
  const activeHref = resolveNav(path).active?.href;

  return (
    <header className="rule-gold-b">
      <div className="hidden md:flex items-center justify-between gap-space-6 px-page-margin py-space-5">
        <Link href="/" className="font-serif leading-tight">
          <div className="text-size-logo tracking-logo text-text-h2">
            {pl.meta.orgShortName}
          </div>
          <div className="text-size-logo-subtitle text-text-tertiary">
            {pl.meta.orgSubtitle}
          </div>
        </Link>
        <nav aria-label={pl.header.mainNavAriaLabel} className="flex gap-space-6 text-size-nav font-sans">
          {mainNav.map((item) => (
            <NavUnderlineLink
              key={item.label}
              href={item.href}
              label={item.label}
              isActive={item.href === activeHref}
              ariaCurrent={navAriaCurrent(item.href, activeHref, path)}
            />
          ))}
        </nav>
      </div>

      <div className="md:hidden">
        <HeaderMobileMenu path={path} activeHref={activeHref} phone={settings.phone} blogUrl={settings.blogUrl} />
      </div>
    </header>
  );
}
