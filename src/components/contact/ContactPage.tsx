import type { MDXComponents } from "mdx/types";
import type { ComponentType } from "react";

import { ContactPhoto } from "@/components/contact/ContactPhoto";
import { ContactRow } from "@/components/contact/ContactRow";
import { EntranceNote } from "@/components/contact/EntranceNote";
import { OnlineAside } from "@/components/contact/OnlineAside";
import { PageHeading } from "@/components/core/PageHeading";
import { TextLink } from "@/components/core/TextLink";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { getPhoneHref, getSiteSettings } from "@/content/settings";
import { pl } from "@/i18n/pl";
import { nbspChildren } from "@/lib/typography";

export interface ContactPageProps {
  /** Route path — see SectionPageShellProps["path"]. */
  path: string;
  /** Page heading — the nav label, same as the document title. */
  title: string;
  Content: ComponentType<{ components?: MDXComponents }>;
}

const contactLinkClass = "text-size-role-row-title-m leading-heading md:text-size-role-row-title";

// The church name runs long (settings text carries no-break spaces after single letters): break before „pw.” and „i św.” so the address reads as three short lines plus the street.
const PLACE_BREAK_RE = /\s(?=pw\.|i\sśw\.)/;

export function ContactPage({ path, title, Content }: ContactPageProps) {
  const settings = getSiteSettings();
  const telHref = getPhoneHref();
  const placeLines = settings.place.split(PLACE_BREAK_RE);
  const addressLines = [...placeLines, settings.address];
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${placeLines[0]}, ${settings.address}`,
  )}`;

  return (
    <SectionPageShell path={path}>
      <div className="contact-page-grid">
        <PageHeading level="page" className="contact-page-heading mb-space-5 md:mb-space-6">
          {title}
        </PageHeading>

        <div className="contact-rows">
          {settings.emails.map((email) => (
            <ContactRow key={email.address} label={email.label}>
              <TextLink
                href={`mailto:${email.address}`}
                standalone
                className={`${contactLinkClass} w-fit`}
              >
                {email.address}
              </TextLink>
              {email.contactName ? <div className="contact-row-note">{email.contactName}</div> : null}
            </ContactRow>
          ))}
          <ContactRow label={pl.contact.phoneLabel}>
            <TextLink href={telHref} standalone className={`${contactLinkClass} w-fit`}>
              {settings.phone}
            </TextLink>
          </ContactRow>
          <ContactRow label={pl.contact.addressHeading}>
            <address className="text-size-lead-m not-italic leading-body text-text-body md:text-size-body-lg">
              {addressLines.map((line) => (
                <span key={line} className="block">
                  {nbspChildren(line)}
                </span>
              ))}
            </address>
          </ContactRow>
          <OnlineAside />
        </div>

        <div className="contact-page-aside">
          <div className="order-2 lg:order-1">
            <ContactPhoto />
          </div>
          <div className="order-1 lg:order-2">
            <EntranceNote Content={Content} mapUrl={mapUrl} />
          </div>
        </div>
      </div>
    </SectionPageShell>
  );
}
