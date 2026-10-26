import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/metadata";
import { isProductionSite } from "@/lib/siteEnv";

export default function robots(): MetadataRoute.Robots {
  if (!isProductionSite()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
