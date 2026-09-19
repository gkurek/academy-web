import type { IconWork } from "@/content/types";
import { pl } from "@/i18n/pl";

export function formatIconCaption(item: IconWork): string {
  if (item.author === "student") {
    return pl.gallery.caption.student
      .replace("{title}", item.title)
      .replace("{authorName}", item.authorName);
  }

  if (item.size) {
    return pl.gallery.caption.sized
      .replace("{title}", item.title)
      .replace("{width}", String(item.size.w))
      .replace("{height}", String(item.size.h));
  }

  return item.title;
}
