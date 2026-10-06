import { nbspDeep } from "@/lib/typography";
import hubData from "../../content/pages/workshops-hub.json";
import type { Image } from "@/content/types";
import { assertImage } from "@/content/validate";

type WorkshopHubCard = {
  eyebrow: string;
  excerpt: string;
  bullets: string[];
  ctaLabel: string;
  ctaVariant: "primary" | "secondary";
  image: Image;
};

export type WorkshopsHubData = {
  lead: string;
  leadSecondary: string;
  /** Keyed by offer slug — an offer without a card fails the build in `WorkshopsHubPage`. */
  cards: Record<string, WorkshopHubCard>;
};

const hub = nbspDeep(hubData as WorkshopsHubData);

function validateHub(data: WorkshopsHubData): void {
  if (!data.lead?.trim() || !data.leadSecondary?.trim()) {
    throw new Error("content/pages/workshops-hub.json: lead and leadSecondary are required");
  }

  Object.entries(data.cards).forEach(([slug, card]) => {
    const context = `content/pages/workshops-hub.json cards.${slug}`;
    if (!card.eyebrow?.trim() || !card.excerpt?.trim() || !card.ctaLabel?.trim() || card.bullets.length === 0) {
      throw new Error(`${context}: eyebrow, excerpt, ctaLabel and bullets are required`);
    }
    assertImage(card.image, `${context}.image`);
  });
}

validateHub(hub);

export function getWorkshopsHub(): WorkshopsHubData {
  return hub;
}
