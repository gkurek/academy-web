import Link from "next/link";
import { getSiteSettings } from "@/content/settings";
import { pl } from "@/i18n/pl";
import { footerLegalLink, footerSitemap, type MainNavItem } from "@/navigation";

const sitemapLinkClass = "tap-target-nav-block text-text-secondary";
const hubHeadingClass =
  "tap-target-nav-block font-serif text-size-body text-accent-text mb-space-1";
const contactLabelClass = "text-size-ui text-text-tertiary";
const contactLinkClass = "tap-target-nav-block text-text-secondary";
const socialLinkClass = "text-text-secondary hover:text-text-body";
const bottomLinkClass = "tap-target-nav text-text-tertiary";
const organizerLinkClass = "border-b border-border-secondary text-text-tertiary";

function FooterHubSection({ group }: { group: MainNavItem }) {
  return (
    <div>
      <Link href={group.href} className={hubHeadingClass}>
        {group.label}
      </Link>
      {group.children?.map((child) => (
        <Link key={child.href} href={child.href} className={sitemapLinkClass}>
          {child.label}
        </Link>
      ))}
    </div>
  );
}

function FooterBrandBlock() {
  const settings = getSiteSettings();

  return (
    <>
      <div className="font-serif text-size-lead tracking-logo-footer text-text-list-title mb-space-3">
        {pl.meta.orgShortName}
      </div>
      <p className="text-size-ui leading-body text-text-secondary mb-space-3">
        {settings.place}
        <br />
        {settings.address}
      </p>
      <p className="text-size-caption text-text-tertiary">{pl.footer.accessibilityNote}</p>
    </>
  );
}

function FooterContactBlock() {
  const settings = getSiteSettings();
  const telHref = `tel:+48${settings.phone.replace(/\s/g, "")}`;

  return (
    <>
      {settings.emails.map((email, index) => (
        <div key={email.address} className={index > 0 ? "mt-space-5" : undefined}>
          <div className={`${contactLabelClass} mb-space-1`}>{email.label}</div>
          <a href={`mailto:${email.address}`} className={contactLinkClass}>
            {email.address}
          </a>
          {index === 0 && (
            <>
              <br />
              <a href={telHref} className={contactLinkClass}>
                {settings.phone}
              </a>
            </>
          )}
          {email.contactName && (
            <>
              <br />
              <span className="text-text-tertiary">{email.contactName}</span>
            </>
          )}
        </div>
      ))}

      <div className="mt-space-6">
        <a
          href={settings.ecosystem.social.facebook}
          className={`tap-target-nav-block ${socialLinkClass}`}
          rel="noopener noreferrer"
        >
          {pl.footer.facebookLabel}
        </a>
        <a
          href={settings.ecosystem.social.youtube}
          className={`tap-target-nav-block ${socialLinkClass}`}
          rel="noopener noreferrer"
        >
          {pl.footer.youtubeLabel}
        </a>
        <a
          href={settings.blogUrl}
          className={`tap-target-nav-block ${socialLinkClass}`}
          rel="noopener noreferrer"
        >
          {pl.footer.blogLabel} ↗
        </a>
      </div>
    </>
  );
}

function FooterMobileLayout({
  orgLink,
  workshopsLink,
  lecturesLink,
  iconsLink,
  akademiaLinks,
  contactLink,
}: {
  orgLink: MainNavItem;
  workshopsLink: MainNavItem;
  lecturesLink: MainNavItem;
  iconsLink: MainNavItem;
  akademiaLinks: MainNavItem[];
  contactLink: MainNavItem;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-space-6 gap-y-space-6 wrap-anywhere md:hidden">
      <div className="grid min-w-0 gap-space-5 content-start text-size-ui leading-loose">
        <FooterBrandBlock />
        <Link href={orgLink.href} className={sitemapLinkClass}>
          {orgLink.label}
        </Link>
        {akademiaLinks.map((link) => (
          <Link key={link.href} href={link.href} className={sitemapLinkClass}>
            {link.label}
          </Link>
        ))}
        <FooterHubSection group={workshopsLink} />
      </div>

      <div className="grid min-w-0 gap-space-5 content-start text-size-ui leading-loose">
        <FooterContactBlock />
        <FooterHubSection group={lecturesLink} />
        <FooterHubSection group={iconsLink} />
        <Link href={contactLink.href} className={sitemapLinkClass}>
          {contactLink.label}
        </Link>
      </div>
    </div>
  );
}

export function Footer() {
  const settings = getSiteSettings();
  const [orgLink, workshopsLink, lecturesLink, iconsLink, ...flatLinks] = footerSitemap;
  const contactLink = flatLinks[flatLinks.length - 1];
  const akademiaLinks = flatLinks.slice(0, -1);

  return (
    <footer className="rule-gold-t surface-footer-bleed font-sans">
      <div className="px-page-margin-mobile md:px-page-margin pt-footer-pt">
        <FooterMobileLayout
          orgLink={orgLink}
          workshopsLink={workshopsLink}
          lecturesLink={lecturesLink}
          iconsLink={iconsLink}
          akademiaLinks={akademiaLinks}
          contactLink={contactLink}
        />

        <div className="hidden md:grid gap-space-6 md:grid-cols-footer md:gap-footer-gap">
          <div>
            <FooterBrandBlock />
          </div>

          <div className="text-size-ui leading-loose">
            <FooterContactBlock />
          </div>

          <nav aria-label={pl.footer.sitemapAriaLabel} className="contents">
            <div className="grid gap-space-5 content-start text-size-ui leading-loose">
              <Link href={orgLink.href} className={sitemapLinkClass}>
                {orgLink.label}
              </Link>
              <FooterHubSection group={workshopsLink} />
              <FooterHubSection group={lecturesLink} />
            </div>

            <div className="grid gap-space-5 content-start text-size-ui leading-loose">
              <FooterHubSection group={iconsLink} />
              <div className="grid gap-space-1">
                {flatLinks.map((link) => (
                  <Link key={link.href} href={link.href} className={sitemapLinkClass}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </div>

      <div className="mt-space-7 rule-neutral-t">
        <div className="px-page-margin-mobile md:px-page-margin py-space-5 flex flex-wrap items-center justify-between gap-x-space-6 gap-y-space-3 text-size-caption text-text-tertiary">
          <div className="flex flex-wrap items-center gap-x-space-6 gap-y-space-3">
            <span>{pl.footer.copyright}</span>
            <span>
              {pl.footer.organizerLabel}:{" "}
              <a href={settings.ecosystem.foundationUrl} className={organizerLinkClass}>
                {pl.footer.organizerName}
              </a>
            </span>
          </div>
          <Link href={footerLegalLink.href} className={bottomLinkClass}>
            {footerLegalLink.label}
          </Link>
        </div>
      </div>
    </footer>
  );
}
