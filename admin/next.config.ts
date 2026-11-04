import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Served under the site's domain at /admin (K-165); routing to this Worker comes in 12b-3.
  basePath: "/admin",
  // Repo root: the panel imports shared types from ../src/content and the site's fonts from ../src/app/fonts.
  turbopack: { root: path.join(__dirname, "..") },
  outputFileTracingRoot: path.join(__dirname, ".."),
};

export default nextConfig;
