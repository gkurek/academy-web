import { ExternalLink } from "@/components/core/ExternalLink";
import { getSiteSettings } from "@/content/settings";
import { pl } from "@/i18n/pl";

const contactOnlineLinkClass =
  "inline-block w-fit text-accent-text no-underline hover:text-accent-hover";

const mapLinkUnderline = "link-underline-target link-underline-target--border";

export function OnlineAside() {
  const settings = getSiteSettings();
  const { contact, footer } = pl;

  return (
    <div className="hairline-stack">
      <div className="bg-surface-tile px-space-5 py-space-5 md:px-space-6 md:py-space-6">
        <h2 className="mb-space-3 font-serif text-size-role-box-title-m md:text-size-role-box-title leading-heading text-text-h2">
          {contact.organizerHeading}
        </h2>
        <p className="text-size-body leading-body text-text-secondary md:text-size-body-lg md:leading-prose">
          {contact.organizerLead}
          <ExternalLink href={settings.ecosystem.foundationUrl} className={contactOnlineLinkClass}>
            <span className={mapLinkUnderline}>{contact.organizerLinkLabel}</span>
          </ExternalLink>
          {contact.organizerTail}
        </p>
      </div>
      <div className="bg-surface-tile px-space-5 py-space-5 md:px-space-6 md:py-space-6">
        <h2 className="mb-space-3 font-serif text-size-role-box-title-m md:text-size-role-box-title leading-heading text-text-h2">
          {contact.onlineHeading}
        </h2>
        <div className="grid gap-space-2 text-size-ui leading-body">
          <ExternalLink href={settings.ecosystem.social.facebook} className={contactOnlineLinkClass}>
            <span className={mapLinkUnderline}>{footer.facebookLabel}</span>
          </ExternalLink>
          <ExternalLink href={settings.ecosystem.social.youtube} className={contactOnlineLinkClass}>
            <span className={mapLinkUnderline}>{footer.youtubeLabel}</span>
          </ExternalLink>
          <ExternalLink href={settings.blogUrl} className={contactOnlineLinkClass}>
            <span className={mapLinkUnderline}>{contact.blogLinkLabel}</span>
          </ExternalLink>
        </div>
      </div>
    </div>
  );
}
