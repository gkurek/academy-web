/**
 * One-off: set width/height in plakaty-z-wydarzen.mdx from files on disk.
 * Usage: npx tsx scripts/fix-plakaty-dimensions.ts
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { generateNewsManifest } from "./generate-news-index";
import { readImageSizeFromFile } from "./readImageSize";

const SLUG = "plakaty-z-wydarzen";
const MDX_PATH = join(process.cwd(), "content", "news", `${SLUG}.mdx`);
const MEDIA_DIR = join(process.cwd(), "public", "media", "news", SLUG);

type ImageRef = { src: string; alt: string; width: number; height: number };

function applyFileDimensions(image: ImageRef): void {
  const filename = image.src.split("/").pop();
  if (!filename) {
    throw new Error(`Invalid src: ${image.src}`);
  }
  const { width, height } = readImageSizeFromFile(join(MEDIA_DIR, filename));
  image.width = width;
  image.height = height;
}

function main(): void {
  const text = readFileSync(MDX_PATH, "utf8");
  const marker = "export const frontmatter = ";
  const start = text.indexOf(marker);
  if (start === -1) {
    throw new Error("frontmatter block not found");
  }
  const jsonStart = start + marker.length;
  const jsonEnd = text.indexOf(";\n\n", jsonStart);
  if (jsonEnd === -1) {
    throw new Error("frontmatter JSON end not found");
  }

  const frontmatter = JSON.parse(text.slice(jsonStart, jsonEnd)) as {
    cover?: ImageRef;
    images: ImageRef[];
  };

  frontmatter.images.forEach(applyFileDimensions);
  if (frontmatter.cover) {
    applyFileDimensions(frontmatter.cover);
  }

  const body = text.slice(jsonEnd + 3);
  writeFileSync(
    MDX_PATH,
    `${marker}${JSON.stringify(frontmatter, null, 2)};\n\n${body}`,
    "utf8",
  );

  const count = generateNewsManifest();
  console.log(`Updated ${MDX_PATH}, manifest entries: ${count}`);
}

main();
