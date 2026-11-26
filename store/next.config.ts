import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // product images are served locally from /public/products
    unoptimized: false,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
