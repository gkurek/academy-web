import type { ReactNode } from "react";

import { ExternalLink } from "@/components/core/ExternalLink";
import { getSiteSettings } from "@/content/settings";
import { pl } from "@/i18n/pl";
import { buildGoogleMapsDirectionsUrl, buildGoogleMapsSearchUrl } from "@/lib/googleMaps";

const contactOnlineLinkClass =
  "inline-block w-fit text-accent-text no-underline border-b border-accent-veil hover:text-accent-hover hover:border-accent-hover";

const mapLinkClass =
  "inline-block w-fit text-size-ui text-accent-text no-underline border-b border-accent-veil hover:text-accent-hover hover:border-accent-hover";

export interface MapBlockProps {
  /** Google Maps embed URL; without it, renders an empty tile with a short note. */
  embedSrc?: string;
  address?: ReactNode;
  /** Directions, parking, accessibility — shown under the address heading. */
  transport?: ReactNode;
  /** Extra block below the address panel (organizer, online links). */
  aside?: ReactNode;
}

function mapsDestinationQuery(): string {
  const settings = getSiteSettings();
  return `${settings.place}, ${settings.address}`;
}

export function MapEmbed({ embedSrc }: { embedSrc?: string }) {
  if (!embedSrc) {
    return (
      <div className="flex h-contact-map-m md:h-contact-map items-center justify-center bg-surface-tile px-page-margin-mobile text-center text-size-ui text-text-tertiary md:px-space-6">
        {pl.contact.mapPlaceholder}
      </div>
    );
  }

  return (
    <iframe
      src={embedSrc}
      title={pl.contact.mapTitle}
      className="block h-contact-map-m md:h-contact-map w-full border-0 bg-surface-tile"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

export function MapDirectionsLinks() {
  const destination = mapsDestinationQuery();

  return (
    <div className="mt-space-3 flex flex-col gap-space-2 sm:flex-row sm:flex-wrap sm:gap-x-space-6">
      <ExternalLink href={buildGoogleMapsSearchUrl(destination)} className={mapLinkClass}>
        {pl.contact.mapOpenInGoogle}
      </ExternalLink>
      <ExternalLink href={buildGoogleMapsDirectionsUrl(destination)} className={mapLinkClass}>
        {pl.contact.mapGetDirections}
      </ExternalLink>
    </div>
  );
}

export function OnlineAside() {
  const settings = getSiteSettings();
  const { contact, footer } = pl;

  return (
    <div className="grid gap-px bg-line-gold">
      <div className="bg-surface-tile px-space-5 py-space-5 md:px-space-6 md:py-space-6">
        <h2 className="mb-space-3 font-serif text-size-h3-m md:text-size-h3 leading-heading text-text-h2">
          {contact.organizerHeading}
        </h2>
        <p className="text-size-body leading-body text-text-secondary md:text-size-body-lg md:leading-prose">
          {contact.organizerLead}{" "}
          <ExternalLink
            href={settings.ecosystem.foundationUrl}
            className={contactOnlineLinkClass}
            showIcon={false}
          >
            {contact.organizerLinkLabel}
          </ExternalLink>
          {contact.organizerTail}
        </p>
      </div>
      <div className="bg-surface-tile px-space-5 py-space-5 md:px-space-6 md:py-space-6">
        <h2 className="mb-space-3 font-serif text-size-h3-m md:text-size-h3 leading-heading text-text-h2">
          {contact.onlineHeading}
        </h2>
        <div className="grid gap-space-2 text-size-ui leading-body">
          <ExternalLink href={settings.ecosystem.social.facebook} className={contactOnlineLinkClass}>
            {footer.facebookLabel}
          </ExternalLink>
          <ExternalLink href={settings.ecosystem.social.youtube} className={contactOnlineLinkClass}>
            {footer.youtubeLabel}
          </ExternalLink>
          <ExternalLink href={settings.blogUrl} className={contactOnlineLinkClass}>
            {contact.blogLinkLabel}
          </ExternalLink>
        </div>
      </div>
    </div>
  );
}

export function MapBlock({ embedSrc, address, transport, aside }: MapBlockProps) {
  const resolvedAside = aside ?? (!address ? <OnlineAside /> : undefined);

  const infoPanel =
    address || transport || resolvedAside ? (
      <div className="grid gap-space-4">
        {address || transport ? (
          <div>
            {address ? (
              <>
                <h2 className="mb-space-3 font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2">
                  {pl.contact.addressHeading}
                </h2>
                <div className="text-size-body-lg leading-body text-text-body">{address}</div>
              </>
            ) : null}
            {transport ? (
              <p className="mt-space-3 text-size-ui leading-body text-text-tertiary">{transport}</p>
            ) : null}
          </div>
        ) : null}
        {resolvedAside}
      </div>
    ) : null;

  if (address) {
    return (
      <div className="grid grid-cols-1 items-start gap-space-6 lg:grid-cols-map-block lg:gap-space-8">
        <MapEmbed embedSrc={embedSrc} />
        {infoPanel}
      </div>
    );
  }

  return (
    <div className="grid gap-space-6">
      <MapEmbed embedSrc={embedSrc} />
      {resolvedAside}
    </div>
  );
}
