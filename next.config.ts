import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
    // Avoid 3840px fetches — Unsplash CDN already serves sized URLs in catalog data
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Dev: skip the optimizer proxy (many parallel Unsplash fetches often hit the 7s timeout)
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
