import type { MetadataRoute } from "next";
import { ATELIER } from "@/data/contact";

/**
 * Le plan du site.
 *
 * Quatre pages seulement, mais /mentions n'y figure pas : elle est en
 * noindex, l'annoncer reviendrait a demander a Google d'aller voir une page
 * qu'on lui dit ensuite d'ignorer.
 *
 * Pas de lastModified : rien ici n'a de date de publication fiable, et une
 * date inventee vaut moins que pas de date du tout.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = ATELIER.site;

  return [
    {
      url: base,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      // L'atout du site : ce que personne d'autre ne propose.
      url: `${base}/apercu`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      // Bouge des qu'une reference entre au catalogue.
      url: `${base}/catalogue`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
