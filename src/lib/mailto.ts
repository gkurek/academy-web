import type { EnrollmentState } from "@/content/enrollment";
import type { OfferFacts } from "@/content/types";
import { pl } from "@/i18n/pl";

/** Build a mailto: href with an encoded subject line (brief §7). */
export function buildMailtoHref(email: string, subject: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

/** Enrollment mailto of an offer; a CTA state may override the subject (e.g. course notify when closed). */
export function getEnrollmentMailtoHref(
  facts: OfferFacts,
  kind: keyof typeof pl.factsBox.ctaByKind,
  enrollment: EnrollmentState,
): string {
  const cta = pl.factsBox.ctaByKind[kind][enrollment];
  const subject = "mailtoSubject" in cta ? cta.mailtoSubject : facts.enrollmentSubject;
  return buildMailtoHref(facts.enrollmentEmail, subject);
}
