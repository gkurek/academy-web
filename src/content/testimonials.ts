import testimonialsData from "../../content/testimonials.json";
import type { Testimonial } from "@/content/types";

type TestimonialsFile = {
  sample?: boolean;
  items: Testimonial[];
};

export function getWorkshopTestimonials(): Testimonial[] {
  const data = testimonialsData as TestimonialsFile;
  return data.items.filter((item) => item.scope !== "plener").slice(0, 3);
}

export function getPlenerTestimonials(): Testimonial[] {
  const data = testimonialsData as TestimonialsFile;
  return data.items.filter((item) => item.scope === "plener");
}
