import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import type { MigrateOptions } from "../cli";
import {
  contentFingerprint,
  downloadOriginalImage,
  extractLinkedUploadUrls,
  extractMapEmbedUrl,
} from "../html";
import { MigrateReport } from "../report";
import { fetchWpPageBySlug, type WpPage } from "../wp-client";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const PAGES_DIR = join(ROOT, "content/pages");
const SETTINGS_PATH = join(ROOT, "content/settings.json");

const ABOUT_WP_SLUG =
  "celem-dzialalnosci-akademii-ikony-studium-ikonograficznego-sw-andrzeja-apostola-jest-ksztalcenie-ale-i-pomoc-w-doswiadczaniu-ikony";

const STATIC_TARGETS = [
  { route: "o-akademii", wpSlug: ABOUT_WP_SLUG, structured: true },
  { route: "pracownia", wpSlug: "pracownia", structured: true },
  { route: "kontakt", wpSlug: "kontakt", structured: false },
  { route: "polityka-prywatnosci", wpSlug: "polityka-prywatnosci", structured: false },
] as const;

type SiteSettings = {
  orgName: string;
  place: string;
  address: string;
  emails: { label: string; address: string; contactName?: string }[];
  phone: string;
  mapEmbedUrl: string;
  blogUrl: string;
  ecosystem: {
    foundationUrl: string;
    personalSiteUrl?: string;
    social: { facebook: string; youtube: string };
  };
  upcoming: unknown[];
};

type PrivacyPolicyPageData = {
  slug: string;
  title: string;
  lead: string;
  lastUpdated: string;
  contactEmail: string;
  toc: { id: string; label: string }[];
  sections: {
    id: string;
    paragraphs: string[];
    list?: string[];
    paragraphsAfterList?: string[];
  }[];
};

const readJson = <T>(path: string): T => JSON.parse(readFileSync(path, "utf8")) as T;

const updateSettingsFromKontakt = (
  settings: SiteSettings,
  wp: WpPage,
  report: MigrateReport,
): SiteSettings => {
  const mapEmbedUrl = extractMapEmbedUrl(wp.content.rendered);
  const next = { ...settings };

  if (mapEmbedUrl && mapEmbedUrl !== settings.mapEmbedUrl) {
    report.log(`settings.mapEmbedUrl: update from WP kontakt (${contentFingerprint(mapEmbedUrl)})`);
    next.mapEmbedUrl = mapEmbedUrl;
  }

  return next;
};

const downloadStaticImages = async (
  route: string,
  wp: WpPage,
  options: MigrateOptions,
  report: MigrateReport,
): Promise<number> => {
  const urls = extractLinkedUploadUrls(wp.content.rendered);
  const mediaRoot = join(ROOT, "public/media/import/static", route);
  const publicPrefix = `/media/import/static/${route}`;

  const results = await Promise.all(
    urls.map((url, index) =>
      downloadOriginalImage(
        {
          sourceUrl: url,
          fileBase: `${route}-${index}`,
          mediaRoot,
          publicPrefix,
        },
        options.dryRun,
      ),
    ),
  );

  const downloaded = results.filter((value) => value !== undefined).length;
  if (urls.length > 0) {
    report.log(`${route}: ${urls.length} linked upload(s), ${downloaded} ready (${options.dryRun ? "dry-run" : "disk"})`);
  }
  return downloaded;
};

export const runStaticDomain = async (options: MigrateOptions): Promise<void> => {
  const report = new MigrateReport("Kawałek 1 — static");

  const pages = await Promise.all(
    STATIC_TARGETS.map(async (target) => {
      const page = await fetchWpPageBySlug(target.wpSlug);
      return { target, page };
    }),
  );

  const missing = pages.filter((entry) => !entry.page);
  if (missing.length > 0) {
    missing.forEach((entry) => {
      report.warn(`WP page not found for slug "${entry.target.wpSlug}" (${entry.target.route})`);
    });
    throw new Error("Static migration aborted: missing WP pages.");
  }

  pages.forEach(({ target, page }) => {
    if (!page) {
      return;
    }
    report.log(
      `${target.route}: WP slug "${target.wpSlug}", modified ${page.modified.slice(0, 10)}, html ${page.content.rendered.length} chars`,
    );
  });

  const kontaktEntry = pages.find((entry) => entry.target.route === "kontakt")!;
  const privacyEntry = pages.find((entry) => entry.target.route === "polityka-prywatnosci")!;
  const kontaktWp = kontaktEntry.page!;
  const privacyWp = privacyEntry.page!;

  report.log(
    "kontakt.mdx: skip WP overwrite (editorial copy on site; kontakt WP used only for settings/map check)",
  );

  const settings = readJson<SiteSettings>(SETTINGS_PATH);
  const nextSettings = updateSettingsFromKontakt(settings, kontaktWp, report);
  if (JSON.stringify(nextSettings) !== JSON.stringify(settings)) {
    if (options.dryRun) {
      report.log("[dry-run] would update content/settings.json from WP kontakt");
    } else if (!existsSync(SETTINGS_PATH) || options.force) {
      writeFileSync(SETTINGS_PATH, `${JSON.stringify(nextSettings, null, 2)}\n`, "utf8");
      report.log("wrote content/settings.json");
    } else {
      report.warn("skip content/settings.json (exists, use --force after manual edit)");
    }
  } else {
    report.log("settings.json: no WP-driven changes");
  }

  const privacyPath = join(PAGES_DIR, "polityka-prywatnosci.json");
  const existingPrivacy = readJson<PrivacyPolicyPageData>(privacyPath);
  const wpUpdated = privacyWp.modified.slice(0, 10);
  if (wpUpdated !== existingPrivacy.lastUpdated) {
    report.warn(
      `polityka-prywatnosci.json: WP modified ${wpUpdated} vs repo lastUpdated ${existingPrivacy.lastUpdated} — manual legal review, no auto-overwrite`,
    );
  } else {
    report.log("polityka-prywatnosci.json: skip WP overwrite (curated legal copy; dates match)");
  }

  await Promise.all(
    pages
      .filter((entry) => entry.target.structured)
      .map(async (entry) => {
        if (!entry.page) {
          return;
        }
        report.log(
          `${entry.target.route}: structured JSON/MDX unchanged (etap 6); WP HTML kept for gate review`,
        );
        await downloadStaticImages(entry.target.route, entry.page, options, report);
      }),
  );

  report.log(
    "sample flags on o-akademii.json / pracownia.json: left unchanged until gate (plan kawałek 1)",
  );

  report.flush();
};
