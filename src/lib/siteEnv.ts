/**
 * Only the production host sets `SITE_ENV=production` (stage 11). Anything else — staging, previews,
 * local builds — stays out of search engines: `Disallow: /` in robots.txt and `noindex` on every page.
 * Read at build time, so the variable must be set where `npm run build` runs.
 */
export function isProductionSite(): boolean {
  return process.env.SITE_ENV === "production";
}
