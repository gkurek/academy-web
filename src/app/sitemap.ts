import type { MetadataRoute } from "next";

import { getArticles } from "@/content/articles";
import { getNews } from "@/content/news";
import { getPrivacyPolicyPage } from "@/content/pages";
import { getPublications } from "@/content/publications";
import { getStaticPagePaths } from "@/content/seo";
import { todayInWarsaw } from "@/lib/isoDate";
import { SITE_URL } from "@/lib/metadata";

// News dates can lie ahead (announcements) — rebuild daily like the news routes (K-85).
export const revalidate = 86400;

/** `lastModified` only where content carries a real date; a future event date is left out. */
function pastDate(isoDate: string | undefined, today: string): string | undefined {
  return isoDate && isoDate <= today ? isoDate : undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const today = todayInWarsaw();
  const privacyUpdated = getPrivacyPolicyPage().lastUpdated;

  const staticPages = getStaticPagePaths().map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: path === "/polityka-prywatnosci" ? pastDate(privacyUpdated, today) : undefined,
  }));
  const news = getNews().map((entry) => ({
    url: `${SITE_URL}/aktualnosci/${entry.slug}`,
    lastModified: pastDate(entry.date, today),
  }));
  const publications = [...getPublications(), ...getArticles()].map((item) => ({
    url: `${SITE_URL}/publikacje/${item.slug}`,
  }));

  return [...staticPages, ...news, ...publications];
}
