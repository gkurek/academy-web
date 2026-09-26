import { createHash } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

export const decodeHtml = (value: string): string =>
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

export const stripCacheUrl = (url: string): string =>
  url.replace(/-\d+x\d+(?=\.\w+$)/, "").replace(/\/cache\//, "/");

export const htmlToMarkdownBody = (html: string): string => {
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
      if (!cleanLabel) {
        return "";
      }
      if (href.startsWith("tel:")) {
        return `[${cleanLabel}](${href})`;
      }
      if (href.startsWith("mailto:")) {
        return `[${cleanLabel}](${href})`;
      }
      return cleanLabel;
    });

  text = text.replace(/<iframe[\s\S]*?<\/iframe>/gi, "");
  text = text.replace(/<a[^>]*href="[^"]+\/wp-content\/uploads\/[^"]+"[^>]*>[\s\S]*?<\/a>/gi, "");
  text = text.replace(/<img[^>]*>/gi, "");
  text = decodeHtml(text.replace(/<[^>]+>/g, " "));

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(
      (line, lineIndex, lines) =>
        line.length > 0 || (lineIndex > 0 && lines[lineIndex - 1].length > 0),
    )
    .join("\n\n")
    .trim();
};

export type ImageDownloadRequest = {
  sourceUrl: string;
  fileBase: string;
  mediaRoot: string;
  publicPrefix: string;
};

const downloadedUrls = new Map<string, string>();

export const downloadOriginalImage = async (
  request: ImageDownloadRequest,
  dryRun: boolean,
): Promise<string | undefined> => {
  const normalized = stripCacheUrl(request.sourceUrl);
  if (normalized.includes("/cache/")) {
    return undefined;
  }

  const cached = downloadedUrls.get(normalized);
  if (cached) {
    return cached;
  }

  const extension = extname(new URL(normalized).pathname) || ".jpg";
  const filename = `${request.fileBase}${extension}`;
  const localPath = join(request.mediaRoot, filename);
  const publicPath = `${request.publicPrefix}/${filename}`;

  if (dryRun) {
    return publicPath;
  }

  if (!existsSync(request.mediaRoot)) {
    mkdirSync(request.mediaRoot, { recursive: true });
  }

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

export const extractLinkedUploadUrls = (html: string): string[] => {
  const urls: string[] = [];
  const pattern =
    /<a[^>]*href="([^"]+\/wp-content\/uploads\/[^"]+)"[^>]*>[\s\S]*?<\/a>/gi;

  let match = pattern.exec(html);
  while (match) {
    urls.push(stripCacheUrl(match[1]));
    match = pattern.exec(html);
  }

  return urls;
};

export const extractMapEmbedUrl = (html: string): string | undefined => {
  const match = html.match(/<iframe[^>]*src="([^"]+google\.com\/maps\/embed[^"]+)"/i);
  return match?.[1];
};

export const extractListItems = (html: string): string[] => {
  const items: string[] = [];
  const pattern = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let match = pattern.exec(html);
  while (match) {
    items.push(decodeHtml(match[1]));
    match = pattern.exec(html);
  }
  return items;
};

export const contentFingerprint = (value: string): string =>
  createHash("sha256").update(value).digest("hex").slice(0, 12);
