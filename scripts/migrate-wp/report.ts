import { appendFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
export const REPORT_PATH = join(ROOT, "scripts/migrate-report.md");

export type ReportLine = string;

export class MigrateReport {
  private readonly lines: ReportLine[] = [];

  constructor(private readonly chunkLabel: string) {}

  log(line: ReportLine): void {
    this.lines.push(line);
    console.log(line);
  }

  warn(line: ReportLine): void {
    this.lines.push(`- ⚠️ ${line}`);
    console.warn(line);
  }

  flush(): void {
    if (this.lines.length === 0) {
      return;
    }

    const header = `\n## ${this.chunkLabel} — ${new Date().toISOString().slice(0, 10)}\n\n`;
    const body = this.lines.map((line) => (line.startsWith("-") ? line : `- ${line}`)).join("\n");
    const block = `${header}${body}\n`;

    if (!existsSync(REPORT_PATH)) {
      writeFileSync(
        REPORT_PATH,
        "# WordPress migration report\n\nLog per chunk (`docs/plans/09-migration.md`).\n\n## EJK — otwarte\n\n_(pozycje dopisywane w kolejnych kawałkach)_\n",
        "utf8",
      );
    }

    appendFileSync(REPORT_PATH, block, "utf8");
  }
}
