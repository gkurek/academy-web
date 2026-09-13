import iconsData from "../../content/icons.json";
import type { IconWork } from "@/content/types";

export function getIconWorks(): IconWork[] {
  return iconsData as IconWork[];
}
