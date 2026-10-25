/**
 * WP media download — fetches every image from the old WordPress media library
 * (https://www.akademiaikony.pl, REST API /wp-json/wp/v2/media) and saves it outside the repo,
 * in ~/Desktop/ejk-pic-library, keeping the WP upload structure (YYYY/MM/file).
 * For images WP downscaled on upload (`-scaled` / `-rotated`), the untouched original is downloaded
 * instead (falls back to the WP copy when the original is missing on the server).
 * Writes metadata.json next to the files: title, alt, caption, description, date, parent post.
 * Files already on disk are skipped, so the script can be re-run after an interruption.
 * Usage (from repo root): npx tsx scripts/download-wp-media.ts
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

const SITE = "https://www.akademiaikony.pl";
const API = `${SITE}/wp-json/wp/v2`;
const UPLOADS_PREFIX = "/wp-content/uploads/";
const TARGET_DIR = join(homedir(), "Desktop", "ejk-pic-library");
const METADATA_FILE = join(TARGET_DIR, "metadata.json");
const PER_PAGE = 100;
const CONCURRENCY = 4;
const PARENT_TYPES = ["posts", "pages", "foogallery"];
const MEDIA_FIELDS = [
  "id",
  "date",
  "slug",
  "link",
  "mime_type",
  "title",
  "caption",
  "description",
  "alt_text",
  "post",
  "source_url",
  // Nested `_fields` (media_details.original_image) is ignored by this WP install — fetch the whole object.
  "media_details",
].join(",");

type WpMedia = {
  id: number;
  date: string;
  slug: string;
  link: string;
  mime_type: string;
  title: { rendered: string };
  caption: { rendered: string };
  description: { rendered: string };
  alt_text: string;
  post: number | null;
  source_url: string;
  media_details?: { width?: number; height?: number; original_image?: string };
};

type WpParent = { id: number; type: string; link: string; title: { rendered: string } };

type Status = "saved" | "skipped" | "failed";

type MediaRecord = {
  id: number;
  file: string | null;
  isOriginal: boolean;
  status: Status;
  title: string;
  alt: string;
  caption: string;
  description: string;
  date: string;
  mimeType: string;
  wpUrl: string;
  originalUrl: string | null;
  attachmentPage: string;
  wpWidth: number | null;
  wpHeight: number | null;
  parent: { id: number; type: string | null; title: string | null; link: string | null } | null;
};

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code.startsWith("#x") || code.startsWith("#X")) return String.fromCodePoint(parseInt(code.slice(2), 16));
    if (code.startsWith("#")) return String.fromCodePoint(Number(code.slice(1)));
    return ENTITIES[code.toLowerCase()] ?? match;
  });
}

function plainText(html: string): string {
  // WP appends an auto-generated <p class="attachment"> with the image markup to rendered descriptions.
  const withoutAttachment = html.replace(/<p class="attachment">[\s\S]*?<\/p>/g, "");
  return decodeEntities(withoutAttachment.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, ""))
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

async function fetchJson<T>(url: string): Promise<{ data: T; totalPages: number }> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} → HTTP ${response.status}`);
  return {
    data: (await response.json()) as T,
    totalPages: Number(response.headers.get("x-wp-totalpages") ?? 1),
  };
}

async function fetchAllMedia(): Promise<WpMedia[]> {
  const pageUrl = (page: number) =>
    `${API}/media?media_type=image&per_page=${PER_PAGE}&page=${page}&_fields=${MEDIA_FIELDS}`;
  const first = await fetchJson<WpMedia[]>(pageUrl(1));
  const rest = await Promise.all(
    Array.from({ length: first.totalPages - 1 }, (_, i) => fetchJson<WpMedia[]>(pageUrl(i + 2))),
  );
  return [first, ...rest].flatMap(({ data }) => data);
}

function chunk<T>(items: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, i) => items.slice(i * size, (i + 1) * size));
}

// Parents can be posts, pages or galleries; unresolved ids (private/draft) stay without a link.
async function fetchParents(ids: number[]): Promise<Map<number, WpParent>> {
  const requests = PARENT_TYPES.flatMap((type) =>
    chunk(ids, PER_PAGE).map((group) =>
      fetchJson<WpParent[]>(
        `${API}/${type}?include=${group.join(",")}&per_page=${PER_PAGE}&_fields=id,type,link,title`,
      )
        .then(({ data }) => data)
        .catch(() => [] as WpParent[]),
    ),
  );
  const parents = (await Promise.all(requests)).flat();
  return new Map(parents.map((parent) => [parent.id, parent]));
}

function originalUrl(media: WpMedia): string | null {
  const original = media.media_details?.original_image;
  if (!original) return null;
  return media.source_url.slice(0, media.source_url.lastIndexOf("/") + 1) + encodeURIComponent(original);
}

function relativePath(url: string): string {
  const { pathname } = new URL(url);
  const relative = pathname.startsWith(UPLOADS_PREFIX)
    ? pathname.slice(UPLOADS_PREFIX.length)
    : pathname.replace(/^\/+/, "");
  return decodeURIComponent(relative);
}

async function saveUrl(url: string): Promise<{ file: string; status: Status }> {
  const file = relativePath(url);
  const target = join(TARGET_DIR, ...file.split("/"));
  if (existsSync(target)) return { file, status: "skipped" };
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, Buffer.from(await response.arrayBuffer()));
  return { file, status: "saved" };
}

async function download(media: WpMedia): Promise<{ file: string | null; isOriginal: boolean; status: Status }> {
  const original = originalUrl(media);
  try {
    if (original) {
      const saved = await saveUrl(original).catch((error: Error) => {
        console.warn(`  ! #${media.id} original missing (${error.message}), using WP copy`);
        return null;
      });
      if (saved) return { ...saved, isOriginal: true };
    }
    return { ...(await saveUrl(media.source_url)), isOriginal: !original };
  } catch (error) {
    console.error(`  ✗ #${media.id} ${media.source_url} — ${(error as Error).message}`);
    return { file: null, isOriginal: false, status: "failed" };
  }
}

async function downloadAll(items: WpMedia[]): Promise<Map<number, Awaited<ReturnType<typeof download>>>> {
  const queue = [...items];
  const results = new Map<number, Awaited<ReturnType<typeof download>>>();
  const worker = async (): Promise<void> => {
    const next = queue.shift();
    if (!next) return;
    results.set(next.id, await download(next));
    if (results.size % 25 === 0) console.log(`  ${results.size}/${items.length}`);
    return worker();
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return results;
}

function toRecord(
  media: WpMedia,
  result: Awaited<ReturnType<typeof download>>,
  parents: Map<number, WpParent>,
): MediaRecord {
  const parent = media.post ? parents.get(media.post) : undefined;
  return {
    id: media.id,
    file: result.file,
    isOriginal: result.isOriginal,
    status: result.status,
    title: plainText(media.title.rendered),
    alt: media.alt_text,
    caption: plainText(media.caption.rendered),
    description: plainText(media.description.rendered),
    date: media.date,
    mimeType: media.mime_type,
    wpUrl: media.source_url,
    originalUrl: originalUrl(media),
    attachmentPage: media.link,
    wpWidth: media.media_details?.width ?? null,
    wpHeight: media.media_details?.height ?? null,
    parent: media.post
      ? {
          id: media.post,
          type: parent?.type ?? null,
          title: parent ? plainText(parent.title.rendered) : null,
          link: parent?.link ?? null,
        }
      : null,
  };
}

async function main(): Promise<void> {
  mkdirSync(TARGET_DIR, { recursive: true });
  const items = await fetchAllMedia();
  console.log(`download-wp-media — ${items.length} image(s) → ${TARGET_DIR}`);

  const parentIds = Array.from(new Set(items.flatMap(({ post }) => (post ? [post] : []))));
  const parents = await fetchParents(parentIds);

  const results = await downloadAll(items);
  const records = items
    .map((media) => toRecord(media, results.get(media.id)!, parents))
    .sort((a, b) => a.date.localeCompare(b.date));
  writeFileSync(
    METADATA_FILE,
    JSON.stringify({ source: SITE, fetchedAt: new Date().toISOString(), count: records.length, items: records }, null, 2),
  );

  const count = (status: Status) => records.filter((record) => record.status === status).length;
  console.log(`Done: ${count("saved")} saved, ${count("skipped")} skipped, ${count("failed")} failed.`);
  console.log(
    `Originals: ${records.filter((r) => r.isOriginal).length}/${records.length}; ` +
      `parents resolved: ${parents.size}/${parentIds.length}. Metadata → ${METADATA_FILE}`,
  );
  if (count("failed") > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
