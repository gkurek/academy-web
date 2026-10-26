import { resolveAnnualDateEnd, resolveAnnualVernissage } from "@/content/exhibition";
import { resolveLecturer } from "@/content/lecturers";
import { getAllSeasonLectures } from "@/content/lectures";
import type { AnnualExhibition, LectureSeason, OfferFacts } from "@/content/types";
import { pl } from "@/i18n/pl";
import { fillTemplate } from "@/lib/fillTemplate";
import { absoluteUrl, CONTEXT, organizationRef, venuePlace, type JsonLdNode } from "@/lib/structured-data/site";

const OFFLINE = "https://schema.org/OfflineEventAttendanceMode";
const SCHEDULED = "https://schema.org/EventScheduled";

/** „400 zł / rok” → "400"; the price is per season, shown on every evening of it (K-157). */
function seasonPrice(price: string | undefined): string | undefined {
  return price?.match(/\d+/)?.[0];
}

/** One `Event` per lecture evening of the current season (K-17); date only — the time is free text in `facts.when`. */
export function lectureEventNodes(
  season: Pick<LectureSeason, "slug" | "cycleTitle">,
  facts: OfferFacts,
  path: string,
  imageSrc: string,
): JsonLdNode[] {
  const price = seasonPrice(facts.price);
  const offers = price
    ? { "@type": "Offer", price, priceCurrency: "PLN", url: absoluteUrl(path) }
    : undefined;

  return getAllSeasonLectures()
    .filter((entry) => entry.seasonSlug === season.slug)
    .map(({ lecture }) => {
      const performers = [...new Set(lecture.lecturerSlugs.filter(Boolean))].map((slug) => ({
        "@type": "Person",
        name: resolveLecturer(slug).name,
      }));

      return {
        "@context": CONTEXT,
        "@type": "Event",
        name: lecture.title,
        startDate: lecture.date,
        eventAttendanceMode: OFFLINE,
        eventStatus: SCHEDULED,
        location: venuePlace(),
        image: absoluteUrl(imageSrc),
        url: absoluteUrl(path),
        organizer: organizationRef(),
        superEvent: { "@type": "EventSeries", name: season.cycleTitle },
        ...(performers.length > 0 ? { performer: performers } : {}),
        ...(offers ? { offers } : {}),
      };
    });
}

/** `ExhibitionEvent` of the annual show — only once its vernissage date is set (K-157, S-12). */
export function annualExhibitionNode(
  exhibition: AnnualExhibition,
  path: string,
  imageSrc: string,
): JsonLdNode | undefined {
  const vernissage = resolveAnnualVernissage(exhibition);
  if (!vernissage) {
    return undefined;
  }

  return {
    "@context": CONTEXT,
    "@type": "ExhibitionEvent",
    name: fillTemplate(pl.meta.annualExhibitionEventName, { title: exhibition.title }),
    startDate: vernissage,
    endDate: resolveAnnualDateEnd(exhibition),
    eventAttendanceMode: OFFLINE,
    eventStatus: SCHEDULED,
    location: venuePlace(),
    image: absoluteUrl(imageSrc),
    url: absoluteUrl(path),
    organizer: organizationRef(),
  };
}
