import type { Offer } from "@/content/types";

/**
 * Click events for analytics (K-15). Links carry them as `data-event` plus `data-event-*`
 * parameters; no tracking script runs yet — stage 11 adds one delegated click listener that
 * reads these attributes and forwards them to the chosen tool (K-07).
 *
 * - `enroll_click` — enrollment CTA (FactsBox, offer side/closing CTA); `data-event-offer`
 *   = offer kind, `data-event-state` = enrollment state shown on the button.
 * - `email_click` — any other `mailto:` link.
 * - `phone_click` — any `tel:` link.
 */
export type ClickEvent = "enroll_click" | "email_click" | "phone_click";

export type EventAttributes = { "data-event"?: ClickEvent } & { [param: `data-event-${string}`]: string };

export function enrollEvent(offer: Offer["kind"], state: string): EventAttributes {
  return { "data-event": "enroll_click", "data-event-offer": offer, "data-event-state": state };
}

/** Default event of a plain link — derived from its scheme, so no `mailto:` / `tel:` goes untracked. */
export function linkEvent(href: string): EventAttributes {
  if (href.startsWith("mailto:")) {
    return { "data-event": "email_click" };
  }
  if (href.startsWith("tel:")) {
    return { "data-event": "phone_click" };
  }
  return {};
}
