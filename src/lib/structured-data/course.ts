import { absoluteUrl, CONTEXT, organizationRef, venuePlace, type JsonLdNode } from "@/lib/structured-data/site";

export type CourseNodeInput = {
  name: string;
  description: string;
  path: string;
  /** The course meets in the church; the plener moves between places, so it has none. */
  atVenue: boolean;
};

/** `Course` for the workshop offers — no price, as on the pages (K-157). */
export function courseNode({ name, description, path, atVenue }: CourseNodeInput): JsonLdNode {
  return {
    "@context": CONTEXT,
    "@type": "Course",
    name,
    description,
    url: absoluteUrl(path),
    inLanguage: "pl",
    provider: organizationRef(),
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Onsite",
      ...(atVenue ? { location: venuePlace() } : {}),
    },
  };
}
