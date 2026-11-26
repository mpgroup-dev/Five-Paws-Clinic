import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // product images are served locally from /public/products
    unoptimized: false,
  },
  turbopack: {
    // This app lives in a subfolder of the Five Paws Clinic monorepo, which
    // has its own sibling package-lock.json — pin the root explicitly so
    // Turbopack doesn't try to guess the wrong workspace root.
    root: path.join(__dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
