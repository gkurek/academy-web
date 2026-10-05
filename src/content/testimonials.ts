import testimonialsData from "../../content/testimonials.json";
import type { Testimonial } from "@/content/types";

/** Quotes shown on the workshops hub. */
const WORKSHOP_TESTIMONIALS_LIMIT = 3;

type TestimonialsFile = {
  sample?: boolean;
  items: Testimonial[];
};

export function getWorkshopTestimonials(): Testimonial[] {
  const data = testimonialsData as TestimonialsFile;
  return data.items.filter((item) => item.scope !== "plener").slice(0, WORKSHOP_TESTIMONIALS_LIMIT);
}

export function getPlenerTestimonials(): Testimonial[] {
  const data = testimonialsData as TestimonialsFile;
  return data.items.filter((item) => item.scope === "plener");
}
