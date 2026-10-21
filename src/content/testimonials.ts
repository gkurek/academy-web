import { nbspDeep } from "@/lib/typography";
import testimonialsData from "../../content/testimonials.json";
import type { Testimonial } from "@/content/types";

type TestimonialsFile = {
  sample?: boolean;
  items: Testimonial[];
};

/** All quotes — the workshops hub picks one by author (`workshops-hub.json`). */
export function getTestimonials(): Testimonial[] {
  return nbspDeep(testimonialsData as TestimonialsFile).items;
}

export function getPlenerTestimonials(): Testimonial[] {
  const data = nbspDeep(testimonialsData as TestimonialsFile);
  return data.items.filter((item) => item.scope === "plener");
}
