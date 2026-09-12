import Link from "next/link";
import { getSiteSettings } from "@/content/settings";
import { pl } from "@/i18n/pl";
import { footerSitemap, footerLegalLink } from "@/navigation";

/** Sitemap links — secondary text, no underline (Footer.jsx). */
const sitemapLinkClass = "block text-text-secondary";

/** Contact lines stay clickable but look like plain secondary text in the mockup. */
const contactLinkClass = "text-text-secondary";

/** Bottom bar links — tertiary, no underline (except organizer). */
const bottomLinkClass = "text-text-tertiary";

const organizerLinkClass = "border-b border-border-secondary text-text-tertiary";

export function Footer() {
  const settings = getSiteSettings();
  const [orgLink, workshopsLink, lecturesLink, iconsLink, ...flatLinks] = footerSitemap;
  const telHref = `tel:+48${settings.phone.replace(/\s/g, "")}`;

  return (
    <footer className="bg-surface-footer border-t border-line-gold font-sans">
      <div className="px-page-margin-mobile md:px-page-margin pt-footer-pt">
        <div className="grid gap-space-6 md:grid-cols-footer md:gap-footer-gap">
        <div>
          <div className="font-serif text-size-lead tracking-logo-footer text-text-list-title mb-space-3">
            {pl.meta.orgShortName}
          </div>
          <p className="text-size-ui leading-body text-text-secondary mb-space-3">
            {settings.place}
            <br />
            {settings.address}
          </p>
          <p className="text-size-caption text-text-tertiary">{pl.footer.accessibilityNote}</p>
        </div>

        <div className="text-size-ui leading-loose text-text-secondary">
          {settings.emails.map((email, index) => (
            <div key={email.address} className={index > 0 ? "mt-space-5" : undefined}>
              <div className="font-serif text-size-nav text-accent mb-space-1">{email.label}</div>
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
        </div>

        <nav aria-label={pl.footer.sitemapAriaLabel} className="contents">
          <div className="grid gap-space-5 content-start text-size-ui leading-loose">
            <Link href={orgLink.href} className={sitemapLinkClass}>
              {orgLink.label}
            </Link>
            <div>
              <div className="font-serif text-size-nav text-accent mb-space-1">{workshopsLink.label}</div>
              {workshopsLink.children?.map((child) => (
                <Link key={child.label} href={child.href} className={sitemapLinkClass}>
                  {child.label}
                </Link>
              ))}
            </div>
            <div>
              <div className="font-serif text-size-nav text-accent mb-space-1">{lecturesLink.label}</div>
              {lecturesLink.children?.map((child) => (
                <Link key={child.label} href={child.href} className={sitemapLinkClass}>
                  {child.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-space-5 content-start text-size-ui leading-loose">
            <div>
              <div className="font-serif text-size-nav text-accent mb-space-1">{iconsLink.label}</div>
              {iconsLink.children?.map((child) => (
                <Link key={child.label} href={child.href} className={sitemapLinkClass}>
                  {child.label}
                </Link>
              ))}
            </div>
            <div className="grid gap-space-1">
              {flatLinks.map((link) => (
                <Link key={link.label} href={link.href} className={sitemapLinkClass}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
        </div>
      </div>

      <div className="mt-space-7 border-t border-line-neutral">
        <div className="px-page-margin-mobile md:px-page-margin pt-space-5 pb-footer-pb flex flex-wrap gap-x-space-6 gap-y-space-3 text-size-caption text-text-tertiary">
        <span>
          {pl.footer.organizerLabel}:{" "}
          <a href={settings.ecosystem.foundationUrl} className={organizerLinkClass}>
            {pl.footer.organizerName}
          </a>
        </span>
        <a href={settings.blogUrl} className={bottomLinkClass}>
          {pl.footer.blogLabel} ↗
        </a>
        <a href={settings.ecosystem.social.facebook} className={bottomLinkClass}>
          {pl.footer.facebookLabel}
        </a>
        <a href={settings.ecosystem.social.youtube} className={bottomLinkClass}>
          {pl.footer.youtubeLabel}
        </a>
        <Link href={footerLegalLink.href} className={bottomLinkClass}>
          {footerLegalLink.label}
        </Link>
        </div>
      </div>
    </footer>
  );
}
