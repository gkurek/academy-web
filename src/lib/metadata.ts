import type { Metadata } from "next";

import { pl } from "@/i18n/pl";

/** Canonical host — `www`, as on the current WordPress site (K-155). */
export const SITE_URL = "https://www.akademiaikony.pl";

/** Size of the prepared crops in `public/media/og/` (`scripts/generate-og-images.ts`, K-156). */
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export type OgImage = {
  src: string;
  width: number;
  height: number;
  alt?: string;
};

export type PageMetadataInput = {
  /** Route path — becomes the canonical URL and `og:url`. */
  path: string;
  /** Page part of the document title; omitted on `/`, which uses the layout's default title. */
  title?: string;
  description: string;
  image: OgImage;
};

/** Shared Open Graph fields — also the layout default for pages without their own metadata (404). */
export const baseOpenGraph = {
  type: "website",
  siteName: pl.meta.titleBrand,
  locale: "pl_PL",
} as const;

/**
 * Description, canonical, Open Graph and Twitter card for one page.
 * Next replaces `openGraph` / `twitter` whole per segment, so every page passes the full set.
 */
export function pageMetadata({ path, title, description, image }: PageMetadataInput): Metadata {
  const fullTitle = title ? `${title}${pl.meta.titleSeparator}${pl.meta.titleBrand}` : pl.meta.siteName;
  const images = [{ url: image.src, width: image.width, height: image.height, alt: image.alt }];

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: { ...baseOpenGraph, url: path, title: fullTitle, description, images },
    twitter: { card: "summary_large_image", title: fullTitle, description, images },
  };
}
