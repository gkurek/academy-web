/**
 * Generate sample news MDX from WordPress REST API (D-07-05).
 *
 * Usage: npx tsx scripts/generate-news-sample.ts
 *
 * Fetches posts from akademiaikony.pl, applies migration rules from
 * docs/plan-claude-code.md §3 etap 9 and docs/archive/plan-aktualizacji-dokumentow-wydarzenia.md §5:
 * - aktualności + archiwum „Wydarzeń” → wpisy News z `kind`
 * - bez hubu `/wydarzenia`, bez poświęceń (→ Publikacje, K-55)
 * - oprowadzania 2017 (4 wpisy) → jeden wpis scalony
 * - „Podsumowanie roku 2019…” → 3 osobne wpisy (Noc Świątyń, Okno duszy, plener Lipka)
 * - wpis zbiorczy „IKONA – KORZENIE I OWOCE WIARY 2018…2025” → pominięty (editions.json, etap 8)
 *
 * Output: content/news/sample-*.mdx, public/media/sample/news/*
 * Writes scripts/generate-news-report.json with counts and skipped slugs.
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { generateNewsManifest } from "./generate-news-index";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_DIR = join(ROOT, "content/news");
const MEDIA_DIR = join(ROOT, "public/media/sample/news");
const REPORT_PATH = join(ROOT, "scripts/generate-news-report.json");

const WP_POSTS_API = "https://www.akademiaikony.pl/wp-json/wp/v2/posts";
const WP_PER_PAGE = 100;

const WP_CATEGORY = {
  wyklady: 3,
  aktualnosci: 4,
  wydarzenia: 6,
  warsztaty: 7,
  inne: 20,
} as const;

type NewsKind =
  | "aktualnosc"
  | "wyklady"
  | "warsztaty"
  | "plener"
  | "wystawa"
  | "oprowadzanie"
  | "wyjazd"
  | "spotkanie";

type ImageMeta = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

type WpPost = {
  slug: string;
  date: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  categories: number[];
};

type GeneratedEntry = {
  slug: string;
  title: string;
  date: string;
  dateEnd?: string;
  kind: NewsKind;
  excerpt?: string;
  body: string;
  images?: ImageMeta[];
  poster?: ImageMeta;
};

const EXCLUDED_SLUGS = new Set([
  "ikona-korzenie-i-owoce-wiary-2",
  "podsumowanie-2019",
  "ikona-serca-jezusa",
  "ikona-trojcy-swietej",
  "ikony-emaliowane",
]);

const OPROWADZANIA_2017_SLUGS = [
  "ikona-serca-jezusa",
  "ikona-trojcy-swietej",
  "ikony-emaliowane",
] as const;

const downloadedUrls = new Map<string, string>();

const decodeHtml = (value: string): string =>
  value
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8220;/g, "\u201e")
    .replace(/&#8221;/g, "\u201d")
    .replace(/&#8230;/g, "…")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

const slugify = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

const stripCacheUrl = (url: string): string =>
  url.replace(/-\d+x\d+(?=\.\w+$)/, "").replace(/\/cache\//, "/");

const inferWydarzenieKind = (slug: string): NewsKind => {
  if (slug.includes("wyjazd") || slug.includes("wakacyjne-wyjazdy")) {
    return slug.includes("grodek") ? "plener" : "wyjazd";
  }
  if (slug.includes("spotkanie") || slug.includes("spotkania")) {
    return "spotkanie";
  }
  if (slug.includes("oprowadzania")) {
    return "oprowadzanie";
  }
  return "wystawa";
};

const determineKind = (post: WpPost): NewsKind => {
  const categories = post.categories ?? [];
  if (categories.includes(WP_CATEGORY.warsztaty)) {
    return "warsztaty";
  }
  if (categories.includes(WP_CATEGORY.wyklady)) {
    return "wyklady";
  }
  if (categories.includes(WP_CATEGORY.aktualnosci)) {
    return "aktualnosc";
  }
  if (categories.includes(WP_CATEGORY.wydarzenia)) {
    return inferWydarzenieKind(post.slug);
  }
  if (categories.includes(WP_CATEGORY.inne)) {
    return "aktualnosc";
  }
  return "aktualnosc";
};

const fetchAllPosts = async (): Promise<WpPost[]> => {
  const response = await fetch(`${WP_POSTS_API}?per_page=${WP_PER_PAGE}`);
  if (!response.ok) {
    throw new Error(`WP posts API error: ${response.status}`);
  }
  return (await response.json()) as WpPost[];
};

const downloadImage = async (
  sourceUrl: string,
  fileBase: string,
): Promise<string | undefined> => {
  const normalized = stripCacheUrl(sourceUrl);
  const cached = downloadedUrls.get(normalized);
  if (cached) {
    return cached;
  }

  const extension = extname(new URL(normalized).pathname) || ".jpg";
  const filename = `${fileBase}${extension}`;
  const localPath = join(MEDIA_DIR, filename);
  const publicPath = `/media/sample/news/${filename}`;

  if (!existsSync(localPath)) {
    const response = await fetch(normalized);
    if (!response.ok) {
      console.warn(`Skip image ${normalized}: HTTP ${response.status}`);
      return undefined;
    }
    writeFileSync(localPath, Buffer.from(await response.arrayBuffer()));
  }

  downloadedUrls.set(normalized, publicPath);
  return publicPath;
};

const extractImages = async (
  html: string,
  slug: string,
): Promise<ImageMeta[]> => {
  const images: ImageMeta[] = [];
  const pattern =
    /<a[^>]*href="([^"]+\/wp-content\/uploads\/[^"]+)"[^>]*>[\s\S]*?<img[^>]*>/gi;

  let match = pattern.exec(html);
  let index = 0;
  while (match) {
    const href = stripCacheUrl(match[1]);
    const imgTag = match[0];
    const widthMatch = imgTag.match(/width="(\d+)"/i);
    const heightMatch = imgTag.match(/height="(\d+)"/i);
    const altMatch = imgTag.match(/alt="([^"]*)"/i);
    const titleMatch = imgTag.match(/title="([^"]*)"/i);

    const localSrc = await downloadImage(href, `${slugify(slug)}-${index}`);
    if (localSrc) {
      images.push({
        src: localSrc,
        alt: decodeHtml(altMatch?.[1] || titleMatch?.[1] || `[do uzupełnienia: podpis zdjęcia]`),
        width: Number(widthMatch?.[1] ?? 960),
        height: Number(heightMatch?.[1] ?? 640),
        caption: titleMatch ? decodeHtml(titleMatch[1]) : undefined,
      });
      index += 1;
    }
    match = pattern.exec(html);
  }

  return images;
};

const htmlToBody = (html: string): string => {
  let text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<h[1-6][^>]*>/gi, "\n\n## ")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, label) => {
      const cleanLabel = decodeHtml(label);
      return cleanLabel ? `[${cleanLabel}](${href})` : "";
    });

  text = text.replace(/<a[^>]*href="[^"]+\/wp-content\/uploads\/[^"]+"[^>]*>[\s\S]*?<\/a>/gi, "");
  text = text.replace(/<img[^>]*>/gi, "");
  text = text.replace(/#foogallery-gallery[\s\S]*?}\s*}/gi, "");
  text = decodeHtml(text.replace(/<[^>]+>/g, " "));
  text = text.replace(/Ponizej galeria zdjęć z wystawy:[\s\S]*$/i, "").trim();
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line, lineIndex, lines) => line.length > 0 || (lineIndex > 0 && lines[lineIndex - 1].length > 0))
    .join("\n\n")
    .trim();
};

const buildExcerpt = (body: string, wpExcerpt: string): string => {
  const fromWp = decodeHtml(wpExcerpt);
  if (fromWp.length > 40) {
    return fromWp.slice(0, 280);
  }
  const firstParagraph = body.split("\n\n").find((paragraph) => paragraph.length > 40);
  return firstParagraph?.slice(0, 280) ?? body.slice(0, 280);
};

const assignPoster = (images: ImageMeta[]): ImageMeta | undefined => {
  const portrait = images.find((image) => image.height > image.width);
  return portrait ?? images[0];
};

const buildFromPost = async (post: WpPost): Promise<GeneratedEntry> => {
  const images = await extractImages(post.content.rendered, post.slug);
  const body = htmlToBody(post.content.rendered);
  const poster = assignPoster(images);

  return {
    slug: post.slug,
    title: decodeHtml(post.title.rendered),
    date: post.date.slice(0, 10),
    kind: determineKind(post),
    excerpt: buildExcerpt(body, post.excerpt.rendered),
    body,
    images: images.length > 0 ? images : undefined,
    poster,
  };
};

const extractPodsumowanie2019Entries = async (
  post: WpPost,
): Promise<GeneratedEntry[]> => {
  const html = post.content.rendered;

  const nocMatch = html.match(
    /Dnia 21 września[\s\S]*?(?=Dnia \d|<strong>5 października|$)/i,
  );
  const oknoMatch = html.match(
    /5 października[\s\S]*?26 października[\s\S]*?(?=<strong>1 listopada|$)/i,
  );
  const lipkaMatch = html.match(
    /3 sierpnia[\s\S]*?10 sierpnia[\s\S]*?Świętej Lipce[\s\S]*?(?=<strong>W dniach|<strong>1 września|$)/i,
  );

  const buildSplit = async (
    slug: string,
    title: string,
    date: string,
    kind: NewsKind,
    fragment: string | undefined,
  ): Promise<GeneratedEntry | undefined> => {
    if (!fragment) {
      return undefined;
    }
    const images = await extractImages(fragment, slug);
    const body = htmlToBody(fragment);
    return {
      slug,
      title,
      date,
      dateEnd: kind === "plener" ? "2019-08-10" : undefined,
      kind,
      excerpt: buildExcerpt(body, ""),
      body,
      images: images.length > 0 ? images : undefined,
      poster: assignPoster(images),
    };
  };

  const entries = await Promise.all([
    buildSplit(
      "noc-swiatyn-2019",
      "Noc Świątyń 2019",
      "2019-09-21",
      "wystawa",
      nocMatch?.[0],
    ),
    buildSplit(
      "ikona-okno-duszy-2019",
      "Wystawa „Ikona okno duszy”",
      "2019-10-05",
      "wystawa",
      oknoMatch?.[0],
    ),
    buildSplit(
      "plener-swietej-lipki-2019",
      "Warsztaty i wystawa w Świętej Lipce",
      "2019-08-03",
      "plener",
      lipkaMatch?.[0],
    ),
  ]);

  return entries.filter((entry): entry is GeneratedEntry => entry !== undefined);
};

const buildOprowadzania2017Entry = async (
  posts: WpPost[],
): Promise<GeneratedEntry> => {
  const ordered = OPROWADZANIA_2017_SLUGS
    .map((slug) => posts.find((post) => post.slug === slug))
    .filter((post): post is WpPost => post !== undefined);

  const sections = await Promise.all(
    ordered.map(async (post) => {
      const images = await extractImages(post.content.rendered, post.slug);
      let body = htmlToBody(post.content.rendered);

      if (post.slug === "ikona-serca-jezusa") {
        const trimmed = body.split("Biblia wspomina")[0]?.trim();
        body = trimmed && trimmed.length > 40
          ? trimmed
          : "Oprowadzanie kuratorskie po ikonie Serca Jezusa na wystawie w Kościele Środowisk Twórczych.";
      }

      if (post.slug === "ikony-emaliowane") {
        body = body.replace(/Dzieciom się to podobało[\s\S]*$/i, "").trim();
      }

      return {
        title: decodeHtml(post.title.rendered),
        body,
        images,
      };
    }),
  );

  const images = sections
    .flatMap((section) => section.images)
    .slice(0, 4);

  const body = sections
    .map((section) => `### ${section.title}\n\n${section.body}`)
    .join("\n\n");

  return {
    slug: "oprowadzania-po-wystawie-2017",
    title: "Oprowadzania po wystawie: Serce Jezusa, Trójca Święta, ikony emaliowane",
    date: "2017-06-25",
    kind: "oprowadzanie",
    excerpt:
      "Tematyczne oprowadzania kuratorskie po wystawie „Ikona – korzenie i owoce wiary” w 2017 roku.",
    body,
    images: images.length > 0 ? images : undefined,
    poster: assignPoster(images),
  };
};

const buildNabor2026Entry = (): GeneratedEntry => ({
  slug: "nabor-kursu-2026-2027",
  title: "Nabór na kurs roczny i trzyletni 2026/2027",
  date: "2026-09-01",
  kind: "warsztaty",
  excerpt:
    "Rusza nabór na kurs roczny i trzyletni w sezonie 2026/2027. Zgłoszenia przyjmujemy mailem do 24 września 2026.",
  body: `Zapraszamy do zapisów na kurs roczny i trzyletni w Akademii Ikony. Zajęcia odbywają się raz w tygodniu, od października do czerwca, w grupach wieczornych i dziennych — w Kościele Środowisk Twórczych na Placu Teatralnym w Warszawie.

<NewsCta href="/warsztaty/kurs-roczny-i-trzyletni" label="Jak się zapisać na kurs" />`,
});

const serializeFrontmatter = (entry: GeneratedEntry): string => {
  const payload: Record<string, unknown> = {
    slug: entry.slug,
    title: entry.title,
    date: entry.date,
    kind: entry.kind,
    sample: true,
  };

  if (entry.dateEnd) {
    payload.dateEnd = entry.dateEnd;
  }
  if (entry.excerpt) {
    payload.excerpt = entry.excerpt;
  }
  if (entry.images?.length) {
    payload.images = entry.images;
  }
  if (entry.poster) {
    payload.poster = entry.poster;
  }

  return `export const frontmatter = ${JSON.stringify(payload, null, 2)};\n\n`;
};

const writeMdx = (entry: GeneratedEntry): void => {
  const filename = join(NEWS_DIR, `sample-${entry.slug}.mdx`);
  const content = `${serializeFrontmatter(entry)}${entry.body}\n`;
  writeFileSync(filename, content, "utf8");
};

const clearGeneratedFiles = (): void => {
  if (existsSync(NEWS_DIR)) {
    readdirSync(NEWS_DIR)
      .filter((name) => name.startsWith("sample-") && name.endsWith(".mdx"))
      .forEach((name) => rmSync(join(NEWS_DIR, name)));
  }
  if (existsSync(MEDIA_DIR)) {
    rmSync(MEDIA_DIR, { recursive: true, force: true });
  }
  mkdirSync(MEDIA_DIR, { recursive: true });
  mkdirSync(NEWS_DIR, { recursive: true });
};

const main = async (): Promise<void> => {
  console.log("Fetching WordPress posts…");
  const posts = await fetchAllPosts();
  console.log(`Fetched ${posts.length} posts.`);

  clearGeneratedFiles();

  const generated: GeneratedEntry[] = [];
  const skipped: string[] = [];
  const kindCounts: Record<string, number> = {};

  const podsumowanie = posts.find((post) => post.slug === "podsumowanie-2019");
  if (podsumowanie) {
    const splits = await extractPodsumowanie2019Entries(podsumowanie);
    generated.push(...splits);
    console.log(`Split podsumowanie-2019 → ${splits.length} entries.`);
  }

  const oprowadzania = await buildOprowadzania2017Entry(posts);
  generated.push(oprowadzania);
  console.log("Merged oprowadzania 2017 → 1 entry.");

  generated.push(buildNabor2026Entry());

  await posts.reduce<Promise<void>>(async (chain, post) => {
    await chain;
    if (EXCLUDED_SLUGS.has(post.slug)) {
      skipped.push(post.slug);
      return;
    }
    if (generated.some((entry) => entry.slug === post.slug)) {
      return;
    }
    generated.push(await buildFromPost(post));
  }, Promise.resolve());

  generated
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .forEach((entry) => {
      writeMdx(entry);
      kindCounts[entry.kind] = (kindCounts[entry.kind] ?? 0) + 1;
    });

  const report = {
    generatedAt: new Date().toISOString(),
    total: generated.length,
    kindCounts,
    skipped,
    slugs: generated.map((entry) => entry.slug),
  };

  writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  const manifestCount = generateNewsManifest();

  console.log(`Wrote ${generated.length} MDX files to content/news/`);
  console.log(`Wrote ${manifestCount} entries to content/news/manifest.json`);
  console.log("Kind counts:", kindCounts);
  console.log(`Report: ${REPORT_PATH}`);
};

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
