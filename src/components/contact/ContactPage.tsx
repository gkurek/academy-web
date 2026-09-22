import type { ComponentType } from "react";

import { MapEmbed, OnlineAside } from "@/components/contact/MapBlock";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { getSiteSettings } from "@/content/settings";
import { pl } from "@/i18n/pl";
import { mainNav } from "@/navigation";

export interface ContactPageProps {
  Content: ComponentType;
}

export function ContactPage({ Content }: ContactPageProps) {
  const settings = getSiteSettings();
  const contactLabel = mainNav.find((item) => item.href === "/kontakt")!.label;
  const telHref = pl.factsBox.phoneTel;

  return (
    <SectionPageShell active={contactLabel}>
      <div className="mx-auto w-full max-w-content-max">
        <Breadcrumb
          items={[
            { label: pl.contact.breadcrumbHome, href: "/" },
            { label: contactLabel },
          ]}
        />

        <div className="contact-page-grid mt-space-5">
          <div className="contact-page-top-left">
            <h1 className="mb-space-5 font-serif text-size-h1-m leading-tight text-text-h1 md:mb-space-6 md:text-size-h1">
              {contactLabel}
            </h1>

            <div className="contact-page-emails">
              {settings.emails.map((email, index) => (
                <div key={email.address} className="contact-email-card">
                  <div className="contact-email-label">{email.label}</div>
                  <a href={`mailto:${email.address}`} className="contact-email-line">
                    {email.address}
                  </a>
                  {index === 0 ? (
                    <a href={telHref} className="contact-email-line">
                      {settings.phone}
                    </a>
                  ) : null}
                  {email.contactName ? (
                    <div className="contact-email-name">{email.contactName}</div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="contact-page-map">
            <MapEmbed embedSrc={settings.mapEmbedUrl} />
          </div>

          <div className="contact-page-address">
            <h2 className="mb-space-3 font-serif text-size-role-section-h2-m md:text-size-role-section-h2 leading-heading text-text-h2">
              {pl.contact.addressHeading}
            </h2>
            <p className="mb-space-4 text-size-lead-m leading-body text-text-secondary md:text-size-lead">
              {settings.place}
              <br />
              {settings.address}
            </p>

            <div className="text-page-mdx">
              <Content />
            </div>

            <p className="mt-space-4 text-size-body leading-body text-text-secondary md:text-size-body-lg md:leading-prose">
              {pl.footer.accessibilityNote}
            </p>
          </div>

          <div className="contact-page-aside">
            <OnlineAside />
          </div>
        </div>
      </div>
    </SectionPageShell>
  );
}
