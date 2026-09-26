import type { MigrateDomain, MigrateOptions } from "../cli";
import { MigrateReport } from "../report";

export const runStubDomain = async (
  domain: MigrateDomain,
  options: MigrateOptions,
): Promise<void> => {
  const report = new MigrateReport(`Kawałek — ${domain} (stub)`);
  report.warn(
    `Domain "${domain}" not implemented yet; run the matching chunk from docs/plans/09-migration.md`,
  );
  if (options.dryRun) {
    report.log("[dry-run] no files written");
  }
  report.flush();
};
