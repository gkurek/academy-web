import type { Metadata } from "next";
import { EB_Garamond, IBM_Plex_Sans } from "next/font/google";
import { pl } from "@/i18n/pl";
import "./globals.css";

const ebGaramond = EB_Garamond({
  variable: "--font-serif",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: pl.meta.siteName,
    template: `%s · ${pl.meta.titleBrand}`,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      className={`${ebGaramond.variable} ${ibmPlexSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
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
