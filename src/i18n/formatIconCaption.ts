import type { IconWork } from "@/content/types";
import { pl } from "@/i18n/pl";

/** Caption for the home preview grid. (The gallery grid shows the title only — K-42.) */
export function formatIconCaption(item: IconWork): string {
  // Without a known name there is nothing to attribute — no gendered placeholder.
  if (item.author === "student" && item.authorName) {
    return pl.gallery.caption.student
      .replace("{title}", item.title)
      .replace("{authorName}", item.authorName);
  }

  return item.title;
}
