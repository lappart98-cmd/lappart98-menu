import type { MetadataRoute } from "next";
import { ATELIER } from "@/data/contact";

/**
 * Regles de crawl.
 *
 * /api/packshot est un proxy d'images de fournisseurs : rien a indexer, et
 * chaque visite de robot y declenche un aller-retour vers un CDN tiers.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${ATELIER.site}/sitemap.xml`,
  };
}
