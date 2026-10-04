/**
 * One-off: fetch WP /publikacje/plakaty/, download gallery images, write news MDX.
 * Usage: npx tsx scripts/sync-plakaty-news-from-wp.ts
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { generateNewsManifest } from "./generate-news-index";
import { readImageSizeFromFile } from "./readImageSize";

const SLUG = "plakaty-z-wydarzen";
const WP_API =
  "https://www.akademiaikony.pl/wp-json/wp/v2/pages?slug=plakaty";
const MEDIA_DIR = join(
  process.cwd(),
  "public",
  "media",
  "news",
  SLUG,
);
const MDX_PATH = join(process.cwd(), "content", "news", `${SLUG}.mdx`);

type PosterAsset = {
  index: number;
  filename: string;
  src: string;
};

function extractPostersFromHtml(html: string): PosterAsset[] {
  const blockRe =
    /<a\s+href="(https:\/\/www\.akademiaikony\.pl\/wp-content\/uploads\/[^"]+)"[^>]*>\s*<img/gi;
  const matches = [...html.matchAll(blockRe)];

  return matches.map((match, index) => {
    const href = match[1];
    const basename = href.split("/").pop() ?? `poster-${index + 1}.jpg`;
    const safeName = basename.replace(/[^\w.-]+/g, "_");

    return {
      index: index + 1,
      filename: safeName,
      src: href,
    };
  });
}

async function downloadFile(url: string, dest: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync(dest, buffer);
}

async function main(): Promise<void> {
  const apiResponse = await fetch(WP_API);
  if (!apiResponse.ok) {
    throw new Error(`WP API ${apiResponse.status}`);
  }

  const pages = (await apiResponse.json()) as Array<{
    date: string;
    content: { rendered: string };
    title: { rendered: string };
  }>;

  const page = pages[0];
  if (!page) {
    throw new Error("WP page plakaty not found");
  }

  const posters = extractPostersFromHtml(page.content.rendered);
  if (posters.length === 0) {
    throw new Error("No poster images found in WP HTML");
  }

  mkdirSync(MEDIA_DIR, { recursive: true });

  await Promise.all(
    posters.map(async (poster) => {
      const dest = join(MEDIA_DIR, poster.filename);
      await downloadFile(poster.src, dest);
    }),
  );

  const images = posters.map((poster) => {
    const dest = join(MEDIA_DIR, poster.filename);
    const { width, height } = readImageSizeFromFile(dest);

    return {
      src: `/media/news/${SLUG}/${poster.filename}`,
      alt: "[do uzupełnienia: opis plakatu — wydarzenie i rok]",
      width,
      height,
    };
  });

  const date = page.date.slice(0, 10);

  const frontmatter = {
    slug: SLUG,
    title: "Plakaty z naszych wydarzeń",
    date,
    kind: "aktualnosc",
    excerpt:
      "Wybrane plakaty wystaw, wykładów, warsztatów i innych wydarzeń Akademii Ikony.",
    images,
    cover: images[0],
  };

  const mdx = `export const frontmatter = ${JSON.stringify(frontmatter, null, 2)};

Zapraszamy do zapoznania się z wybranymi plakatami z naszych wydarzeń.
`;

  writeFileSync(MDX_PATH, mdx, "utf8");
  const count = generateNewsManifest();
  console.log(`Wrote ${MDX_PATH} (${posters.length} images), manifest entries: ${count}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
