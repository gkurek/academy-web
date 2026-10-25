import type { MDXComponents } from "mdx/types";
import type { ComponentType } from "react";

import { Prose } from "@/components/core/Prose";
import { TextLink } from "@/components/core/TextLink";
import { MdxLink } from "@/components/content/MdxLink";
import { pl } from "@/i18n/pl";

export interface EntranceNoteProps {
  Content: ComponentType<{ components?: MDXComponents }>;
  /** Google Maps link for the church address. */
  mapUrl: string;
}

/** „Wejście” block on /kontakt — gold bar on top, entrance instructions (MDX), access note and map link. */
export function EntranceNote({ Content, mapUrl }: EntranceNoteProps) {
  const { contact, footer } = pl;

  return (
    <section className="contact-entrance" aria-labelledby="contact-entrance-heading">
      <h2
        id="contact-entrance-heading"
        className="font-serif text-size-role-box-title-m leading-heading text-text-h2 md:text-size-role-box-title"
      >
        {contact.entranceHeading}
      </h2>
      <Prose variant="text">
        <Content components={{ a: MdxLink }} />
      </Prose>
      <div className="contact-entrance-access">
        <p className="text-size-nav leading-body text-text-secondary">{footer.accessibilityNote}</p>
        <TextLink href={mapUrl} external standalone className="w-fit text-size-body-lg">
          {contact.mapLinkLabel}
        </TextLink>
      </div>
    </section>
  );
}
