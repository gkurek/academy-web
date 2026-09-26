/**
 * WordPress → content/ migration (REST API primary, WXR reserve — K-121).
 *
 * Usage:
 *   npx tsx scripts/migrate-wp.ts --dry-run --only=static
 *   npm run migrate:wp -- --only=static
 *
 * Flags: --dry-run, --only=<domain>, --force (K-122).
 */

import { parseMigrateCli, resolveDomains, type MigrateDomain } from "./migrate-wp/cli";
import { runStaticDomain } from "./migrate-wp/domains/static";
import { runStubDomain } from "./migrate-wp/domains/stub";
import { probeWpRest } from "./migrate-wp/wp-client";

const runDomain = async (domain: MigrateDomain, options: ReturnType<typeof parseMigrateCli>) => {
  if (domain === "static") {
    await runStaticDomain(options);
    return;
  }
  await runStubDomain(domain, options);
};

const main = async () => {
  const options = parseMigrateCli(process.argv.slice(2));
  const domains = resolveDomains(options.only);

  const restOk = await probeWpRest();
  if (!restOk) {
    throw new Error("WordPress REST API unreachable (brief §5 step 1). WXR fallback not implemented.");
  }

  console.log(
    `migrate-wp: domains=[${domains.join(", ")}] dryRun=${options.dryRun} force=${options.force}`,
  );

  await domains.reduce<Promise<void>>(async (chain, domain) => {
    await chain;
    await runDomain(domain, options);
  }, Promise.resolve());
};

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
