import { listenForClickEvents } from "@/lib/analytics";

/**
 * PostHog analytics (K-07, 11c). Cookieless: nothing is stored in the browser, the visitor hash is
 * computed on PostHog's servers. Both variables are inlined at build time — without them (local
 * builds) the SDK is never loaded and nothing is sent.
 */
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

/** Load the SDK only after `load` and once the browser is idle, so it stays out of LCP (D1). */
function whenIdleAfterLoad(callback: () => void) {
  // Safari has no requestIdleCallback.
  const schedule = () =>
    typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(callback) : window.setTimeout(callback, 1);
  if (document.readyState === "complete") {
    schedule();
  } else {
    window.addEventListener("load", schedule, { once: true });
  }
}

async function startAnalytics(apiKey: string, apiHost: string) {
  const { default: posthog } = await import("posthog-js");
  posthog.init(apiKey, {
    api_host: apiHost,
    cookieless_mode: "always",
    persistence: "memory",
    person_profiles: "never",
    // Initial pageview plus one per client-side navigation.
    capture_pageview: "history_change",
    autocapture: false,
    rageclick: false,
    capture_dead_clicks: false,
    capture_heatmaps: false,
    capture_exceptions: false,
    capture_performance: false,
    disable_session_recording: true,
    disable_surveys: true,
    disable_product_tours: true,
    disable_conversations: true,
    disable_web_experiments: true,
    advanced_disable_flags: true,
    disable_external_dependency_loading: true,
  });
  listenForClickEvents((event, properties) => posthog.capture(event, properties));
}

if (key && host) {
  whenIdleAfterLoad(() => void startAnalytics(key, host));
}
