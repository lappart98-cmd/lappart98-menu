import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Le formulaire de devis envoie le visuel du client en piece jointe.
  // La limite par defaut d'une Server Action est 1 Mo : trop juste pour un logo.
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.toptex.com",
      },
    ],
  },
};

export default nextConfig;
