import type { IconWork } from "@/content/types";
import { pl } from "@/i18n/pl";

/** Metadata lines for the lightbox panel — title is rendered separately as H2. */
export function formatLightboxMeta(item: IconWork): string[] {
  const lines = [item.authorName];

  if (item.size) {
    lines.push(
      pl.gallery.lightbox.size
        .replace("{width}", String(item.size.w))
        .replace("{height}", String(item.size.h))
    );
  }

  if (item.technique) {
    lines.push(item.technique);
  }

  if (item.year) {
    lines.push(String(item.year));
  }

  return lines;
}
