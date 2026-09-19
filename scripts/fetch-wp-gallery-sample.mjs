import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public/media/sample/icons");
const MANIFEST_PATH = join(ROOT, "scripts/wp-gallery-manifest.json");

const EJK_AUTHOR_NAME = "Elżbieta Jackowska-Kurek";
const WP_API =
  "https://www.akademiaikony.pl/wp-json/wp/v2/pages?slug=galeria";
const WP_MEDIA_API = "https://www.akademiaikony.pl/wp-json/wp/v2/media";
const DOWNLOAD_ALL = process.argv.includes("--all");

/** Gallery figures with no caption in HTML — title from WP media library or manual fallback. */
const MANUAL_CAPTIONS_BY_ATTACHMENT = {
  1115: "[do uzupełnienia: tytuł ikony]",
};

const slugify = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

const parseDimensions = (caption) => {
  const match = caption.match(/(\d+)\s*x\s*(\d+)\s*(?:\(cm\)|cm\.?|\))?/i);
  if (!match) return undefined;
  return { w: Number(match[1]), h: Number(match[2]) };
};

const parseEjkCaption = (caption) => {
  const sizedMatch = caption.match(/^(.+?),\s*(\d+)\s*x\s*(\d+)/i);
  if (sizedMatch) {
    return {
      title: sizedMatch[1].trim(),
      size: { w: Number(sizedMatch[2]), h: Number(sizedMatch[3]) },
    };
  }

  const looseMatch = caption.match(/^(.+?)\s+(\d+)\s*x\s*(\d+)/i);
  if (looseMatch) {
    return {
      title: looseMatch[1].trim(),
      size: { w: Number(looseMatch[2]), h: Number(looseMatch[3]) },
    };
  }

  return null;
};

const isFilenameMediaTitle = (title) =>
  /^(DSC\d+|IMG_|rsz_|zz-|\d+-)/i.test(title.trim());

const mediaTitleCache = new Map();

const fetchMediaTitle = async (attachmentId) => {
  if (mediaTitleCache.has(attachmentId)) {
    return mediaTitleCache.get(attachmentId);
  }

  const response = await fetch(`${WP_MEDIA_API}/${attachmentId}`);
  if (!response.ok) {
    throw new Error(`WP media API error for ${attachmentId}: ${response.status}`);
  }

  const media = await response.json();
  const title = media.title?.rendered?.replace(/<[^>]+>/g, "").trim() ?? "";
  mediaTitleCache.set(attachmentId, title);
  return title;
};

const resolveCaption = async (caption, attachmentId) => {
  if (caption) return caption;

  if (attachmentId && MANUAL_CAPTIONS_BY_ATTACHMENT[attachmentId]) {
    return MANUAL_CAPTIONS_BY_ATTACHMENT[attachmentId];
  }

  if (!attachmentId) return "";

  const mediaTitle = await fetchMediaTitle(attachmentId);
  if (mediaTitle && !isFilenameMediaTitle(mediaTitle)) {
    return mediaTitle;
  }

  return "";
};

const parseEjkItem = (caption) => {
  const sized = parseEjkCaption(caption);
  if (sized) return sized;

  const dimensions = parseDimensions(caption);
  if (dimensions) {
    return {
      title: caption.replace(/\s*\d+\s*x\s*\d+.*$/i, "").trim(),
      size: dimensions,
    };
  }

  return caption ? { title: caption } : null;
};

const parseStudentCaption = (caption) => {
  const namedMatch = caption.match(
    /^(.+?)(?:,\s+|\s+)pis[a-ząćęłńóśźż]*\s+r[eę]k[aą]\s+(.+?)(?:\s*\(\s*(\d+)\s*x\s*(\d+)\s*cm\.?\s*\))?\.?$/iu,
  );
  if (namedMatch) {
    const size =
      namedMatch[3] && namedMatch[4]
        ? { w: Number(namedMatch[3]), h: Number(namedMatch[4]) }
        : parseDimensions(caption);

    return {
      title: namedMatch[1].trim().replace(/,\s*$/, ""),
      authorName: namedMatch[2].trim(),
      size,
    };
  }

  const sizedMatch = caption.match(/^(.+?),\s*(\d+)\s*x\s*(\d+)/i);
  if (sizedMatch) {
    return {
      title: sizedMatch[1].trim(),
      size: { w: Number(sizedMatch[2]), h: Number(sizedMatch[3]) },
    };
  }

  const looseMatch = caption.match(/^(.+?)\s+(\d+)\s*x\s*(\d+)/i);
  if (looseMatch) {
    return {
      title: looseMatch[1].trim(),
      size: { w: Number(looseMatch[2]), h: Number(looseMatch[3]) },
    };
  }

  return { title: caption.trim() };
};

const readImageSize = (buffer) => {
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      if (marker === 0xc0 || marker === 0xc2) {
        return {
          width: buffer.readUInt16BE(offset + 7),
          height: buffer.readUInt16BE(offset + 5),
        };
      }
      offset += 2 + length;
    }
  }

  if (buffer.toString("ascii", 1, 4) === "PNG") {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  }

  return null;
};

const extractItems = async (html, sectionAuthor) => {
  const items = [];
  const figureRe = /<figure class="fg-item-inner">([\s\S]*?)<\/figure>/g;
  let figureMatch;

  while ((figureMatch = figureRe.exec(html))) {
    const block = figureMatch[1];
    const urlMatch = block.match(
      /href="(https:\/\/www\.akademiaikony\.pl\/wp-content\/uploads\/[^"]+)"/,
    );
    if (!urlMatch || urlMatch[1].includes("/cache/")) continue;

    const attachmentId = Number(block.match(/data-attachment-id="(\d+)"/)?.[1]);
    const captionMatch =
      block.match(/data-caption-title="([^"]*)"/) ??
      block.match(/<img[^>]*title="([^"]*)"/);
    const rawCaption = captionMatch?.[1]?.trim() ?? "";
    const caption = await resolveCaption(rawCaption, attachmentId);
    if (!caption) continue;

    const parsed =
      sectionAuthor === "ejk"
        ? parseEjkItem(caption)
        : parseStudentCaption(caption);
    if (!parsed) continue;

    items.push({
      author: sectionAuthor,
      authorName:
        sectionAuthor === "ejk"
          ? EJK_AUTHOR_NAME
          : parsed.authorName ?? undefined,
      caption,
      wpUrl: urlMatch[1],
      title: parsed.title,
      size: parsed.size,
    });
  }

  return items;
};

const pickSamples = (ejkItems, studentItems) => {
  const ejkMatchers = [
    /archani[oó]ł michał, 25x30/i,
    /ukrzyżowanie, 52x36/i,
    /mandylion, 30x33/i,
    /matka boża advokata, 25x15/i,
    /tr[oó]jca święta, 40x60/i,
    /boże narodzenie 40x50/i,
    /święty józef z dzieciątkiem/i,
    /matka boża eleusa/i,
    /archani[oó]ł gabriel, 25x30/i,
    /chrystus pantokrator, 25x30/i,
  ];

  const studentMatchers = [
    /justyny suchenek/i,
    /mai kinle/i,
    /agnieszki kundy/i,
    /izabeli jeleniewskiej/i,
    /mgdaleny limbach/i,
    /anny żymełki/i,
    /matka boża 22x16/i,
    /archani[oó]ł gabriel, 25x40/i,
    /przemienienie pańskie, 40x60/i,
    /boże narodzenie, 25x26/i,
  ];

  const pickByMatchers = (items, matchers) => {
    const selected = [];
    const urls = new Set();

    matchers.forEach((matcher) => {
      const item = items.find(
        (candidate) => matcher.test(candidate.caption) && !urls.has(candidate.wpUrl),
      );
      if (!item) return;
      urls.add(item.wpUrl);
      selected.push(item);
    });

    return selected;
  };

  const selectedEjk = pickByMatchers(ejkItems, ejkMatchers);
  const selectedStudents = pickByMatchers(studentItems, studentMatchers);

  const fillToCount = (selected, all, count) => {
    const urls = new Set(selected.map((item) => item.wpUrl));
    return [
      ...selected,
      ...all.filter((item) => !urls.has(item.wpUrl)),
    ].slice(0, count);
  };

  return {
    ejk: fillToCount(selectedEjk, ejkItems, 10),
    students: fillToCount(selectedStudents, studentItems, 10),
  };
};

const normalizeExtension = (wpUrl) => {
  const ext = extname(new URL(wpUrl).pathname).toLowerCase() || ".jpg";
  return ext === ".jpeg" ? ".jpg" : ext;
};

const ensureUniqueSlugs = (items) => {
  const used = new Map();

  return items.map((item) => {
    const base = slugify(item.title);
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    const slug = count === 0 ? base : `${base}-${count + 1}`;
    const localFile = `${slug}${normalizeExtension(item.wpUrl)}`;

    return {
      ...item,
      slug,
      localFile,
      localPath: `/media/sample/icons/${localFile}`,
    };
  });
};

const loadExistingManifest = () => {
  if (!existsSync(MANIFEST_PATH)) return [];
  return JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
};

const createSlugAllocator = (existingManifest) => {
  const takenSlugs = new Set(existingManifest.map((item) => item.slug));

  return (title) => {
    const base = slugify(title);
    if (!takenSlugs.has(base)) {
      takenSlugs.add(base);
      return base;
    }

    let suffix = 2;
    while (takenSlugs.has(`${base}-${suffix}`)) {
      suffix += 1;
    }

    const slug = `${base}-${suffix}`;
    takenSlugs.add(slug);
    return slug;
  };
};

const buildDownloadManifest = (allItems, existingManifest) => {
  const existingByUrl = new Map(
    existingManifest.map((item) => [item.wpUrl, item]),
  );
  const allocateSlug = createSlugAllocator(existingManifest);

  return allItems.map((item) => {
    const existing = existingByUrl.get(item.wpUrl);
    if (existing) {
      return {
        ...item,
        slug: existing.slug,
        localFile: existing.localFile,
        localPath: existing.localPath,
      };
    }

    const slug = allocateSlug(item.title);
    const localFile = `${slug}${normalizeExtension(item.wpUrl)}`;

    return {
      ...item,
      slug,
      localFile,
      localPath: `/media/sample/icons/${localFile}`,
    };
  });
};

const downloadFile = async (url, destination) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }
  await pipeline(response.body, createWriteStream(destination));
};

const main = async () => {
  const response = await fetch(WP_API);
  if (!response.ok) {
    throw new Error(`WP API error: ${response.status}`);
  }

  const pages = await response.json();
  const html = pages[0]?.content?.rendered;
  if (!html) {
    throw new Error("Gallery page HTML not found");
  }

  const sections = html.split(
    /<strong>IKONY (?:PISANE RĘKĄ ELŻBIETY JACKOWSKIEJ-KUREK|UCZNIÓW)/i,
  );

  const ejkItems = await extractItems(sections[1] ?? "", "ejk");
  const studentItems = await extractItems(sections[2] ?? "", "student");
  const allItems = [...ejkItems, ...studentItems];
  const existingManifest = loadExistingManifest();
  const picked = pickSamples(ejkItems, studentItems);
  const manifest = DOWNLOAD_ALL
    ? buildDownloadManifest(allItems, existingManifest)
    : ensureUniqueSlugs([...picked.ejk, ...picked.students]);

  mkdirSync(OUT_DIR, { recursive: true });

  const fsPromises = await import("node:fs/promises");
  let downloadedCount = 0;
  let skippedCount = 0;

  const downloaded = await Promise.all(
    manifest.map(async (item) => {
      const destination = join(OUT_DIR, item.localFile);
      const existing = existingManifest.find(
        (entry) => entry.wpUrl === item.wpUrl,
      );

      if (!existsSync(destination)) {
        await downloadFile(item.wpUrl, destination);
        downloadedCount += 1;
      } else {
        skippedCount += 1;
      }

      const buffer = await fsPromises.readFile(destination);
      const dimensions = readImageSize(buffer);
      if (!dimensions) {
        throw new Error(`Could not read image dimensions for ${item.localFile}`);
      }

      return {
        slug: item.slug,
        author: item.author,
        authorName: item.authorName ?? existing?.authorName ?? null,
        title: item.title,
        size: item.size ?? existing?.size ?? null,
        caption: item.caption,
        wpUrl: item.wpUrl,
        localFile: item.localFile,
        localPath: item.localPath,
        image: {
          width: dimensions.width,
          height: dimensions.height,
        },
        sample: true,
      };
    }),
  );

  writeFileSync(MANIFEST_PATH, `${JSON.stringify(downloaded, null, 2)}\n`, "utf8");

  const summary = {
    mode: DOWNLOAD_ALL ? "all" : "sample",
    total: downloaded.length,
    downloaded: downloadedCount,
    skippedExisting: skippedCount,
    ejk: downloaded.filter((item) => item.author === "ejk").length,
    students: downloaded.filter((item) => item.author === "student").length,
    studentsWithName: downloaded.filter(
      (item) => item.author === "student" && item.authorName,
    ).length,
    studentsWithoutName: downloaded.filter(
      (item) => item.author === "student" && !item.authorName,
    ).length,
  };

  console.log(JSON.stringify({ summary, manifestPath: MANIFEST_PATH }, null, 2));
  downloaded.forEach((item) => {
    console.log(
      `[${item.author}] ${item.slug} -> ${item.localFile} (${item.image.width}x${item.image.height})`,
    );
  });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
