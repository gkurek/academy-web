import type { IconWork } from "@/content/types";
import { pl } from "@/i18n/pl";

function formatTagLabels(tags: string[] | undefined): string {
  const labels = pl.gallery.tagLabels as Record<string, string>;
  return (tags ?? []).map((tag) => labels[tag] ?? tag).join(", ");
}

export type LightboxMetaEntry =
  | { kind: "line"; text: string }
  | { kind: "field"; label: string; value: string };

/** Metadata lines for the lightbox panel — title is rendered separately as H2. */
export function formatLightboxMeta(item: IconWork): LightboxMetaEntry[] {
  const entries: LightboxMetaEntry[] = [
    {
      kind: "field",
      label: pl.gallery.lightbox.authorLabel,
      value: item.authorName ?? pl.gallery.lightbox.authorFallback,
    },
  ];

  // WP caption sizes are unconfirmed — show the placeholder for every work, never the numbers.
  entries.push({
    kind: "field",
    label: pl.gallery.lightbox.sizeLabel,
    value: pl.gallery.lightbox.sizeUnverified,
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

  if (item.year) {
    entries.push({ kind: "line", text: String(item.year) });
  }

  return entries;
}
