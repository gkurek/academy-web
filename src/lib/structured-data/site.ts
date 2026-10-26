import { getPhoneHref, getSiteSettings } from "@/content/settings";
import { pl } from "@/i18n/pl";
import { SITE_URL } from "@/lib/metadata";
import { plainText } from "@/lib/typography";

/** A schema.org node — loose on purpose; validated with validator.schema.org, not by types. */
export type JsonLdNode = Record<string, unknown>;

export const CONTEXT = "https://schema.org";
const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** Absolute URL of a site path or `/media/…` file. */
export function absoluteUrl(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

const ADDRESS_LOCALITY_SUFFIX = " w Warszawie";

/** `settings.address` is one display string („ul. Senatorska 18B w Warszawie”); split off the city. */
function postalAddress(): JsonLdNode {
  const address = plainText(getSiteSettings().address);
  if (!address.endsWith(ADDRESS_LOCALITY_SUFFIX)) {
    throw new Error(`settings.json: address "${address}" must end with "${ADDRESS_LOCALITY_SUFFIX}"`);
  }

  return {
    "@type": "PostalAddress",
    streetAddress: address.slice(0, -ADDRESS_LOCALITY_SUFFIX.length),
    addressLocality: "Warszawa",
    addressCountry: "PL",
  };
}

/** The church where workshops, lectures and the permanent exhibition take place. */
export function venuePlace(): JsonLdNode {
  return { "@type": "Place", name: getSiteSettings().place, address: postalAddress() };
}

export function organizationRef(): JsonLdNode {
  return { "@id": ORGANIZATION_ID };
}

/** Site-wide `Organization` — emitted once, in the root layout. */
export function organizationNode(founderId: string): JsonLdNode {
  const { orgName, emails, blogUrl, ecosystem } = getSiteSettings();

  return {
    "@context": CONTEXT,
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: orgName,
    alternateName: pl.meta.titleBrand,
    url: SITE_URL,
    email: emails.find((email) => email.role === "enrollment")?.address,
    telephone: getPhoneHref().replace("tel:", ""),
    address: postalAddress(),
    location: venuePlace(),
    foundingDate: pl.meta.foundingYear,
    founder: { "@id": founderId },
    parentOrganization: { "@type": "Organization", name: pl.meta.foundationName, url: ecosystem.foundationUrl },
    sameAs: [ecosystem.social.facebook, ecosystem.social.youtube, blogUrl],
  };
}
