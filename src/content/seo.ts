import type { Page } from "@/content/types";
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH, type OgImage } from "@/lib/metadata";
import { frontmatter as exhibitionFrontmatter } from "../../content/exhibition/page.mdx";
import lecturersPage from "../../content/lecturers-page.json";
import archiveMeta from "../../content/lectures/archive.json";
import { frontmatter as kursFrontmatter } from "../../content/offers/kurs-roczny-i-trzyletni.mdx";
import { frontmatter as plenerFrontmatter } from "../../content/offers/letnia-szkola-swiatla.mdx";
import { frontmatter as wykladyFrontmatter } from "../../content/offers/wyklady.mdx";
import newsListPage from "../../content/pages/aktualnosci.json";
import homePage from "../../content/pages/home.json";
import iconsPage from "../../content/pages/ikony.json";
import contactPage from "../../content/pages/kontakt.json";
import aboutPage from "../../content/pages/o-akademii.json";
import privacyPolicyPage from "../../content/pages/polityka-prywatnosci.json";
import workshopPage from "../../content/pages/pracownia.json";
import publicationsPage from "../../content/pages/publikacje.json";
import workshopsHub from "../../content/pages/workshops-hub.json";

type PageSeo = NonNullable<Page["seo"]>;
type WithSeo = { seo?: PageSeo };

/** `seo` of every static route — each lives in the content file of its page (plan 10/k9, 9a). */
const SEO_BY_PATH: Record<string, WithSeo> = {
  "/": homePage,
  "/o-akademii": aboutPage,
  "/pracownia": workshopPage,
  "/warsztaty": workshopsHub,
  "/warsztaty/kurs-roczny-i-trzyletni": kursFrontmatter as WithSeo,
  "/warsztaty/letnia-szkola-swiatla": plenerFrontmatter as WithSeo,
  "/wyklady": wykladyFrontmatter as WithSeo,
  "/wyklady/archiwum": archiveMeta,
  "/wyklady/wykladowcy": lecturersPage,
  "/ikony": iconsPage,
  "/ikony/wystawy": exhibitionFrontmatter as WithSeo,
  "/publikacje": publicationsPage,
  "/aktualnosci": newsListPage,
  "/kontakt": contactPage,
  "/polityka-prywatnosci": privacyPolicyPage,
};

function ogCrop(src: string): OgImage {
  return { src, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT };
}

function requireSeo(path: string): PageSeo {
  const seo = SEO_BY_PATH[path]?.seo;
  if (!seo?.description?.trim()) {
    throw new Error(`content: no seo.description for "${path}" — add it to the page's content file`);
  }
  return seo;
}

/** Photo shared on pages without their own crop (K-156): the home page's `seo.ogImage`. */
export function getDefaultOgImage(): OgImage {
  const { ogImage } = requireSeo("/");
  if (!ogImage) {
    throw new Error("content/pages/home.json: seo.ogImage is the site default and is required");
  }
  return ogCrop(ogImage);
}

export function getDefaultDescription(): string {
  return requireSeo("/").description;
}

/** Every static route, home first — the sitemap's fixed part. */
export function getStaticPagePaths(): string[] {
  return Object.keys(SEO_BY_PATH);
}

/** Description and Open Graph image of a static route. */
export function getPageSeo(path: string): { description: string; image: OgImage } {
  const { description, ogImage } = requireSeo(path);
  return { description, image: ogImage ? ogCrop(ogImage) : getDefaultOgImage() };
}
