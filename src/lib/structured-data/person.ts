import type { PersonProfileData } from "@/content/types";
import { absoluteUrl, CONTEXT, organizationRef, type JsonLdNode } from "@/lib/structured-data/site";

/** EJK's profile lives on `/o-akademii` — the only `Person` node on the site (K-157). */
export const FOUNDER_PATH = "/o-akademii";
export const FOUNDER_ID = `${absoluteUrl(FOUNDER_PATH)}#elzbieta-jackowska-kurek`;

export function founderNode(profile: PersonProfileData): JsonLdNode {
  return {
    "@context": CONTEXT,
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: profile.name,
    jobTitle: profile.role,
    description: profile.bio[0],
    image: absoluteUrl(profile.portrait.src),
    url: absoluteUrl(FOUNDER_PATH),
    worksFor: organizationRef(),
  };
}
