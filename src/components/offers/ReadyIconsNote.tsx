import { TextLink } from "@/components/core/TextLink";
import { pl } from "@/i18n/pl";

export interface ReadyIconsNoteProps {
  email: string;
}

export function ReadyIconsNote({ email }: ReadyIconsNoteProps) {
  return (
    <section
      aria-labelledby="ready-icons-heading"
      className="rule-gold-t surface-tile-bleed -mb-space-6 px-page-margin-mobile md:px-page-margin py-offer-ready-y flex flex-col md:flex-row md:flex-wrap md:items-baseline gap-y-space-3 gap-x-offer-ready-gap-x"
    >
      <h2
        id="ready-icons-heading"
        className="font-serif text-size-role-box-title-m md:text-size-role-box-title leading-heading text-text-h2 shrink-0"
      >
        {pl.offers.readyIconsTitle}
      </h2>
      <p className="text-size-body leading-body text-text-secondary max-w-measure-prose m-0">
        {pl.offers.readyIconsBody}{" "}
        <TextLink href={`mailto:${email}`} className="text-size-body">
          {email}
        </TextLink>
        .
      </p>
    </section>
  );
}
