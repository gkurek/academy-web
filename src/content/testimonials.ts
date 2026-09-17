import testimonialsData from "../../content/testimonials.json";
import type { Testimonial } from "@/content/types";

type TestimonialsFile = {
  sample: boolean;
  items: Testimonial[];
};

const PLENER_QUOTE_AUTHORS = ["Emilia", "Robert", "Maciej", "Artur"] as const;

export function getWorkshopTestimonials(): Testimonial[] {
  const data = testimonialsData as TestimonialsFile;
  return data.items.slice(0, 3);
}

export function getPlenerTestimonials(): Testimonial[] {
  const data = testimonialsData as TestimonialsFile;
  return PLENER_QUOTE_AUTHORS
    .map((author) => data.items.find((item) => item.author === author))
    .filter((item): item is Testimonial => item !== undefined);
}
