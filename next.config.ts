import type { NextConfig } from "next";
import createMDX from "@next/mdx";

import {
  DEFAULT_IMAGE_QUALITY,
  HIGH_IMAGE_QUALITY,
  VARIANT_DEVICE_WIDTHS,
  VARIANT_IMAGE_WIDTHS,
} from "./src/lib/imageVariants";
import { loadPermanentRedirects } from "./src/lib/redirects";

const withMDX = createMDX({
  extension: /\.mdx$/,
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // Prebuilt WebP variants instead of on-request resizing (11b); widths and qualities must match the files.
  images: {
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
    deviceSizes: VARIANT_DEVICE_WIDTHS,
    imageSizes: VARIANT_IMAGE_WIDTHS,
    qualities: [DEFAULT_IMAGE_QUALITY, HIGH_IMAGE_QUALITY],
  },
  async redirects() {
    return loadPermanentRedirects();
  },
};

export default withMDX(nextConfig);
