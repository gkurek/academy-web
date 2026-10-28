import type { Offer } from "@/content/types";

/**
 * Click events for analytics (K-15). Links carry them as `data-event` plus `data-event-*`
 * parameters; one delegated click listener (`listenForClickEvents`, started from
 * `instrumentation-client.ts`) reads these attributes and forwards them to PostHog (K-07).
 *
 * - `enroll_click` — enrollment CTA (FactsBox, offer side/closing CTA); `data-event-offer`
 *   = offer kind, `data-event-state` = enrollment state shown on the button.
 * - `email_click` — any other `mailto:` link.
 * - `phone_click` — any `tel:` link.
 */
type ClickEvent = "enroll_click" | "email_click" | "phone_click";

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

const EVENT_PARAM_PREFIX = "data-event-";

/**
 * Delegated listener for every `data-event` click on the page. Capture phase, so a handler that
 * stops propagation (e.g. a lightbox) cannot hide a tracked link. Parameters are sent without the
 * prefix: `data-event-offer="kurs"` → `{ offer: "kurs" }`.
 */
export function listenForClickEvents(capture: (event: ClickEvent, properties: Record<string, string>) => void) {
  document.addEventListener(
    "click",
    (click) => {
      const target = click.target instanceof Element ? click.target.closest("[data-event]") : null;
      const event = target?.getAttribute("data-event") as ClickEvent | null | undefined;
      if (!target || !event) {
        return;
      }
      const properties = Array.from(target.attributes)
        .filter((attribute) => attribute.name.startsWith(EVENT_PARAM_PREFIX))
        .reduce<Record<string, string>>(
          (params, attribute) => ({ ...params, [attribute.name.slice(EVENT_PARAM_PREFIX.length)]: attribute.value }),
          {},
        );
      capture(event, properties);
    },
    { capture: true },
  );
}
