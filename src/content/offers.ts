import { nbspDeep } from "@/lib/typography";
import type { MDXProps } from "mdx/types";
import type { ComponentType } from "react";
import type { ExhibitionTravelingPlace, Image, Offer, OfferFacts, Testimonial } from "@/content/types";
import {
  parseYear,
  resolveEnrollmentState,
  type EnrollmentState,
  type WorkshopOfferFacts,
} from "@/content/enrollment";
import { formatDateRange } from "@/lib/formatDateRange";
import { assertNewsSlug } from "@/content/validate";
import { assertIsoDate, todayInWarsaw } from "@/lib/isoDate";
import KursContent, { frontmatter as kursFrontmatter } from "../../content/offers/kurs-roczny-i-trzyletni.mdx";
import PlenerContent, { frontmatter as plenerFrontmatter } from "../../content/offers/letnia-szkola-swiatla.mdx";
import WykladyContent, { frontmatter as wykladyFrontmatter } from "../../content/offers/wyklady.mdx";
import ZamowienieContent, { frontmatter as zamowienieFrontmatter } from "../../content/offers/zamowienie.mdx";

/** Same shape as the exhibition's traveling places — one list-of-places type (S-15). */
export type OfferLeadExtraPlace = ExhibitionTravelingPlace;

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

export type SemesterItem = {
  title: string;
  /** Short paragraph when there is no bullet list (e.g. semesters V–VI). */
  body?: string;
  topics?: string[];
};

export type StepItem = {
  title: string;
  body?: string;
};

type OfferFrontmatter = {
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
};

/** The MDX body is the `Content` component, and the quote comes from frontmatter — not `body` / `testimonials`. */
export type LoadedOffer = Omit<Offer, "body" | "testimonials"> & {
  leadSecondary?: string;
  leadExtra?: OfferLeadExtra;
  leadIntro?: OfferLeadIntroSection[];
  semesters: SemesterItem[];
  steps: StepItem[];
  quote?: Testimonial & { image?: Image };
  Content: ComponentType<MDXProps>;
};

type OfferModule = {
  Content: ComponentType<MDXProps>;
  frontmatter: OfferFrontmatter;
};

/** Offers behind fixed routes — a missing module is a build error, never a 404 (S-08). */
export type OfferSlug = "kurs-roczny-i-trzyletni" | "letnia-szkola-swiatla" | "wyklady" | "zamowienie";

const offerModules: Record<OfferSlug, OfferModule> = {
  "kurs-roczny-i-trzyletni": {
    Content: KursContent,
    frontmatter: nbspDeep(kursFrontmatter as OfferFrontmatter),
  },
  "letnia-szkola-swiatla": {
    Content: PlenerContent,
    frontmatter: nbspDeep(plenerFrontmatter as OfferFrontmatter),
  },
  wyklady: {
    Content: WykladyContent,
    frontmatter: nbspDeep(wykladyFrontmatter as OfferFrontmatter),
  },
  zamowienie: {
    Content: ZamowienieContent,
    frontmatter: nbspDeep(zamowienieFrontmatter as OfferFrontmatter),
  },
};

const workshopSlugs = ["kurs-roczny-i-trzyletni", "letnia-szkola-swiatla"] as const satisfies readonly OfferSlug[];

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
    quote: frontmatter.quote,
    Content,
  };
}

/** The offer behind a fixed route; throws when its MDX is missing (build fails instead of a 404). */
export function requireOffer(slug: OfferSlug): LoadedOffer {
  const offerModule = offerModules[slug];
  if (!offerModule) {
    throw new Error(`content/offers: no offer "${slug}" — the route that needs it cannot render`);
  }
  return toOffer(offerModule);
}

export function getWorkshopOffers(): LoadedOffer[] {
  return workshopSlugs.map(requireOffer);
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

function validateOfferModule(key: OfferSlug, offerModule: OfferModule): void {
  const { slug, leadExtra } = offerModule.frontmatter;

  if (slug !== key) {
    throw new Error(`content/offers: frontmatter slug "${slug}" does not match registry key "${key}"`);
  }

  validateOfferFactsIsoDates(offerModule);

  leadExtra?.items.forEach((item, itemIndex) => {
    item.whereWeWere?.forEach((entry, placeIndex) => {
      if (entry.newsSlug) {
        assertNewsSlug(
          entry.newsSlug,
          `content/offers/${slug}.mdx leadExtra.items[${itemIndex}].whereWeWere[${placeIndex}]`,
        );
      }
    });
  });
}

(Object.entries(offerModules) as [OfferSlug, OfferModule][]).forEach(([key, offerModule]) =>
  validateOfferModule(key, offerModule),
);

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
