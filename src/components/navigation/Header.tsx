import Link from "next/link";
import { getSiteSettings } from "@/content/settings";
import { pl } from "@/i18n/pl";
import { mainNav } from "@/navigation";
import { HeaderMobileMenu } from "@/components/navigation/HeaderMobileMenu";

export interface HeaderProps {
  /** Label of the main nav item to underline gold, e.g. "Wykłady". */
  active?: string;
}

export function Header({ active }: HeaderProps) {
  const settings = getSiteSettings();

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
        <nav className="flex gap-space-6 text-size-nav font-sans">
          {mainNav.map((item) => {
            const isActive = item.label === active;
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "nav-link-underline nav-link-underline-active text-accent-text"
                    : "nav-link-underline text-text-body hover:text-text-list-title"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="md:hidden">
        <HeaderMobileMenu active={active} phone={settings.phone} blogUrl={settings.blogUrl} />
      </div>
    </header>
  );
}
