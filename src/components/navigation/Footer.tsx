import Link from "next/link";

import { ExternalLink } from "@/components/core/ExternalLink";
import { getEnrollmentEmail, getPhoneHref, getSiteSettings } from "@/content/settings";
import { pl } from "@/i18n/pl";
import { fillTemplate } from "@/lib/fillTemplate";
import { currentYearInWarsaw } from "@/lib/isoDate";
import {
  footerSitemapContactGroup,
  footerSitemapFlat,
  footerSitemapGroups,
  type MainNavItem,
} from "@/navigation";

// Footer (mockup Stopka v2 — 3a desktop / 3b mobile): one surface (--footer-contact-bg),
// contact column + sitemap grid (flat sections in the third column on lg). Full contact detail lives on /kontakt.
const colorTransition = "transition-ui-colors";
const sectionHeadingClass = `flex min-h-tap-min-mobile-header items-center font-serif text-size-role-list-title leading-heading text-text-list-title hover:text-accent-text lg:min-h-0 lg:w-fit ${colorTransition}`;
const subLinkClass = `flex min-h-tap-min-mobile-header items-center py-space-1 text-size-nav text-text-secondary hover:text-accent-hover lg:min-h-0 lg:w-fit lg:py-0 lg:text-size-footer-sublink lg:leading-footer-sublink ${colorTransition}`;
const footerLinkUnderline = "link-underline-target link-underline-target--border";
const contactDataClass = `flex w-fit min-h-tap-min-mobile-header items-center whitespace-nowrap py-space-1 text-size-nav leading-footer-text text-accent-text no-underline hover:text-accent-hover lg:min-h-0 lg:py-0 ${colorTransition}`;
const socialLinkClass = `inline-flex min-h-tap-min-mobile-header flex-1 items-center justify-center border border-border-secondary px-space-3 text-size-caption-m leading-footer-text text-text-secondary hover:border-accent-text hover:text-accent-text lg:flex-none lg:px-space-4 ${colorTransition}`;

const sitemapGroupGridClass = [
  "",
  "",
  "lg:col-start-1 lg:row-start-2",
  "lg:col-start-2 lg:row-start-2",
] as const;

function FooterContact() {
  const settings = getSiteSettings();
  // Church name only — the full dedication (brief §8) is on /kontakt.
  const church = settings.place.split(" pw. ")[0];
  const primaryEmail = getEnrollmentEmail();
  const telHref = getPhoneHref();

  return (
    <div className="flex flex-col gap-space-5">
      <div>
        <div className="font-serif text-size-footer-brand leading-heading tracking-logo-footer text-text-list-title">
          {pl.meta.orgShortName}
        </div>
        <div className="mt-footer-subtitle-mt font-serif text-size-nav leading-footer-text text-text-tertiary">
          {pl.meta.orgSubtitle}
        </div>
      </div>

      <address className="block not-italic text-size-nav leading-footer-address text-text-secondary">
        <span className="block">{church}</span>
        <span className="block">{settings.address}</span>
      </address>

      <div className="flex flex-col gap-space-1">
        <a href={`mailto:${primaryEmail}`} className={contactDataClass}>
          <span className={footerLinkUnderline}>{primaryEmail}</span>
        </a>
        <a href={telHref} className={contactDataClass}>
          <span className={footerLinkUnderline}>{settings.phone}</span>
        </a>
      </div>

      <div className="flex gap-space-2">
        <ExternalLink href={settings.ecosystem.social.facebook} className={socialLinkClass}>
          {pl.footer.facebookLabel}
        </ExternalLink>
        <ExternalLink href={settings.ecosystem.social.youtube} className={socialLinkClass}>
          {pl.footer.youtubeLabel}
        </ExternalLink>
        <ExternalLink href={settings.blogUrl} className={socialLinkClass}>
          {pl.footer.blogLabel}
        </ExternalLink>
      </div>
    </div>
  );
}

function FooterSitemapGroup({ group, className }: { group: MainNavItem; className?: string }) {
  return (
    <div className={`flex flex-col gap-space-2 lg:gap-space-3 ${className ?? ""}`}>
      <Link href={group.href} className={sectionHeadingClass}>
        {group.label}
      </Link>
      {group.children && group.children.length > 0 ? (
        <ul className="flex flex-col gap-space-2 lg:gap-space-3">
          {group.children.map((child) => (
            <li key={child.href}>
              <Link href={child.href} className={subLinkClass}>
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="surface-footer-bleed font-sans">
      <div className="rule-gold-t surface-footer-contact-bleed px-page-margin-mobile py-footer-contact-py md:px-page-margin md:py-space-9">
        <div className="grid gap-pillars-gap lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-x-space-9">
          <FooterContact />

          <nav
            aria-label={pl.footer.sitemapAriaLabel}
            className="grid grid-cols-2 gap-x-footer-contact-stack-gap gap-y-space-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:gap-x-pillars-gap lg:gap-y-space-7"
          >
            {footerSitemapGroups.map((group, index) => (
              <FooterSitemapGroup
                key={group.href}
                group={group}
                className={sitemapGroupGridClass[index]}
              />
            ))}

            <div
              className="col-span-2 grid grid-cols-2 gap-x-footer-contact-stack-gap gap-y-space-2 lg:hidden"
            >
              <ul className="flex flex-col gap-space-4">
                {footerSitemapFlat.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={sectionHeadingClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <FooterSitemapGroup group={footerSitemapContactGroup} />
            </div>

            <ul
              className="hidden lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:flex lg:flex-col lg:gap-space-3"
            >
              {footerSitemapFlat.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={sectionHeadingClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <FooterSitemapGroup
              group={footerSitemapContactGroup}
              className="hidden lg:col-span-1 lg:col-start-3 lg:row-start-2 lg:flex lg:self-start"
            />
          </nav>
        </div>
      </div>

      <div className="rule-neutral-t flex flex-col items-center gap-space-2 px-page-margin-mobile py-footer-legal-py-m text-center text-size-caption-m leading-footer-text text-text-tertiary md:flex-row md:justify-between md:px-page-margin md:py-space-5 md:text-left md:text-size-caption lg:items-center">
        <span>{fillTemplate(pl.footer.copyright, { year: currentYearInWarsaw() })}</span>
        <span>
          {pl.footer.designCreditLabel}:{" "}
          <ExternalLink
            href={pl.footer.designCreditUrl}
            showIcon={false}
            className={`tap-target-below-lg hover:text-footer-credit-hover ${colorTransition}`}
          >
            {pl.footer.designCreditName}
          </ExternalLink>
        </span>
      </div>
    </footer>
  );
}
