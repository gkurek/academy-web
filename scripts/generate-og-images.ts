/**
 * Open Graph crops (plan 10/k9, K-156): one 1200×630 JPEG per source photo in public/media/og/.
 * Pages point at the output through `seo.ogImage` in their content file; pages without it use og/home.jpg.
 * `focus` is the crop anchor as fractions, like CSS `object-position` (0.5, 1 = bottom centre).
 *
 * When to run: after changing a source photo or a crop in CROPS below.
 * Usage (from repo root): npx tsx scripts/generate-og-images.ts
 */

import { mkdirSync } from "node:fs";
import { join } from "node:path";

import sharp from "sharp";

const MEDIA_DIR = join(process.cwd(), "public", "media");
const OUT_DIR = join(MEDIA_DIR, "og");
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

type OgCrop = {
  out: string;
  source: string;
  focus: { x: number; y: number };
};

const CENTER = { x: 0.5, y: 0.5 };

const CROPS: OgCrop[] = [
  { out: "home.jpg", source: "home/warsztaty.jpg", focus: CENTER },
  { out: "o-akademii.jpg", source: "workshop/hero.jpg", focus: { x: 0.5, y: 1 } },
  { out: "warsztaty.jpg", source: "workshop/hub-hero.jpg", focus: CENTER },
  {
    out: "kurs-roczny-i-trzyletni.jpg",
    source: "offers/kurs-roczny-i-trzyletni/pracownia.jpg",
    focus: CENTER,
  },
  { out: "letnia-szkola-swiatla.jpg", source: "offers/letnia-szkola-swiatla/pracownia.jpg", focus: CENTER },
  { out: "wyklady.jpg", source: "home/wyklad.jpg", focus: CENTER },
  { out: "ikony.jpg", source: "exhibition/permanent-three-icons.jpg", focus: CENTER },
  { out: "wystawy.jpg", source: "exhibition/hero.jpg", focus: CENTER },
  { out: "kontakt.jpg", source: "contact/kosciol-srodowisk-tworczych.jpg", focus: { x: 0.5, y: 0.2 } },
];

async function writeCrop({ out, source, focus }: OgCrop): Promise<string> {
  const image = sharp(join(MEDIA_DIR, source)).rotate();
  const { width = 0, height = 0 } = await image.metadata();
  // Cover-scale (upscaling small sources, e.g. the 1260×504 plener photo), then cut at the focus point.
  const scale = Math.max(OG_WIDTH / width, OG_HEIGHT / height);
  const scaledWidth = Math.ceil(width * scale);
  const scaledHeight = Math.ceil(height * scale);

  await image
    .resize(scaledWidth, scaledHeight)
    .extract({
      left: Math.round((scaledWidth - OG_WIDTH) * focus.x),
      top: Math.round((scaledHeight - OG_HEIGHT) * focus.y),
      width: OG_WIDTH,
      height: OG_HEIGHT,
    })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(join(OUT_DIR, out));

  return `${source} (${width}×${height}) → og/${out}`;
}

async function main(): Promise<void> {
  mkdirSync(OUT_DIR, { recursive: true });
  const lines = await Promise.all(CROPS.map(writeCrop));
  lines.forEach((line) => console.log(line));
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
