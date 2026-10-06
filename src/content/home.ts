import { nbspDeep } from "@/lib/typography";
import homeData from "../../content/pages/home.json";
import type { Image } from "@/content/types";
import { assertImage } from "@/content/validate";
import { navItem, sectionLink } from "@/navigation";

/** Pillar targets in `home.json` order — hrefs come from `navigation.ts`, not from the JSON. */
const PILLAR_HREFS = ["/warsztaty", "/wyklady", "/ikony"].map((href) => navItem(href).href);
const ICONS_EXHIBITIONS_HREF = sectionLink("/ikony/wystawy").href;

type HomePillar = {
  title: string;
  body: string;
  linkLabel: string;
  secondaryLinkLabel?: string;
  image: Image;
};

type HomePageData = {
  hero: { title: string; lead: string; image: Image };
  /** One entry per pillar target, in the order Warsztaty, Wykłady, Ikony. */
  pillars: HomePillar[];
  testimonial: { quote: string; author: string };
};

const home = nbspDeep(homeData as HomePageData);

function assertText(value: string, context: string): void {
  if (!value?.trim()) {
    throw new Error(`content/pages/home.json: ${context} is empty`);
  }
}

function validateHome(data: HomePageData): void {
  assertText(data.hero.title, "hero.title");
  assertText(data.hero.lead, "hero.lead");
  assertImage(data.hero.image, "content/pages/home.json hero.image");
  assertText(data.testimonial.quote, "testimonial.quote");
  assertText(data.testimonial.author, "testimonial.author");

  if (data.pillars.length !== PILLAR_HREFS.length) {
    throw new Error(`content/pages/home.json: expected ${PILLAR_HREFS.length} pillars, found ${data.pillars.length}`);
  }

  data.pillars.forEach((pillar, index) => {
    assertText(pillar.title, `pillars[${index}].title`);
    assertText(pillar.body, `pillars[${index}].body`);
    assertText(pillar.linkLabel, `pillars[${index}].linkLabel`);
    assertImage(pillar.image, `content/pages/home.json pillars[${index}].image`);
  });
}

validateHome(home);

export type LoadedHomePillar = HomePillar & {
  href: string;
  secondaryHref?: string;
};

export type LoadedHomePage = Omit<HomePageData, "pillars"> & { pillars: LoadedHomePillar[] };

export function getHomePage(): LoadedHomePage {
  return {
    ...home,
    pillars: home.pillars.map((pillar, index) => ({
      ...pillar,
      href: PILLAR_HREFS[index],
      // Only the Icons pillar offers a second link (to the exhibitions page).
      secondaryHref: pillar.secondaryLinkLabel ? ICONS_EXHIBITIONS_HREF : undefined,
    })),
  };
}
