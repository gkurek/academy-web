import type { Metadata } from "next";
import { EB_Garamond, IBM_Plex_Sans } from "next/font/google";
import { JsonLd } from "@/components/core/JsonLd";
import { getDefaultDescription, getDefaultOgImage } from "@/content/seo";
import { pl } from "@/i18n/pl";
import { baseOpenGraph, SITE_URL } from "@/lib/metadata";
import { isProductionSite } from "@/lib/siteEnv";
import { FOUNDER_ID } from "@/lib/structured-data/person";
import { organizationNode } from "@/lib/structured-data/site";
import "./globals.css";

const ebGaramond = EB_Garamond({
  variable: "--font-serif",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  weight: "variable",
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
