// Importe une selection de modeles Roly (groupe Gorfactory) dans le catalogue.
//
//   node scripts/import-roly.mjs
//
// Roly publie tout son catalogue en acces libre, sans compte :
//   - catalog_info.json : modeles, coloris, tailles, photos ;
//   - locale/fr.json    : noms, descriptions et compositions en francais.
// Le script lit ces deux fichiers, verifie qu'une photo existe pour chaque
// vue d'un coloris, puis reecrit src/data/products-roly.ts.
//
// Ce qui ne vient pas de Roly, et se regle dans SELECTION ci-dessous :
//   - la categorie du site et un intitule lisible ;
//   - la coupe, resumee pour la fiche ;
//   - les prix de vente. Ils sont alignes sur ceux des references deja au
//     catalogue les plus proches (categorie, grammage, coupe). Les prix
//     d'achat restent hors du depot (tarif confidentiel Roly), cf.
//     MAJORATION_MIN.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const STATIC = "https://static.gorfactory.es";
const CATALOGUE = `${STATIC}/s4hana-b2b/Catalog/catalog_info.json`;
const LOCALE = `${STATIC}/s4hana-b2b/locale/fr.json`;

// ref Roly -> fiche du site. `comme` indique la reference du catalogue dont
// la grille de prix est reprise.
const SELECTION = {
  CA6560: { category: "T-shirts Oversize", name: "BULL - T-shirt épais oversize", cut: "Oversize, col rond côtelé 2x1, poignets larges", comme: "NS330", prices: { solo: 18, team: 16, bestof: 14 } },
  CA6561: { category: "T-shirts Oversize", name: "CHOW - T-shirt oversize lourd", cut: "Oversize, col rond à larges côtes", comme: "NS332", prices: { solo: 20, team: 17, bestof: 15 } },
  CA6502: { category: "T-shirts Urbains", name: "DOGO PREMIUM - T-shirt manches courtes 165", cut: "Regular, coutures latérales, col rond côtelé 1x1", comme: "MK023CV", prices: { solo: 10, team: 8, bestof: 7 } },
  CA6424: { category: "T-shirts Urbains", name: "ATOMIC 150 - T-shirt manches courtes", cut: "Regular tubulaire, col rond côtelé 1x1", comme: "MK023CV", prices: { solo: 10, team: 8, bestof: 7 } },
  CA2200: { category: "T-shirts Urbains", name: "CORGI - T-shirt effet délavé", cut: "Regular, coton peigné délavé", comme: "MK023CV", prices: { solo: 10, team: 8, bestof: 7 } },
  CA6401: { category: "T-shirts Techniques", name: "MONACO - T-shirt technique unisexe", cut: "Manches raglan, dos en mesh respirant", comme: "MK520V", prices: { solo: 10, team: 8, bestof: 7 } },
  CA0416: { category: "T-shirts Techniques", name: "SEPANG - T-shirt technique raglan", cut: "Manches raglan, coutures contrastées", comme: "MK520V", prices: { solo: 10, team: 8, bestof: 7 } },
  PO6607: { category: "Polos", name: "CENTAURO PREMIUM - Polo anti-bouloche", cut: "Regular, poche poitrine, patte 3 boutons", comme: "MK215CV", prices: { solo: 14, team: 12, bestof: 11 } },
  PO6629: { category: "Polos", name: "MONTREAL - Polo coton peigné 230", cut: "Regular, point piqué, patte 3 boutons", comme: "MK215CV", prices: { solo: 14, team: 12, bestof: 11 } },
  SU6702: { category: "Sweats à capuche", name: "OTTO - Sweat à capuche oversize", cut: "Oversize, capuche doublée, poches latérales", comme: "NS408", prices: { solo: 42, team: 37, bestof: 34 } },
  SU1074: { category: "Sweats à capuche", name: "VINSON - Sweat à capuche coton bio", cut: "Regular, manches raglan, capuche doublée", comme: "NS444", prices: { solo: 32, team: 29, bestof: 27 } },
  SU2204: { category: "Sweats à capuche", name: "KENIA - Sweat à capuche délavé", cut: "Regular, coton lavé non gratté", comme: "IB402", prices: { solo: 26, team: 24, bestof: 22 } },
  SU1071: { category: "Sweats col rond", name: "BATIAN - Sweat col rond coton bio", cut: "Regular, col rond, bord-côte 2x1", comme: "NS443", prices: { solo: 34, team: 30, bestof: 28 } },
  SU2203: { category: "Sweats col rond", name: "JAYA - Sweat col rond délavé", cut: "Regular, coton lavé non gratté", comme: "IB400", prices: { solo: 25, team: 23, bestof: 21 } },
};

// Roly interdit d'afficher un prix inferieur a son tarif confidentiel majore
// de 30 %. Ce tarif reste hors du depot : s'il figure dans le fichier local
// scripts/pricing.config.json (textiles.<ref>.achatHT), le script refuse
// d'ecrire une grille qui passerait sous ce seuil.
const MAJORATION_MIN = 1.3;
const CONFIG_PRIX = join(ROOT, "scripts", "pricing.config.json");
const achats = existsSync(CONFIG_PRIX)
  ? JSON.parse(readFileSync(CONFIG_PRIX, "utf8")).textiles ?? {}
  : {};

// Vues des packshots Roly, dans l'ordre attendu par l'apercu : face, dos, profil.
const VUES = [1, 2, 7];

const TAILLES = { XXL: "2XL", XXXL: "3XL", XXXXL: "4XL", XXXXXL: "5XL" };

// Pictogrammes de certification Roly -> libelle affiche.
const CERTIFS = [
  [/OK0446|OEKO/i, "OEKO-TEX"],
  [/OCS/i, "OCS"],
  [/GRS/i, "GRS"],
  [/GOTS/i, "GOTS"],
];

const propre = (s = "") =>
  s.replace(/ /g, " ").replace(/\r/g, "").replace(/[ \t]+/g, " ").trim();

const capitaliser = (s) => {
  const bas = propre(s).toLocaleLowerCase("fr");
  return bas.charAt(0).toLocaleUpperCase("fr") + bas.slice(1);
};

const pastille = (hex) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="${hex}"/></svg>`
  );

async function json(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url} : HTTP ${r.status}`);
  return r.json();
}

async function existe(url) {
  for (let essai = 0; essai < 3; essai++) {
    try {
      const r = await fetch(url, { method: "HEAD" });
      return r.ok;
    } catch {
      await new Promise((ok) => setTimeout(ok, 500 * (essai + 1)));
    }
  }
  return false;
}

console.log("Lecture du catalogue Roly...");
const [info, fr] = await Promise.all([json(CATALOGUE), json(LOCALE)]);

const produits = [];
for (const [ref, fiche] of Object.entries(SELECTION)) {
  const modele = info.MODELS[ref];
  const texte = fr.MODELS[ref];
  if (!modele || !texte) throw new Error(`${ref} absent du catalogue Roly`);

  const achat = achats[ref]?.achatHT;
  const seuil = achat ? achat * MAJORATION_MIN : 0;
  for (const [palier, prix] of Object.entries(fiche.prices)) {
    if (prix < seuil) {
      throw new Error(
        `${ref} ${palier} : ${prix} € est sous le minimum Roly (${seuil.toFixed(2)} €)`
      );
    }
  }

  const id = modele.IDSAP;
  const composition = propre(texte.COMPOSITION).split("\n").map(propre).filter(Boolean);
  const grammage =
    composition.join(" ").match(/(\d+)\s*g\/m²/)?.[1] ?? (modele.GRAMS || null);

  // La composition Roly melange matiere et grammage : on retire le grammage,
  // affiche a part, et la ponctuation qui l'entourait.
  const material = composition
    .map((l) =>
      l
        .replace(/,?\s*\d+\s*g\/m²\.?/g, "")
        // Codes coloris internes (« gris chiné 58 : ») : sans sens pour le client.
        .replace(/\s+\d{2,3}\s*:/g, " :")
        .replace(/[.,\s]+$/, "")
    )
    // Une ligne qui ne portait que des grammages par coloris n'a plus que
    // ses intitules (« Couleur: Blanc: ») : on l'ecarte.
    .filter((l) => l && !l.endsWith(":"))
    .join(" — ");

  const sizes = Object.keys(modele.SIZES)
    .sort((a, b) => (info.SIZES[a]?.ORDEN ?? 0) - (info.SIZES[b]?.ORDEN ?? 0))
    .map((c) => fr.SIZES[c])
    .filter((t) => t && !t.includes("/")) // tailles enfant (3/4, 5/6...)
    .map((t) => TAILLES[t] ?? t);

  const codes = Object.keys(modele.COLORS).sort(
    (a, b) => (info.COLORS[a]?.ORDEN ?? 0) - (info.COLORS[b]?.ORDEN ?? 0)
  );

  const colors = [];
  for (const code of codes) {
    const vues = VUES.map(
      (n) => `${STATIC}/images/models/${id}/views/large/p_${id}_${code}_${n}_1.jpg`
    );
    const presentes = await Promise.all(vues.map(existe));
    // Sans face, le coloris ne peut ni s'afficher ni servir a l'apercu.
    if (!presentes[0]) {
      console.log(`  ${ref} ${code} : pas de packshot, coloris ignore`);
      continue;
    }
    const images = vues.filter((_, i) => presentes[i]);
    const photo = modele.COLORS[code]?.IMG;
    if (photo) images.push(`${STATIC}${photo}`);
    const hex = info.COLORS[code]?.HEXCODE;
    colors.push({
      name: capitaliser(fr.COLORS[code] ?? code),
      slug: code,
      swatch: hex ? pastille(hex) : `${STATIC}${modele.COLORS[code].MINIATURE}`,
      images,
    });
  }

  const icones = (modele.ICONS ?? [])
    .map((i) => info.ICONS[String(i)])
    .filter((i) => i?.CERTIFICATE)
    .map((i) => i.URL);
  const certifications = CERTIFS.filter(([motif]) =>
    icones.some((u) => motif.test(u))
  ).map(([, nom]) => nom);

  // Photos portees (mannequin, format portrait) : la fiche les affiche avant
  // qu'un coloris soit choisi, recadrees comme celles de Toptex.
  const portees = Object.values(modele.MEDIA?.ADULT ?? {})
    .flatMap((vues) => Object.values(vues).flatMap((v) => Object.values(v)))
    .map((v) => `${STATIC}${v.IMG}`);

  produits.push({
    ref,
    name: fiche.name,
    brand: "Roly",
    category: fiche.category,
    description: propre(texte.DESCRIPTION).replace(/\n+/g, " "),
    material,
    grammage: grammage ? `${grammage} g/m²` : "Non communiqué",
    cut: fiche.cut,
    sizes,
    colors,
    certifications,
    defaultImages: portees.length
      ? portees
      : // Le noir ressort mieux que le blanc sur le fond sombre du site.
        (colors.find((c) => c.slug === "02") ?? colors[0]).images,
    price: `À partir de ${fiche.prices.bestof} €/pièce`,
    prices: fiche.prices,
  });
  console.log(`  ${ref} ${texte.NAME} : ${colors.length} coloris, ${sizes.length} tailles`);
}

const sortie = join(ROOT, "src", "data", "products-roly.ts");
writeFileSync(
  sortie,
  `// Genere par scripts/import-roly.mjs a partir du catalogue public Roly.
// Ne pas modifier a la main : relancer le script.

import type { Product } from "./products";

export const rolyProducts: Product[] = ${JSON.stringify(produits, null, 2)};
`
);
console.log(`\n${produits.length} modeles ecrits dans src/data/products-roly.ts`);
