/**
 * Reference import of the privacy policy page from WordPress REST API.
 *
 * Usage: npx tsx scripts/fetch-privacy-policy.ts
 *
 * Source: https://www.akademiaikony.pl/strona-glowna/polityka-prywatnosci/
 *
 * Production content lives in `content/pages/polityka-prywatnosci.json`
 * (layout mockup 3a in `design/Akademia Ikony - kierunki wizualne.dc.html`).
 * This script prints the raw WP HTML for legal review when updating sections.
 */

const WP_API =
  "https://www.akademiaikony.pl/wp-json/wp/v2/pages?slug=polityka-prywatnosci&per_page=1";

type WpPage = {
  title: { rendered: string };
  content: { rendered: string };
  modified: string;
};

async function main() {
  const response = await fetch(WP_API);
  if (!response.ok) {
    throw new Error(`WP API request failed: ${response.status}`);
  }

  const pages = (await response.json()) as WpPage[];
  const page = pages[0];
  if (!page) {
    throw new Error("Privacy policy page not found in WP API response.");
  }

  console.log(`Title: ${page.title.rendered}`);
  console.log(`Modified: ${page.modified}`);
  console.log("---");
  console.log(page.content.rendered);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
