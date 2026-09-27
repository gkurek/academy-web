import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import type { MigrateOptions } from "../cli";
import { parseLectureSeasonFromWp, seasonSlugFromWpSlug } from "../parse-lecture-season";
import { MigrateReport } from "../report";
import { fetchWykladyPosts } from "../wp-client";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const LECTURES_DIR = join(ROOT, "content/lectures");

/** Seasons already curated in repo — skip WP fetch (kawałek 2 gate). */
const SKIP_SEASON_SLUGS = new Set(["2024-2025", "2025-2026", "2026-2027"]);

const seasonFilePath = (seasonSlug: string): string => join(LECTURES_DIR, `${seasonSlug}.json`);

export const runLecturesDomain = async (options: MigrateOptions): Promise<void> => {
  const report = new MigrateReport("Kawałek 2 v2 — lectures");

  const posts = await fetchWykladyPosts();
  report.log(`Fetched ${posts.length} WP posts in category wyklady`);

  await posts.reduce<Promise<void>>(async (chain, post) => {
    await chain;

    const seasonSlug = seasonSlugFromWpSlug(post.slug);
    if (!seasonSlug) {
      report.warn(`No season slug for WP post "${post.slug}" — skipped`);
      return;
    }

    if (SKIP_SEASON_SLUGS.has(seasonSlug)) {
      report.log(`Skip ${seasonSlug} (already in repo)`);
      return;
    }

    const targetPath = seasonFilePath(seasonSlug);
    if (existsSync(targetPath) && !options.force) {
      report.log(`Skip ${seasonSlug} — ${targetPath} exists (use --force to overwrite)`);
      return;
    }

    const parsed = parseLectureSeasonFromWp(
      seasonSlug,
      post.title.rendered,
      post.content.rendered,
    );

    parsed.lectures.forEach((lecture) => {
      lecture.unresolvedLecturers?.forEach((name) => {
        report.warn(
          `${seasonSlug} ${lecture.date}: unresolved lecturer "${name}" (EJK / gate)`,
        );
      });
    });

    if (parsed.lectures.length === 0) {
      report.warn(`${seasonSlug}: no lectures parsed from ${post.link} — EJK`);
    }

    const output = {
      sample: true,
      slug: parsed.slug,
      label: parsed.label,
      cycleTitle: parsed.cycleTitle,
      ...(parsed.intro ? { intro: parsed.intro } : {}),
      lectures: parsed.lectures.map(({ date, title, lecturerSlugs, note }) => ({
        date,
        title,
        lecturerSlugs,
        ...(note ? { note } : {}),
      })),
    };

    report.log(
      `${seasonSlug}: ${parsed.lectures.length} lectures from ${post.slug} → content/lectures/${seasonSlug}.json`,
    );

    if (options.dryRun) {
      report.log(`[dry-run] would write ${targetPath}`);
      return;
    }

    writeFileSync(targetPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  }, Promise.resolve());

  if (options.dryRun) {
    report.log("[dry-run] no files written");
  }

  report.flush();
};
