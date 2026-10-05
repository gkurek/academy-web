import type { MDXProps } from "mdx/types";
import type { ComponentType } from "react";
import type { Image, Offer, OfferFacts, Testimonial } from "@/content/types";
import type { SemesterItem, StepItem } from "@/components/content/OfferContentContext";
import {
  parseYear,
  resolveEnrollmentState,
  type EnrollmentState,
  type WorkshopOfferFacts,
} from "@/content/enrollment";
import { formatDateRange } from "@/lib/formatDateRange";
import { assertIsoDate, todayInWarsaw } from "@/lib/isoDate";
import KursContent, { frontmatter as kursFrontmatter } from "../../content/offers/kurs-roczny-i-trzyletni.mdx";
import PlenerContent, { frontmatter as plenerFrontmatter } from "../../content/offers/letnia-szkola-swiatla.mdx";
import WykladyContent, { frontmatter as wykladyFrontmatter } from "../../content/offers/wyklady.mdx";
import ZamowienieContent, { frontmatter as zamowienieFrontmatter } from "../../content/offers/zamowienie.mdx";

export type OfferLeadExtraPlace = {
  place: string;
  newsSlug?: string;
};

/** Short block under the lead, left of the FactsBox on desktop. */
export type OfferLeadExtra = {
  heading: string;
  items: { title: string; text: string; whereWeWere?: OfferLeadExtraPlace[] }[];
};

/** Prose sections under the lead (left column), e.g. zamówienie intro from WP. */
export type OfferLeadIntroSection = {
  heading: string;
  paragraphs: string[];
};

export type OfferFrontmatter = {
  slug: string;
  title: string;
  lead?: string;
  leadSecondary?: string;
  leadExtra?: OfferLeadExtra;
  leadIntro?: OfferLeadIntroSection[];
  kind: Offer["kind"];
  sample?: boolean;
  facts: OfferFacts;
  hero?: Image;
  semesters?: SemesterItem[];
  steps?: StepItem[];
  quote?: Testimonial & { image?: Image };
  exampleSlugs?: string[];
};

export type LoadedOffer = Offer & {
  leadSecondary?: string;
  leadExtra?: OfferLeadExtra;
  leadIntro?: OfferLeadIntroSection[];
  semesters: SemesterItem[];
  steps: StepItem[];
  exampleSlugs: string[];
  quote?: Testimonial & { image?: Image };
  Content: ComponentType<MDXProps>;
};

type OfferModule = {
  Content: ComponentType<MDXProps>;
  frontmatter: OfferFrontmatter;
};

const offerModules: Record<string, OfferModule> = {
  "kurs-roczny-i-trzyletni": {
    Content: KursContent,
    frontmatter: kursFrontmatter as OfferFrontmatter,
  },
  "letnia-szkola-swiatla": {
    Content: PlenerContent,
    frontmatter: plenerFrontmatter as OfferFrontmatter,
  },
  wyklady: {
    Content: WykladyContent,
    frontmatter: wykladyFrontmatter as OfferFrontmatter,
  },
  zamowienie: {
    Content: ZamowienieContent,
    frontmatter: zamowienieFrontmatter as OfferFrontmatter,
  },
};

const workshopSlugs = ["kurs-roczny-i-trzyletni", "letnia-szkola-swiatla"] as const;

function toOffer(offerModule: OfferModule): LoadedOffer {
  const { frontmatter, Content } = offerModule;
  return {
    slug: frontmatter.slug,
    title: frontmatter.title,
    lead: frontmatter.lead,
    leadSecondary: frontmatter.leadSecondary,
    leadExtra: frontmatter.leadExtra,
    leadIntro: frontmatter.leadIntro,
    kind: frontmatter.kind,
    facts: frontmatter.facts,
    hero: frontmatter.hero,
    semesters: frontmatter.semesters ?? [],
    steps: frontmatter.steps ?? [],
    exampleSlugs: frontmatter.exampleSlugs ?? [],
    quote: frontmatter.quote,
    body: "",
    Content,
  };
}

export function getOffer(slug: string): LoadedOffer | undefined {
  const offerModule = offerModules[slug];
  return offerModule ? toOffer(offerModule) : undefined;
}

export function getOffers(): LoadedOffer[] {
  return Object.values(offerModules).map(toOffer);
}

export function getWorkshopOffers(): LoadedOffer[] {
  return workshopSlugs
    .map((slug) => offerModules[slug])
    .filter((offerModule): offerModule is OfferModule => offerModule !== undefined)
    .map(toOffer);
}

const ISO_DATE_FIELDS: (keyof OfferFacts)[] = [
  "enrollmentOpens",
  "enrollmentClose",
  "firstMeetingDate",
  "registrationClose",
  "dateStart",
  "dateEnd",
];

function validateOfferFactsIsoDates(offerModule: OfferModule): void {
  const { slug, facts } = offerModule.frontmatter;

  ISO_DATE_FIELDS.forEach((field) => {
    const value = facts[field];
    if (typeof value === "string" && value.length > 0) {
      assertIsoDate(value, `content/offers/${slug}.mdx facts.${field}`);
    }
  });
}

workshopSlugs.forEach((slug) => {
  const offerModule = offerModules[slug];
  if (offerModule) {
    validateOfferFactsIsoDates(offerModule);
  }
});

/** Facts the home „Najbliższe” Warsztaty slot is computed from (plan 10-k4 N6). */
export function getUpcomingOfferFacts(): WorkshopOfferFacts {
  return {
    kurs: offerModules["kurs-roczny-i-trzyletni"].frontmatter.facts,
    plener: offerModules["letnia-szkola-swiatla"].frontmatter.facts,
  };
}

/** Enrollment state of an offer on `today` — the same windows as „Najbliższe” on `/` (D5). */
export function getEnrollmentState(
  offer: Pick<Offer, "kind" | "facts">,
  today: string = todayInWarsaw(),
): EnrollmentState {
  return resolveEnrollmentState(offer.kind, offer.facts, getUpcomingOfferFacts(), today);
}

/** Values for `{season}`, `{year}`, `{enrollmentClose}`, `{firstMeeting}` in offer copy (`pl.ts`). */
export function getOfferDateValues(facts: OfferFacts): Record<string, string | undefined> {
  const year = parseYear(facts.dateStart) ?? parseYear(facts.seasonLabel);

  return {
    season: facts.seasonLabel,
    year: year === undefined ? undefined : String(year),
    enrollmentClose: facts.enrollmentClose
      ? formatDateRange(facts.enrollmentClose, undefined, { withYear: true })
      : undefined,
    firstMeeting: facts.firstMeetingDate
      ? formatDateRange(facts.firstMeetingDate, undefined, { withYear: true })
      : undefined,
  };
}
