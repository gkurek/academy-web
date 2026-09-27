import type { NextConfig } from "next";
import createMDX from "@next/mdx";

import { loadPermanentRedirects } from "./src/lib/redirects";

const withMDX = createMDX({
  extension: /\.mdx$/,
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  async redirects() {
    return loadPermanentRedirects();
  },
};

export default withMDX(nextConfig);
