import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.toptex.com",
      },
      // Visuels Velilla / Mukua
      {
        protocol: "https",
        hostname: "stospweb0pro01a237.blob.core.windows.net",
      },
    ],
  },
};

export default nextConfig;
