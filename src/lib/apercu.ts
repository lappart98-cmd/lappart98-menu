// Geometrie de l'apercu : ou poser un visuel sur un vetement, et a quelle
// taille. Les valeurs sont exprimees en centimetres reels, puis converties en
// pixels a partir de la largeur mesuree du vetement sur le packshot.

import type { Product } from "@/data/products";

export type Vue = "face" | "dos";

export interface Emplacement {
  id: string;
  nom: string;
  /** Sur quelle vue du vetement cet emplacement se pose. */
  vue: Vue;
  /** Largeur du marquage, en centimetres. */
  cmDefaut: number;
  cmMin: number;
  cmMax: number;
  /** Centre horizontal, en fraction de la largeur du vetement. */
  centreX: number;
  /** Haut du marquage, en fraction de la hauteur du vetement. */
  hautY: number;
  aide: string;
}

// Le film DTF de l'atelier fait 30 cm de large : au-dela, un marquage doit
// etre scinde. Les maxima ci-dessous s'y tiennent.
export const LARGEUR_FILM_CM = 30;

export const EMPLACEMENTS: Emplacement[] = [
  {
    id: "coeur",
    nom: "Cœur",
    vue: "face",
    cmDefaut: 9,
    cmMin: 5,
    cmMax: 14,
    // Poitrine gauche du porteur, donc a droite de l'image : le packshot est
    // vu de face, comme un logo de polo.
    centreX: 0.68,
    hautY: 0.18,
    aide: "Le petit logo classique, poitrine gauche.",
  },
  {
    id: "petit-centre",
    nom: "Petit centré",
    vue: "face",
    cmDefaut: 12,
    cmMin: 8,
    cmMax: 20,
    centreX: 0.5,
    hautY: 0.17,
    aide: "Centré sous le col, format discret.",
  },
  {
    id: "grand-devant",
    nom: "Grand devant",
    vue: "face",
    cmDefaut: 26,
    cmMin: 16,
    cmMax: LARGEUR_FILM_CM,
    centreX: 0.5,
    hautY: 0.2,
    aide: "Le format qui se voit de loin.",
  },
  {
    id: "dos",
    nom: "Dos",
    vue: "dos",
    cmDefaut: 28,
    cmMin: 12,
    cmMax: LARGEUR_FILM_CM,
    centreX: 0.5,
    hautY: 0.22,
    aide: "Grand format entre les omoplates.",
  },
];

export const emplacementParId = (id: string) =>
  EMPLACEMENTS.find((e) => e.id === id);

/**
 * Largeur reelle du vetement a plat, en centimetres, pour convertir les
 * centimetres du marquage en pixels sur le packshot.
 *
 * C'est une valeur d'atelier moyenne, pas une mesure par taille : l'apercu
 * sert a se figurer une proportion, le BAT reste la reference.
 */
export function largeurVetementCm(product: Product): number {
  if (product.category === "Casquettes") return 18;
  if (product.category === "Sacs") return 38;
  if (product.cut.toLowerCase().includes("oversize")) return 58;
  return 52;
}

/** Bords du vetement sur le packshot, lus dans le canal alpha. */
export interface BoiteVetement {
  x: number;
  y: number;
  largeur: number;
  hauteur: number;
}

/**
 * Les packshots fournisseurs sont detoures : la boite englobante des pixels
 * non transparents est donc exactement le vetement. La lire evite de coder en
 * dur un cadrage qui change d'une reference a l'autre.
 *
 * Sur un packshot opaque (fond blanc aplati), on retombe sur l'image entiere.
 */
export function mesurerVetement(image: HTMLImageElement): BoiteVetement {
  const echelle = Math.min(1, 400 / image.naturalWidth);
  const l = Math.max(1, Math.round(image.naturalWidth * echelle));
  const h = Math.max(1, Math.round(image.naturalHeight * echelle));

  const canvas = document.createElement("canvas");
  canvas.width = l;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const entier = {
    x: 0,
    y: 0,
    largeur: image.naturalWidth,
    hauteur: image.naturalHeight,
  };
  if (!ctx) return entier;

  ctx.drawImage(image, 0, 0, l, h);
  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, l, h).data;
  } catch {
    // Canvas teinte : l'image ne passe pas par notre relais.
    return entier;
  }

  let x0 = l,
    y0 = h,
    x1 = -1,
    y1 = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < l; x++) {
      if (data[(y * l + x) * 4 + 3] > 16) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) return entier;

  const r = 1 / echelle;
  return {
    x: x0 * r,
    y: y0 * r,
    largeur: (x1 - x0 + 1) * r,
    hauteur: (y1 - y0 + 1) * r,
  };
}
