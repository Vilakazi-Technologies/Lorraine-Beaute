import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "kyliecosmetics.com" },
      { protocol: "https", hostname: "asever.com" },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
