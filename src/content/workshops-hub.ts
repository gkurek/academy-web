import { nbspDeep } from "@/lib/typography";
import hubData from "../../content/pages/workshops-hub.json";
import {
  isWithin,
  resolveCoursePhase,
  resolvePlenerRegistration,
  type WorkshopOfferFacts,
} from "@/content/enrollment";
import { getIconWorks } from "@/content/icons";
import { getTestimonials } from "@/content/testimonials";
import type { IconWork, Image, Offer, Testimonial } from "@/content/types";
import { assertImage } from "@/content/validate";
import { pl } from "@/i18n/pl";
import { fillTemplate as fill } from "@/lib/fillTemplate";
import { formatDateRange } from "@/lib/formatDateRange";

type WorkshopHubCard = {
  excerpt: string;
  bullets: string[];
  ctaLabel: string;
};

export type WorkshopsHubData = {
  lead: string;
  /** Wide photo between the lead and the offer cards. */
  image: Image;
  /** Keyed by offer slug — an offer without a card fails the build in `WorkshopsHubPage`. */
  cards: Record<string, WorkshopHubCard>;
  /** „Ikony naszych uczniów” — gallery works by slug, students only. */
  studentIcons: { intro: string; slugs: string[] };
  /** „Zanim zaczniesz” — questions of first-time students. */
  faq: { question: string; answer: string }[];
  /** Authors of the quotes under the FAQ, in display order (`content/testimonials.json`). */
  quoteAuthors: string[];
};

const hub = nbspDeep(hubData as WorkshopsHubData);

function validateHub(data: WorkshopsHubData): void {
  if (!data.lead?.trim()) {
    throw new Error("content/pages/workshops-hub.json: lead is required");
  }
  assertImage(data.image, "content/pages/workshops-hub.json image");

  if (data.faq.length === 0 || data.faq.some((item) => !item.question?.trim() || !item.answer?.trim())) {
    throw new Error("content/pages/workshops-hub.json: faq needs items with question and answer");
  }

  Object.entries(data.cards).forEach(([slug, card]) => {
    const context = `content/pages/workshops-hub.json cards.${slug}`;
    if (!card.excerpt?.trim() || !card.ctaLabel?.trim() || card.bullets.length === 0) {
      throw new Error(`${context}: excerpt, ctaLabel and bullets are required`);
    }
  });
}

validateHub(hub);

export function getWorkshopsHub(): WorkshopsHubData {
  return hub;
}

/** Student icons for the hub, in content order — an unknown or non-student slug fails the build. */
export function getWorkshopsHubStudentIcons(): IconWork[] {
  const icons = getIconWorks();
  return hub.studentIcons.slugs.map((slug) => {
    const icon = icons.find((work) => work.slug === slug);
    if (!icon || icon.author !== "student") {
      throw new Error(`content/pages/workshops-hub.json studentIcons: "${slug}" is not a student icon`);
    }
    return icon;
  });
}

export function getWorkshopsHubQuotes(): Testimonial[] {
  const testimonials = getTestimonials();
  return hub.quoteAuthors.map((author) => {
    const quote = testimonials.find((item) => item.author === author);
    if (!quote) {
      throw new Error(`content/pages/workshops-hub.json quoteAuthors: no testimonial by "${author}"`);
    }
    return quote;
  });
}

function formatFullDate(isoDate: string): string {
  return formatDateRange(isoDate, undefined, { withYear: true });
}

/**
 * Card eyebrow with the current enrollment state — same windows as „Najbliższe” on `/` (N6).
 * `facts.enrollmentOpen: true` forces „open”, as in the offer FactsBox (D5).
 */
export function getWorkshopCardEyebrow(
  kind: Offer["kind"],
  workshops: WorkshopOfferFacts,
  today: string,
): string {
  if (kind === "kurs") {
    const strings = pl.workshopsHub.eyebrow.kurs;
    const course = resolveCoursePhase(today, workshops.kurs);

    if (course.phase === "open" || workshops.kurs.enrollmentOpen) {
      return course.phase === "open" && course.enrollmentClose
        ? fill(strings.openWithDeadline, { season: course.season, date: formatFullDate(course.enrollmentClose) })
        : fill(strings.open, { season: course.season });
    }

    return fill(course.phase === "starts" ? strings.starts : strings.running, { season: course.season });
  }

  if (kind === "plener") {
    const strings = pl.workshopsHub.eyebrow.plener;
    const plener = resolvePlenerRegistration(today, workshops);

    if (isWithin(today, plener.window) || workshops.plener.enrollmentOpen) {
      return plener.registrationClose
        ? fill(strings.openWithDeadline, { year: plener.year, date: formatFullDate(plener.registrationClose) })
        : fill(strings.open, { year: plener.year });
    }

    return fill(today < plener.window.start ? strings.before : strings.closed, { year: plener.year });
  }

  throw new Error(`workshops-hub: no card eyebrow for offer kind "${kind}"`);
}
