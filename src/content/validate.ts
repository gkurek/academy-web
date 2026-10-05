/**
 * Import-time checks shared by the content loaders. Each helper throws, so broken content
 * fails `next build` with a message naming the file and field instead of rendering a 404 or blank.
 */
import newsManifest from "../../content/news/manifest.json";
import { FEATURED_ICON_SLUGS, getIconWorks } from "@/content/icons";

const newsSlugs = new Set((newsManifest as Array<{ slug: string }>).map((entry) => entry.slug));
const iconSlugs = new Set(getIconWorks().map((icon) => icon.slug));

/** Named MDX exports (`export const aboutParagraphs = …`) must all be present — returns the module typed. */
export function assertMdxExports<T extends object>(
  mdxModule: unknown,
  keys: readonly (keyof T & string)[],
  context: string,
): T {
  const exports = mdxModule as Record<string, unknown>;
  const missing = keys.filter((key) => exports[key] === undefined);

  if (missing.length > 0) {
    throw new Error(`${context}: missing MDX export(s) ${missing.join(", ")}`);
  }

  return mdxModule as T;
}

/** A link to `/aktualnosci/{slug}` must point at an entry in `content/news/manifest.json`. */
export function assertNewsSlug(slug: string, context: string): void {
  if (!newsSlugs.has(slug)) {
    throw new Error(`${context}: unknown newsSlug "${slug}" — no entry in content/news/manifest.json`);
  }
}

/** A curated icon slug must exist in `content/icons.json`. */
export function assertIconSlug(slug: string, context: string): void {
  if (!iconSlugs.has(slug)) {
    throw new Error(`${context}: unknown icon slug "${slug}" — no work in content/icons.json`);
  }
}

/**
 * Lecture titles joined with " · " pair with `lecturerSlugs` by index. Allowed: no slugs,
 * exactly one slug (shared by every title), or one slug per title (`""` = no lecturer).
 */
export function assertLecturerPairing(titles: string[], slugs: string[], context: string): void {
  if (slugs.length > 1 && slugs.length !== titles.length) {
    throw new Error(
      `${context}: ${slugs.length} lecturerSlugs for ${titles.length} title(s) — expected 0, 1 or ${titles.length}`,
    );
  }
}

// A missing featured slug would silently shrink the home gallery (R1-14). Checked here rather than
// in icons.ts: client components import icons.ts and must not pull the news manifest into the bundle.
FEATURED_ICON_SLUGS.forEach((slug) => assertIconSlug(slug, "src/content/icons.ts FEATURED_ICON_SLUGS"));
