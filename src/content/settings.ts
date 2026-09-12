import settingsData from "../../content/settings.json";
import type { SiteSettings } from "@/content/types";

export function getSiteSettings(): SiteSettings {
  return settingsData;
}
