import Link from "next/link";

import { ExternalLink } from "@/components/core/ExternalLink";
import { getSiteSettings } from "@/content/settings";
import { pl } from "@/i18n/pl";
import {
  footerLegalLink,
  footerSitemapFlat,
  footerSitemapGroups,
  type MainNavItem,
} from "@/navigation";

// Footer (K-36 rework of mockup 9e): basic contact and the sitemap share one
// row from lg — a third + two sitemap columns at lg, a fixed contact column
// + four sitemap columns at xl (the sitemap columns follow the outer grid).
// The full contact (people, both e-mails, the church dedication) lives on /kontakt.
// Below lg the contact block stacks above the sitemap. The legal bar is a row from md.
const colorTransition = "transition-colors duration-150 motion-reduce:transition-none";
const sectionHeadingClass = `flex min-h-tap-min-mobile-header items-center font-serif text-size-footer-heading leading-heading text-text-list-title hover:text-accent-text lg:min-h-0 lg:w-fit ${colorTransition}`;
const subLinkClass = `flex min-h-tap-min-mobile-header items-center text-size-nav text-text-secondary hover:text-accent-hover lg:min-h-0 lg:w-fit lg:text-size-footer-sublink lg:leading-footer-sublink ${colorTransition}`;
const footerLinkUnderline = "link-underline-target link-underline-target--border";
const contactDataClass = `flex w-fit min-h-tap-min-mobile-header items-center whitespace-nowrap text-size-ui leading-footer-text text-accent-text no-underline hover:text-accent-hover md:min-h-0 ${colorTransition}`;
const socialLinkClass = `inline-flex min-h-tap-min items-center border border-border-secondary px-footer-social-px text-size-caption-m lg:px-space-4 leading-footer-text text-text-secondary hover:border-accent-text hover:text-accent-text md:min-h-tap-min-mobile-header ${colorTransition}`;
const legalLinkClass = `no-underline hover:text-accent-text ${colorTransition}`;

function FooterContact() {
  const settings = getSiteSettings();
  // Church name only — the full dedication (brief §8) is on /kontakt.
  const church = settings.place.split(" pw. ")[0];
  const primaryEmail = settings.emails[0];
  const telHref = `tel:+48${settings.phone.replace(/\s/g, "")}`;

  return (
    <div>
      <div className="font-serif text-size-footer-brand leading-heading tracking-logo-footer text-text-list-title">
        {pl.meta.orgShortName}
      </div>
      <div className="mt-footer-subtitle-mt font-serif text-size-body leading-footer-text text-text-tertiary">
        {pl.meta.orgSubtitle}
      </div>

      <address className="mt-footer-address-mt-m block not-italic text-size-ui leading-body text-text-secondary md:mt-footer-address-mt md:leading-footer-address">
        <span className="block">{church}</span>
        <span className="block">{settings.address}</span>
      </address>

      <div className="mt-footer-data-mt-m flex flex-col md:mt-footer-data-mt md:gap-space-2">
        {primaryEmail ? (
          <a href={`mailto:${primaryEmail.address}`} className={contactDataClass}>
            <span className={footerLinkUnderline}>{primaryEmail.address}</span>
          </a>
        ) : null}
        <a href={telHref} className={contactDataClass}>
          <span className={footerLinkUnderline}>{settings.phone}</span>
        </a>
      </div>

      <div className="mt-space-5 flex flex-wrap gap-footer-social-gap-m md:gap-space-4 lg:gap-space-3">
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

function FooterSitemapGroup({ group }: { group: MainNavItem }) {
  return (
    <div className="flex flex-col gap-footer-group-gap-m lg:gap-space-3">
      <Link href={group.href} className={sectionHeadingClass}>
        {group.label}
      </Link>
      <ul className="flex flex-col gap-footer-group-gap-m lg:gap-space-3">
        {group.children?.map((child) => (
          <li key={child.href}>
            <Link href={child.href} className={subLinkClass}>
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const settings = getSiteSettings();

  return (
    <footer className="surface-footer-bleed font-sans">
      <div className="rule-gold-t surface-footer-contact-bleed grid gap-y-footer-contact-stack-gap px-page-margin-mobile py-footer-contact-py-m md:px-page-margin md:py-footer-contact-py lg:grid-cols-3 lg:items-start lg:gap-x-space-7 xl:grid-cols-footer xl:gap-x-space-6">
        <FooterContact />

        <nav
          aria-label={pl.footer.sitemapAriaLabel}
          className="border-t border-line-neutral pt-footer-sitemap-py-m lg:col-span-2 lg:border-t-0 lg:pt-0 xl:col-span-4"
        >
          <div className="flex flex-col gap-space-7 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-space-7 lg:gap-y-space-8 xl:grid-cols-4 xl:gap-x-space-6">
            {footerSitemapGroups.map((group) => (
              <FooterSitemapGroup key={group.href} group={group} />
            ))}
          </div>

          <ul className="mt-space-7 grid gap-space-3 border-t border-line-neutral pt-space-5 lg:mt-footer-rule-mt lg:grid-cols-2 lg:gap-x-space-7 xl:grid-cols-4 xl:gap-x-space-6">
            {footerSitemapFlat.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={sectionHeadingClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="rule-neutral-t flex flex-col gap-space-3 px-page-margin-mobile py-footer-legal-py-m text-size-caption-m leading-footer-text text-text-tertiary md:flex-row md:flex-wrap md:items-center md:gap-x-space-4 md:px-page-margin md:py-space-5 md:text-size-caption">
        <span>{pl.footer.copyright}</span>
        <span aria-hidden="true" className="hidden md:inline">
          {pl.footer.legalSeparator}
        </span>
        <span>
          {pl.footer.organizerLabel}:{" "}
          <ExternalLink href={settings.ecosystem.foundationUrl} className={legalLinkClass}>
            <span className={footerLinkUnderline}>{pl.footer.organizerName}</span>
          </ExternalLink>
        </span>
        <span aria-hidden="true" className="hidden md:inline">
          {pl.footer.legalSeparator}
        </span>
        <Link
          href={footerLegalLink.href}
          className={`flex w-fit min-h-tap-min-mobile-header items-center md:inline md:min-h-0 ${legalLinkClass}`}
        >
          <span className={footerLinkUnderline}>{footerLegalLink.label}</span>
        </Link>
        <span className="md:ml-auto">
          {pl.footer.designCreditLabel}:{" "}
          <ExternalLink
            href={pl.footer.designCreditUrl}
            showIcon={false}
            className={`hover:text-footer-credit-hover ${colorTransition}`}
          >
            {pl.footer.designCreditName}
          </ExternalLink>
        </span>
      </div>
    </footer>
  );
}
