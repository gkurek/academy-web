export type MigrateDomain =
  | "static"
  | "offers"
  | "lectures"
  | "news"
  | "gallery"
  | "publications"
  | "finalize";

export type MigrateOptions = {
  dryRun: boolean;
  force: boolean;
  only: MigrateDomain | "all";
};

const DOMAIN_VALUES: MigrateDomain[] = [
  "static",
  "offers",
  "lectures",
  "news",
  "gallery",
  "publications",
  "finalize",
];

const parseOnly = (value: string): MigrateDomain | "all" => {
  if (value === "all") {
    return "all";
  }
  if (DOMAIN_VALUES.includes(value as MigrateDomain)) {
    return value as MigrateDomain;
  }
  throw new Error(
    `Unknown --only value "${value}". Expected: ${DOMAIN_VALUES.join(", ")}, or all.`,
  );
};

export const parseMigrateCli = (argv: string[]): MigrateOptions => {
  let dryRun = false;
  let force = false;
  let only: MigrateDomain | "all" = "all";

  argv.forEach((arg) => {
    if (arg === "--dry-run") {
      dryRun = true;
      return;
    }
    if (arg === "--force") {
      force = true;
      return;
    }
    if (arg.startsWith("--only=")) {
      only = parseOnly(arg.slice("--only=".length));
      return;
    }
    throw new Error(`Unknown argument: ${arg}`);
  });

  return { dryRun, force, only };
};

export const resolveDomains = (only: MigrateDomain | "all"): MigrateDomain[] =>
  only === "all" ? DOMAIN_VALUES : [only];
