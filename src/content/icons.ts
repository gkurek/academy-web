import iconsData from "../../content/icons.json";
import type { IconWork } from "@/content/types";

export function getIconWorks(): IconWork[] {
  return iconsData as IconWork[];
}

export function getIconWorksBySlugs(slugs: string[]): IconWork[] {
  const icons = getIconWorks();
  return slugs
    .map((slug) => icons.find((icon) => icon.slug === slug))
    .filter((icon): icon is IconWork => icon !== undefined);
}
