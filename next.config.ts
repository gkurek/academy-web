import type { NextConfig } from "next";
import createMDX from "@next/mdx";

import { loadPermanentRedirects } from "./src/lib/redirects";

const withMDX = createMDX({
  extension: /\.mdx$/,
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    // 75 is the next/image default; 90 is for small tiles where q75 WebP shows blocking.
    qualities: [75, 90],
  },
  async redirects() {
    return loadPermanentRedirects();
  },
};

export default withMDX(nextConfig);
