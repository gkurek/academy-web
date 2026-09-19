import type { IconWork } from "@/content/types";
import { pl } from "@/i18n/pl";

/** Metadata lines for the lightbox panel — title is rendered separately as H2. */
export function formatLightboxMeta(item: IconWork): string[] {
  const lines = [item.authorName ?? pl.gallery.lightbox.authorFallback];

  // `size` comes from WP captions and is unconfirmed: the line only says so.
  if (item.size) {
    lines.push(pl.gallery.lightbox.sizeUnverified);
  }

  if (item.technique) {
    lines.push(item.technique);
  }

  if (item.year) {
    lines.push(String(item.year));
  }

  return lines;
}
