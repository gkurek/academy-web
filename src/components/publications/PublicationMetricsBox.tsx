import { Button } from "@/components/core/Button";
import { TextLink } from "@/components/core/TextLink";
import type { PublicationFrontmatter } from "@/content/publications";
import { formatPublicationPrice } from "@/content/publications";
import { getSiteSettings } from "@/content/settings";
import { pl } from "@/i18n/pl";
import { buildMailtoHref } from "@/lib/mailto";

export interface PublicationMetricsBoxProps {
  publication: PublicationFrontmatter;
}

export function PublicationMetricsBox({ publication }: PublicationMetricsBoxProps) {
  const { facts, mailtoSubject, orderAlbumMailto } = pl.publications;
  const settings = getSiteSettings();
  const secretariatEmail = settings.emails.find((email) => email.label.includes("sekretariat"))
    ?.address ?? settings.emails[1]?.address ?? settings.emails[0].address;
  const mailtoHref = buildMailtoHref(secretariatEmail, mailtoSubject);
  const priceLabel = formatPublicationPrice(publication.price);
  const availabilityLabel =
    publication.availability === "dostepny"
      ? facts.availabilityAvailableShort
      : facts.availabilitySoldOut;
  const rows = [
    { label: facts.publisher, value: publication.publisher },
    { label: facts.year, value: String(publication.year) },
    { label: facts.pageCount, value: String(publication.pages) },
    { label: facts.format, value: publication.format },
    ...(publication.isbn ? [{ label: facts.isbn, value: publication.isbn }] : []),
    ...(priceLabel ? [{ label: facts.price, value: priceLabel }] : []),
    { label: facts.availability, value: availabilityLabel },
  ];

  return (
    <aside className="publication-metrics" aria-labelledby="publication-metrics-heading">
      <h2
        id="publication-metrics-heading"
        className="publication-metrics-heading"
      >
        {facts.heading}
      </h2>

      <dl className="publication-metrics-list">
        {rows.map((row) => (
          <div key={row.label} className="publication-metrics-row">
            <dt className="publication-metrics-label">{row.label}</dt>
            <dd className="publication-metrics-value">{row.value}</dd>
          </div>
        ))}
        <div className="publication-metrics-row">
          <dt className="publication-metrics-label">{facts.howToBuy}</dt>
          <dd className="publication-metrics-value">
            Na wykładach w Kościele Środowisk Twórczych (
            <TextLink href="/wyklady">{facts.lecturesLink}</TextLink>
            ) albo mailowo, z wysyłką pocztą.
          </dd>
        </div>
      </dl>

      <div className="publication-metrics-cta">
        <Button
          href={mailtoHref}
          variant={publication.availability === "dostepny" ? "primary" : "secondary"}
          block
          size="lg"
        >
          {orderAlbumMailto}
        </Button>
        <p className="publication-metrics-note">{facts.shippingNote}</p>
      </div>
    </aside>
  );
}
