import { ContactRow } from "@/components/contact/ContactRow";
import { ExternalLink } from "@/components/core/ExternalLink";
import { TextLink } from "@/components/core/TextLink";
import { getSiteSettings } from "@/content/settings";
import { pl } from "@/i18n/pl";

const quietTextClass = "text-size-nav leading-body text-text-secondary";

/** Closing rows of the /kontakt details list (mockup 1g): organizer and online presence, quieter than the contact data. */
export function OnlineAside() {
  const settings = getSiteSettings();
  const { contact, footer } = pl;

  return (
    <>
      <ContactRow label={contact.organizerHeading}>
        <p className={quietTextClass}>
          {contact.organizerLead}
          <ExternalLink
            href={settings.ecosystem.foundationUrl}
            className="whitespace-nowrap text-accent-text no-underline hover:text-accent-hover"
          >
            <span className="link-underline-target link-underline-target--border">{contact.organizerLinkLabel}</span>
          </ExternalLink>
          {contact.organizerTail}
        </p>
      </ContactRow>
      <ContactRow label={contact.onlineHeading}>
        <div className={`flex flex-col lg:flex-row lg:flex-wrap lg:gap-x-space-7 lg:gap-y-space-3 ${quietTextClass}`}>
          <TextLink href={settings.ecosystem.social.facebook} external standalone className="w-fit">
            {footer.facebookLabel}
          </TextLink>
          <TextLink href={settings.ecosystem.social.youtube} external standalone className="w-fit">
            {footer.youtubeLabel}
          </TextLink>
          <TextLink href={settings.blogUrl} external standalone className="w-fit">
            {contact.blogLinkLabel}
          </TextLink>
        </div>
      </ContactRow>
    </>
  );
}
