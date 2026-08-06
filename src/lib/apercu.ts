// Geometrie de l'apercu : ou poser un visuel sur un vetement, et a quelle
// taille. Les valeurs sont exprimees en centimetres reels, puis converties en
// pixels a partir de la largeur mesuree du vetement sur le packshot.
//
// Chaque famille a ses propres emplacements : un logo ne se pose pas au meme
// endroit sur un t-shirt, un hoodie et une casquette, et une casquette n'a ni
// dos ni grand format.

import type { Product } from "@/data/products";

export type Vue = "face" | "profil" | "dos";
export type Famille =
  | "tshirt"
  | "polo"
  | "sweat"
  | "hoodie"
  | "casquette"
  | "totebag";

export interface Emplacement {
  id: string;
  nom: string;
  /** Sur quelle vue du vetement cet emplacement se pose. */
  vue: Vue;
  /** Largeur du marquage, en centimetres. */
  cmDefaut: number;
  cmMin: number;
  cmMax: number;
  /**
   * Hauteur maximale du marquage, en centimetres. Un visuel plus haut que
   * large est reduit pour tenir dans la zone : sur une casquette, la limite
   * n'est pas la largeur du panneau mais la bande libre entre le haut de la
   * calotte et la visiere.
   */
  hauteurMaxCm?: number;
  /** Centre horizontal, en fraction de la largeur du vetement. */
  centreX: number;
  /**
   * Reperage vertical, en fraction de la hauteur du vetement. Par defaut il
   * designe le haut du marquage ; avec ancrage "centre", son milieu, ce qui
   * garde le visuel dans sa bande quelle que soit sa proportion.
   */
  hautY: number;
  ancrage?: "haut" | "centre";
  aide: string;
}

// Le film DTF de l'atelier fait 30 cm de large : au-dela, un marquage doit
// etre scinde. Les maxima ci-dessous s'y tiennent.
export const LARGEUR_FILM_CM = 30;

// Poitrine gauche du porteur, donc a droite de l'image : le packshot est vu
// de face, comme un logo de polo.
const COEUR_X = 0.68;

const EMPLACEMENTS_PAR_FAMILLE: Record<Famille, Emplacement[]> = {
  tshirt: [
    {
      id: "coeur",
      nom: "Cœur",
      vue: "face",
      cmDefaut: 9,
      cmMin: 5,
      cmMax: 14,
      hauteurMaxCm: 12,
      centreX: COEUR_X,
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
      hauteurMaxCm: 20,
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
      hauteurMaxCm: 36,
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
      hauteurMaxCm: 40,
      centreX: 0.5,
      hautY: 0.22,
      aide: "Grand format entre les omoplates.",
    },
  ],

  // Un polo ne se marque ni au centre ni en grand devant : la patte de boutons
  // occupe toute la hauteur utile de la poitrine. Restent le coeur et le dos.
  polo: [
    {
      id: "coeur",
      nom: "Cœur",
      vue: "face",
      cmDefaut: 9,
      cmMin: 5,
      cmMax: 12,
      hauteurMaxCm: 12,
      centreX: 0.68,
      hautY: 0.21,
      aide: "Poitrine gauche, à côté de la patte de boutons.",
    },
    {
      id: "dos",
      nom: "Dos",
      vue: "dos",
      cmDefaut: 28,
      cmMin: 12,
      cmMax: LARGEUR_FILM_CM,
      hauteurMaxCm: 40,
      centreX: 0.5,
      hautY: 0.24,
      aide: "Grand format entre les omoplates.",
    },
  ],

  // Col rond : les epaules montent un peu plus haut que sur un t-shirt, tout
  // le placement descend en consequence.
  sweat: [
    {
      id: "coeur",
      nom: "Cœur",
      vue: "face",
      cmDefaut: 9,
      cmMin: 5,
      cmMax: 14,
      hauteurMaxCm: 12,
      centreX: COEUR_X,
      hautY: 0.21,
      aide: "Le petit logo classique, poitrine gauche.",
    },
    {
      id: "petit-centre",
      nom: "Petit centré",
      vue: "face",
      cmDefaut: 12,
      cmMin: 8,
      cmMax: 20,
      hauteurMaxCm: 20,
      centreX: 0.5,
      hautY: 0.2,
      aide: "Centré sous le col, format discret.",
    },
    {
      id: "grand-devant",
      nom: "Grand devant",
      vue: "face",
      cmDefaut: 26,
      cmMin: 16,
      cmMax: LARGEUR_FILM_CM,
      hauteurMaxCm: 36,
      centreX: 0.5,
      hautY: 0.23,
      aide: "Le format qui se voit de loin.",
    },
    {
      id: "dos",
      nom: "Dos",
      vue: "dos",
      cmDefaut: 28,
      cmMin: 12,
      cmMax: LARGEUR_FILM_CM,
      hauteurMaxCm: 40,
      centreX: 0.5,
      hautY: 0.24,
      aide: "Grand format entre les omoplates.",
    },
  ],

  // Capuche et poche kangourou mangent le haut et le bas de la zone : le
  // devant est plus court, et le dos descend sous la capuche.
  hoodie: [
    {
      id: "coeur",
      nom: "Cœur",
      vue: "face",
      cmDefaut: 9,
      cmMin: 5,
      cmMax: 13,
      hauteurMaxCm: 12,
      centreX: COEUR_X,
      hautY: 0.26,
      aide: "Le petit logo classique, sous la capuche.",
    },
    {
      id: "petit-centre",
      nom: "Petit centré",
      vue: "face",
      cmDefaut: 11,
      cmMin: 8,
      cmMax: 18,
      hauteurMaxCm: 20,
      centreX: 0.5,
      hautY: 0.25,
      aide: "Centré sous la capuche, format discret.",
    },
    {
      id: "grand-devant",
      nom: "Grand devant",
      vue: "face",
      cmDefaut: 24,
      cmMin: 14,
      // Au-dela, le marquage mord sur la poche kangourou.
      cmMax: 26,
      hauteurMaxCm: 36,
      centreX: 0.5,
      hautY: 0.27,
      aide: "Limité par la poche kangourou.",
    },
    {
      id: "dos",
      nom: "Dos",
      vue: "dos",
      cmDefaut: 28,
      cmMin: 12,
      cmMax: LARGEUR_FILM_CM,
      hauteurMaxCm: 40,
      centreX: 0.5,
      hautY: 0.33,
      aide: "Sous la capuche, entre les omoplates.",
    },
  ],

  // Un tote bag n'a qu'une face utile. Le packshot montre les anses au-dessus
  // du sac : la boite mesuree les inclut, donc les reperes verticaux partent
  // de plus haut que le corps du sac, qui commence vers 44 % de la boite.
  totebag: [
    {
      id: "grand-centre",
      nom: "Grand centré",
      vue: "face",
      cmDefaut: 24,
      cmMin: 14,
      cmMax: 28,
      hauteurMaxCm: 30,
      centreX: 0.5,
      hautY: 0.54,
      aide: "Le format qui remplit la face du sac.",
    },
    {
      id: "petit-centre",
      nom: "Petit centré",
      vue: "face",
      cmDefaut: 12,
      cmMin: 8,
      cmMax: 18,
      hauteurMaxCm: 20,
      centreX: 0.5,
      hautY: 0.56,
      aide: "Format discret, haut de la face.",
    },
  ],

  // Une casquette se marque sur trois zones etroites : le panneau avant, un
  // cote, et l'arriere au-dessus de la fermeture. Aucun grand format : la
  // largeur utile d'un panneau plafonne vers 11 cm, et la hauteur bien avant.
  casquette: [
    {
      id: "face-avant",
      nom: "Face avant",
      vue: "face",
      cmDefaut: 8,
      cmMin: 4,
      cmMax: 11,
      // Mesure sur le packshot KP162 : la couture calotte-visiere tombe a
      // 58 % de la hauteur, et la calotte n'est assez large qu'a partir de
      // 22 %. Reste une bande d'environ 5 cm, qui borne la hauteur.
      hauteurMaxCm: 5,
      centreX: 0.5,
      hautY: 0.39,
      ancrage: "centre",
      aide: "Panneau avant, entre la couture et la visière.",
    },
    {
      id: "cote",
      nom: "Côté",
      vue: "profil",
      cmDefaut: 5,
      cmMin: 3,
      cmMax: 7,
      // Le panneau lateral est court : la hauteur limite avant la couture.
      hauteurMaxCm: 3.5,
      // Bas du panneau, juste au-dessus de la couture de visiere : c'est la
      // que se pose un marquage de cote, pas au milieu de la calotte.
      centreX: 0.54,
      hautY: 0.68,
      ancrage: "centre",
      aide: "Petit marquage sur le panneau latéral.",
    },
    {
      id: "arriere",
      nom: "Arrière",
      vue: "dos",
      cmDefaut: 6,
      cmMin: 3,
      cmMax: 8,
      // Juste au-dessus de la fermeture, qui ouvre le bas du panneau arriere
      // vers 58 % de la hauteur.
      hauteurMaxCm: 3.5,
      centreX: 0.5,
      hautY: 0.52,
      ancrage: "centre",
      aide: "Au-dessus de la fermeture.",
    },
  ],
};

/** A quelle famille de geometrie se rattache un article du catalogue. */
export function familleDe(product: Product): Famille {
  if (product.category === "Casquettes") return "casquette";
  if (product.category === "Sacs") return "totebag";
  if (product.category === "Polos") return "polo";
  if (product.category === "Sweats col rond") return "sweat";
  if (product.category === "Sweats à capuche") return "hoodie";
  return "tshirt";
}

export const emplacementsDe = (famille: Famille) =>
  EMPLACEMENTS_PAR_FAMILLE[famille];

/**
 * Largeur reelle du vetement a plat, en centimetres, pour convertir les
 * centimetres du marquage en pixels sur le packshot.
 *
 * C'est une valeur d'atelier moyenne, pas une mesure par taille : l'apercu
 * sert a se figurer une proportion, le BAT reste la reference.
 */
export function largeurVetementCm(product: Product): number {
  const famille = familleDe(product);
  if (famille === "casquette") return 18;
  // 38 cm de large, mesure du fabricant.
  if (famille === "totebag") return 38;
  if (product.cut.toLowerCase().includes("oversize")) return 58;
  if (famille === "hoodie" || famille === "sweat") return 56;
  if (famille === "polo") return 54;
  return 52;
}

/** Bords du vetement sur le packshot. */
export interface BoiteVetement {
  x: number;
  y: number;
  largeur: number;
  hauteur: number;
}

/**
 * Mesure le vetement dans son cadre.
 *
 * Les packshots Toptex sont detoures : la boite des pixels non transparents
 * est exactement le vetement. Ceux de Velilla sont aplatis sur du blanc, la
 * transparence n'apprend alors rien et on retombe sur les pixels non blancs.
 * Sans ce second passage, une casquette qui n'occupe que le tiers de son
 * cadre serait mesuree comme si elle le remplissait, et le marquage sortirait
 * a une taille absurde.
 */
export function mesurerVetement(image: HTMLImageElement): BoiteVetement {
  const echelle = Math.min(1, 400 / image.naturalWidth);
  const l = Math.max(1, Math.round(image.naturalWidth * echelle));
  const h = Math.max(1, Math.round(image.naturalHeight * echelle));

  const entier = {
    x: 0,
    y: 0,
    largeur: image.naturalWidth,
    hauteur: image.naturalHeight,
  };

  const canvas = document.createElement("canvas");
  canvas.width = l;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return entier;

  ctx.drawImage(image, 0, 0, l, h);
  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, l, h).data;
  } catch {
    // Canvas teinte : l'image ne passe pas par notre relais.
    return entier;
  }

  const boite = (garde: (i: number) => boolean): BoiteVetement | null => {
    let x0 = l,
      y0 = h,
      x1 = -1,
      y1 = -1;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < l; x++) {
        if (garde((y * l + x) * 4)) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
    }
    if (x1 < 0) return null;
    const r = 1 / echelle;
    return {
      x: x0 * r,
      y: y0 * r,
      largeur: (x1 - x0 + 1) * r,
      hauteur: (y1 - y0 + 1) * r,
    };
  };

  const parAlpha = boite((i) => data[i + 3] > 16);
  // Une boite pleine cadre signale une image opaque : la transparence n'a rien
  // delimite, on repasse sur le contraste avec le fond blanc.
  const pleinCadre =
    parAlpha !== null &&
    parAlpha.largeur >= image.naturalWidth - 2 &&
    parAlpha.hauteur >= image.naturalHeight - 2;

  if (parAlpha && !pleinCadre) return parAlpha;

  const parBlanc = boite(
    (i) =>
      data[i + 3] > 16 &&
      (data[i] < 244 || data[i + 1] < 244 || data[i + 2] < 244)
  );
  return parBlanc ?? parAlpha ?? entier;
}
