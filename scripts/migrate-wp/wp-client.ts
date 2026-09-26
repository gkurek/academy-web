export const WP_API_BASE = "https://www.akademiaikony.pl/wp-json/wp/v2";

export type WpPage = {
  slug: string;
  modified: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
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
