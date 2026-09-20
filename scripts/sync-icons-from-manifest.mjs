import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST_PATH = join(ROOT, "scripts/wp-gallery-manifest.json");
const ICONS_PATH = join(ROOT, "content/icons.json");

const ICON_THEMES = [
  "chrystus",
  "matka-bozy",
  "aniolowie",
  "swieci",
  "sceny-i-swieta",
];

const MANUAL_TAGS = {
  "do-uzupelnienia-tytul-ikony": "chrystus",
};

const normalizeTitle = (title) =>
  title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ł/g, "l");

const inferTag = (title, slug) => {
  if (MANUAL_TAGS[slug]) {
    return MANUAL_TAGS[slug];
  }

  const value = normalizeTitle(title);

  if (/archaniol/.test(value)) return "aniolowie";
  if (
    /matka boza|madonna|eleusa|krzew gorej|sniezna|niepokalana|advokata|pneumatofora|koptyjska|pompejanska|nieustaj|stolica madrosci/.test(
      value,
    )
  ) {
    return "matka-bozy";
  }
  if (
    /boze narodzenie|ukrzyzowanie|trojca|zstapienie|przemienienie|nie oplakuj/.test(
      value,
    )
  ) {
    return "sceny-i-swieta";
  }
  if (
    /chrystus|mandylion|madylion|jezus|emmanuel|pantokrator|milosierny|eucharyst/.test(
      value,
    )
  ) {
    return "chrystus";
  }
  if (/swiety/.test(value)) return "swieci";

  throw new Error(`Cannot infer tag for "${title}" (${slug})`);
};

const loadExistingIcons = () => {
  if (!existsSync(ICONS_PATH)) return [];
  return JSON.parse(readFileSync(ICONS_PATH, "utf8"));
};

const manifestToIconWork = (entry, existingBySlug) => {
  const preserved = existingBySlug.get(entry.slug);
  const tag = preserved?.tags?.[0] ?? inferTag(entry.title, entry.slug);
  const authorName =
    entry.author === "ejk"
      ? "Elżbieta Jackowska-Kurek"
      : preserved?.authorName ?? entry.authorName ?? undefined;

  const icon = {
    slug: entry.slug,
    title: entry.title,
    author: entry.author,
    image: {
      src: entry.localPath,
      alt: `Ikona: ${entry.title}`,
      width: entry.image.width,
      height: entry.image.height,
    },
    tags: [tag],
    sample: true,
  };

  if (entry.size) {
    icon.size = entry.size;
  }

  if (authorName) {
    icon.authorName = authorName;
  }

  return icon;
};

const validateTaxonomy = (icons) => {
  const untagged = icons.filter((icon) => !icon.tags || icon.tags.length === 0);
  const unknown = icons.flatMap((icon) =>
    (icon.tags ?? [])
      .filter((tag) => !ICON_THEMES.includes(tag))
      .map((tag) => `${icon.slug} → ${tag}`),
  );
  const emptyThemes = ICON_THEMES.filter(
    (theme) => !icons.some((icon) => icon.tags?.includes(theme)),
  );

  const problems = [
    untagged.length > 0
      ? `works without tags: ${untagged.map((icon) => icon.slug).join(", ")}`
      : null,
    unknown.length > 0 ? `tags outside the taxonomy: ${unknown.join(", ")}` : null,
    emptyThemes.length > 0 ? `themes without works: ${emptyThemes.join(", ")}` : null,
  ].filter(Boolean);

  if (problems.length > 0) {
    throw new Error(
      `content/icons.json does not match the theme taxonomy — ${problems.join("; ")}`,
    );
  }
};

const main = () => {
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
  const existingIcons = loadExistingIcons();
  const existingBySlug = new Map(existingIcons.map((icon) => [icon.slug, icon]));

  const icons = manifest.map((entry) => manifestToIconWork(entry, existingBySlug));

  validateTaxonomy(icons);

  writeFileSync(ICONS_PATH, `${JSON.stringify(icons, null, 2)}\n`, "utf8");

  const summary = {
    total: icons.length,
    ejk: icons.filter((icon) => icon.author === "ejk").length,
    students: icons.filter((icon) => icon.author === "student").length,
    themes: Object.fromEntries(
      ICON_THEMES.map((theme) => [
        theme,
        icons.filter((icon) => icon.tags?.includes(theme)).length,
      ]),
    ),
    iconsPath: ICONS_PATH,
  };

  console.log(JSON.stringify(summary, null, 2));
};

main();
