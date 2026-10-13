import type { IconWork } from "@/content/types";
import { pl } from "@/i18n/pl";

function formatTagLabels(tags: string[] | undefined): string {
  const labels = pl.gallery.tagLabels as Record<string, string>;
  return (tags ?? []).map((tag) => labels[tag] ?? tag).join(", ");
}

function formatIconSize(size: { w: number; h: number }): string {
  return pl.gallery.lightbox.sizeConfirmed
    .replace("{w}", String(size.w))
    .replace("{h}", String(size.h));
}

export type LightboxMetaEntry = { kind: "field"; label: string; value: string };

/** Metadata lines for the lightbox panel — title is rendered separately as H2. */
export function formatLightboxMeta(item: IconWork): LightboxMetaEntry[] {
  const entries: LightboxMetaEntry[] = [
    {
      kind: "field",
      label: pl.gallery.lightbox.authorLabel,
      value: item.authorName ?? pl.gallery.lightbox.authorFallback,
    },
  ];

  entries.push({
    kind: "field",
    label: pl.gallery.lightbox.sizeLabel,
    value:
      item.sizeVerified && item.size
        ? formatIconSize(item.size)
        : pl.gallery.lightbox.sizeUnverified,
  });

  entries.push({
    kind: "field",
    label: pl.gallery.lightbox.techniqueLabel,
    value: item.technique ?? pl.gallery.lightbox.techniqueDefault,
  });

  const tagLabels = formatTagLabels(item.tags);
  if (tagLabels) {
    entries.push({
      kind: "field",
      label: pl.gallery.lightbox.tagsLabel,
      value: tagLabels,
    });
  }

  return entries;
}
