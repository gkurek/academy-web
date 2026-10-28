import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Read-only cache: prerendered pages are served from Workers static assets instead of being rendered
// per request (Free plan CPU limit). Content changes only by commit; date-dependent pages (`/`, news,
// enrollment, exhibitions, sitemap) are refreshed by the daily rebuild (K-159), so no ISR / `revalidate`.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
