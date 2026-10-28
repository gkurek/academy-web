import type { Metadata } from "next";
import localFont from "next/font/local";
import { JsonLd } from "@/components/core/JsonLd";
import { getDefaultDescription, getDefaultOgImage } from "@/content/seo";
import { pl } from "@/i18n/pl";
import { baseOpenGraph, SITE_URL } from "@/lib/metadata";
import { isProductionSite } from "@/lib/siteEnv";
import { FOUNDER_ID } from "@/lib/structured-data/person";
import { organizationNode } from "@/lib/structured-data/site";
import "./globals.css";

// Self-hosted subsets (Basic Latin, Latin-1, Polish, typographic punctuation) instead of Google's
// latin + latin-ext files: 70 KB instead of 222 KB before LCP on a cold visit (11b, K-163).
// Source, character set and regeneration: `src/app/fonts/README.md`.
const ebGaramond = localFont({
  src: "./fonts/eb-garamond-pl.woff2",
  variable: "--font-serif",
  weight: "400 600",
  adjustFontFallback: "Times New Roman",
});

const ibmPlexSans = localFont({
  src: "./fonts/ibm-plex-sans-pl.woff2",
  variable: "--font-sans",
  weight: "400 700",
  adjustFontFallback: "Arial",
});

const defaultOgImage = getDefaultOgImage();
const defaultOgImages = [{ url: defaultOgImage.src, width: defaultOgImage.width, height: defaultOgImage.height }];

// Fallback for pages without their own metadata (404); routes set theirs through `pageMetadata`.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Inherited by every route — none sets its own `robots`.
  robots: isProductionSite() ? undefined : { index: false, follow: false },
  description: getDefaultDescription(),
  openGraph: { ...baseOpenGraph, images: defaultOgImages },
  twitter: { card: "summary_large_image", images: defaultOgImages },
  title: {
    default: pl.meta.siteName,
    template: `%s${pl.meta.titleSeparator}${pl.meta.titleBrand}`,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      className={`${ebGaramond.variable} ${ibmPlexSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={organizationNode(FOUNDER_ID)} />
        <a href="#main-content" className="skip-link">
          {pl.a11y.skipToContent}
        </a>
        <div className="mx-auto flex min-h-full w-full max-w-content-max flex-1 flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
