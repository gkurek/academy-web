import type { Metadata } from "next";
import localFont from "next/font/local";

import { AdminShell } from "@/components/AdminShell";
import { pl } from "@/i18n/pl";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

// The site's self-hosted subsets (src/app/fonts/README.md), shared rather than copied.
const ebGaramond = localFont({
  src: "../../../src/app/fonts/eb-garamond-pl.woff2",
  variable: "--font-garamond",
  weight: "400 600",
  adjustFontFallback: "Times New Roman",
});

const ibmPlexSans = localFont({
  src: "../../../src/app/fonts/ibm-plex-sans-pl.woff2",
  variable: "--font-plex",
  weight: "400 700",
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  title: pl.meta.title,
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-theme may be switched by the head script before hydration.
    <html
      lang="pl"
      data-theme="light"
      suppressHydrationWarning
      className={`${ebGaramond.variable} ${ibmPlexSans.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
