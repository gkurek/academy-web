export const WP_API_BASE = "https://www.akademiaikony.pl/wp-json/wp/v2";

export type WpPage = {
  slug: string;
  modified: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
};

export type WpPost = WpPage & {
  date: string;
  link: string;
};

export const fetchWpPageBySlug = async (slug: string): Promise<WpPage | undefined> => {
  const url = `${WP_API_BASE}/pages?slug=${encodeURIComponent(slug)}&per_page=1`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`WP pages API error for slug "${slug}": ${response.status}`);
  }
  const pages = (await response.json()) as WpPage[];
  return pages[0];
};

export const probeWpRest = async (): Promise<boolean> => {
  const response = await fetch(`${WP_API_BASE}/pages?per_page=1`);
  return response.ok;
};

export const fetchWpPostBySlug = async (slug: string): Promise<WpPost | undefined> => {
  const url = `${WP_API_BASE}/posts?slug=${encodeURIComponent(slug)}&per_page=1`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`WP posts API error for slug "${slug}": ${response.status}`);
  }
  const posts = (await response.json()) as WpPost[];
  return posts[0];
};

/** Category ID 3 = „Wykłady” on akademiaikony.pl (verified 2026-09-26). */
export const WYKLADY_CATEGORY_ID = 3;

export const fetchWykladyPosts = async (): Promise<WpPost[]> => {
  const url = `${WP_API_BASE}/posts?categories=${WYKLADY_CATEGORY_ID}&per_page=100&orderby=date&order=asc`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`WP posts API error for wyklady category: ${response.status}`);
  }
  return (await response.json()) as WpPost[];
};
