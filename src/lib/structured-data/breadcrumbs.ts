import { pl } from "@/i18n/pl";
import { privacyPolicyLink, publicationsLink, resolveNav, type NavLink } from "@/navigation";
import { absoluteUrl, CONTEXT, type JsonLdNode } from "@/lib/structured-data/site";

/**
 * Home › section hub › SectionNav subpage › current page, labels from `navigation.ts` (K-158).
 * `currentTitle` names a page that is not itself a nav link (a news entry, an article);
 * without it such a page fails the build instead of getting a truncated trail.
 */
export function breadcrumbNode(path: string, currentTitle?: string): JsonLdNode {
  const { active, sectionActive } = resolveNav(path);
  const outsideMainNav = [publicationsLink, privacyPolicyLink].find(
    (link) => path === link.href || path.startsWith(`${link.href}/`),
  );

  const trail = [active ?? outsideMainNav, sectionActive].reduce<NavLink[]>(
    (links, link) => (link && !links.some((item) => item.href === link.href) ? [...links, link] : links),
    [],
  );
  const last = trail.at(-1);

  if (last?.href !== path) {
    if (!currentTitle) {
      throw new Error(`breadcrumbs: "${path}" is not a nav link — pass the page title`);
    }
    trail.push({ label: currentTitle, href: path });
  }

  const items = [{ label: pl.publications.breadcrumbHome, href: "/" }, ...trail];

  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}
