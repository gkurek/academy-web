import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No incremental cache: content changes only by commit, the date by a daily rebuild (K-159, no ISR).
export default defineCloudflareConfig({});
