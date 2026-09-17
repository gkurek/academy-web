import type { ComponentType } from "react";
import type { Image, Offer, OfferFacts, Testimonial } from "@/content/types";
import type { SemesterItem, StepItem } from "@/components/content/OfferContentContext";
import KursContent, { frontmatter as kursFrontmatter } from "../../content/offers/kurs-roczny-i-trzyletni.mdx";
import PlenerContent, { frontmatter as plenerFrontmatter } from "../../content/offers/letnia-szkola-swiatla.mdx";
import WykladyContent, { frontmatter as wykladyFrontmatter } from "../../content/offers/wyklady.mdx";
import ZamowienieContent, { frontmatter as zamowienieFrontmatter } from "../../content/offers/zamowienie.mdx";

export type OfferFrontmatter = {
  slug: string;
  title: string;
  lead?: string;
  leadSecondary?: string;
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
  semesters: SemesterItem[];
  steps: StepItem[];
  exampleSlugs: string[];
  quote?: Testimonial & { image?: Image };
  Content: ComponentType;
};

type OfferModule = {
  Content: ComponentType;
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
