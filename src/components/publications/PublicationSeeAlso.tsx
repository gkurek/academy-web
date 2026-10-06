import { TextLink } from "@/components/core/TextLink";
import { pl } from "@/i18n/pl";

export interface PublicationSeeAlsoProps {
  links: { href: string; label: string }[];
}

export function PublicationSeeAlso({ links }: PublicationSeeAlsoProps) {
  return (
    <footer className="publication-see-also">
      <div className="publication-see-also-row">
        <span className="publication-see-also-label">{pl.publications.seeAlsoLabel}</span>
        {links.map((link) => (
          <TextLink key={link.href} standalone href={link.href}>
            {link.label}
          </TextLink>
        ))}
      </div>
    </footer>
  );
}
