// Importe le catalogue Roly (groupe Gorfactory) dans le site.
//
//   node scripts/import-roly.mjs
//
// Roly publie tout son catalogue en acces libre, sans compte :
//   - catalog_info.json : modeles, coloris, tailles, photos ;
//   - locale/fr.json    : noms, descriptions et compositions en francais.
// Le script prend tous les modeles de la marque Roly, les range dans les
// categories du site, verifie quelles vues existent pour chaque coloris, puis
// reecrit src/data/products-roly.ts.
//
// Prix de vente. Le tarif d'achat Roly est confidentiel et reste hors du depot,
// dans scripts/roly-achats.json (cf. .gitignore). Sans ce fichier le script
// s'arrete : il effacerait sinon tous les prix.
//   - les modeles de SELECTION gardent la grille fixee a la main ;
//   - les autres : achat x COEFS, arrondi a l'euro superieur, PRIX_MIN au
//     minimum ;
//   - sans tarif d'achat (workwear, casquettes, sacs...) : « Prix sur devis ».
// Roly interdit d'afficher moins que son tarif majore de 30 % : le script
// rehausse toute grille qui passerait dessous, grandes tailles comprises.
//
// Pour retirer un modele du site, ajouter sa reference a EXCLUS.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const STATIC = "https://static.gorfactory.es";
const CATALOGUE = `${STATIC}/s4hana-b2b/Catalog/catalog_info.json`;
const LOCALE = `${STATIC}/s4hana-b2b/locale/fr.json`;
const MODELS = `${STATIC}/images/models`;

const COEFS = { solo: 3.1, team: 2.7, bestof: 2.4 };
const PRIX_MIN = 5;
const MAJORATION_MIN = 1.3;

// Familles Roly qui ne sont pas des articles a personnaliser : catalogue
// papier et goodies de la marque, cintres, rouleaux de tissu.
const FAMILLES_EXCLUES = new Set(["MA", "PE", "TJ"]);

// References retirees a la demande.
const EXCLUS = new Set([]);

// Fiches reglees a la main : intitule, coupe et grille alignee sur la
// reference du catalogue la plus proche (`comme`).
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

// Famille Roly -> categorie du site. Les t-shirts et les sweats se departagent
// ensuite sur la description (cf. categorieDe).
const CATEGORIES = {
  CA: "T-shirts Urbains", BD: "T-shirts Urbains", RI: "T-shirts Urbains",
  PO: "Polos",
  SU: "Sweats col rond",
  GO: "Casquettes",
  BO: "Sacs", MO: "Sacs",
  CQ: "Vestes & parkas", PK: "Vestes & parkas", SS: "Vestes & parkas",
  CB: "Vestes & parkas", CV: "Vestes & parkas",
  RA: "Polaires & gilets", CC: "Polaires & gilets", SM: "Polaires & gilets",
  CG: "Polaires & gilets", JE: "Polaires & gilets",
  PA: "Pantalons & shorts", BE: "Pantalons & shorts", PC: "Pantalons & shorts",
  LG: "Pantalons & shorts", FA: "Pantalons & shorts",
  CM: "Chemises",
  CJ: "Sport", CH: "Sport", PD: "Sport", RD: "Sport", PT: "Sport", BN: "Sport",
  HV: "Workwear", FR: "Workwear", BM: "Workwear", DE: "Workwear",
  BA: "Workwear", ZL: "Workwear", SA: "Workwear",
  ZS: "Chaussures",
  GR: "Accessoires", BR: "Accessoires", CE: "Accessoires", PN: "Accessoires",
  CP: "Accessoires", TW: "Accessoires",
};

function categorieDe(modele, description) {
  const d = description.toLowerCase();
  // Les familles Roly melangent mode et travail (gilets, pantalons...).
  if (/haute visibilit|de travail|ignifug|laboratoire/.test(d)) return "Workwear";
  if (/^sac\b/.test(d)) return "Sacs";
  if (modele.FAMILY === "SU" && /^veste/.test(d)) return "Vestes & parkas";
  if (modele.FAMILY === "CA") {
    if (!/^débardeur/.test(d) && /surdimensionn|oversize|\bample\b/.test(d))
      return "T-shirts Oversize";
    if (/techni|respirant|control dry|polyester/.test(d)) return "T-shirts Techniques";
  }
  if (modele.FAMILY === "SU" && /capuche/.test(d)) return "Sweats à capuche";
  return CATEGORIES[modele.FAMILY];
}

const GENRES = { HO: "Homme", MU: "Femme", UN: "Unisexe" };

// Vues des packshots Roly, dans l'ordre attendu par l'apercu : face, dos, profil.
const VUES = [1, 2, 7];

const TAILLES = { XXL: "2XL", XXXL: "3XL", XXXXL: "4XL", XXXXXL: "5XL" };
const UNIQUE = /^(TAILLE UNIQUE( ADULTE)?|UNIQUE|ADULTO)$/i;

// Taille enfant : age (« 3/4 », « 6 ANS », « 12 MOIS ») ou mention explicite.
// Les pointures (« 36/39 ») et tailles de pantalon (38, 40...) n'en sont pas.
function estEnfant(t) {
  if (/\b(ANS|MOIS|MESES|ENFANT|JR)\b/i.test(t)) return true;
  const age = t.match(/^(\d{1,2})(?:\/(\d{1,2}))?$/);
  return Boolean(age && Number(age[2] ?? age[1]) <= 16);
}

function libelleTaille(t) {
  if (UNIQUE.test(t)) return "Taille unique";
  return t
    .replace(/^Size\s+/i, "")
    .replace(/\bX{2,5}L\b/g, (x) => TAILLES[x] ?? x)
    .replace(/\bMESES\b/i, "mois")
    .replace(/\bMOIS\b/, "mois")
    .replace(/\bANS\b/, "ans")
    .replace(/^(\d{1,2}\/\d{1,2})$/, (a) => (estEnfant(a) ? `${a} ans` : a));
}

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

const nomCourt = (s) => propre(s).toUpperCase();

// Ce qu'est l'article, d'apres la premiere phrase de la description. Trop
// longue, elle est coupee avant ses complements (« Casquette 5 panneaux en
// polyester avec... » -> « Casquette 5 panneaux »).
function natureDe(description) {
  let n = description.split(/[.:·]/)[0].trim();
  if (n.length > 50) {
    const coupes = [",", " avec ", " dotée", " doté ", " en ", " pour ", " sans ", " qui "]
      .map((c) => n.indexOf(c))
      .filter((i) => i >= 6);
    if (coupes.length) n = n.slice(0, Math.min(...coupes));
  }
  return n.length >= 3 && n.length <= 60 ? n : "";
}

// --- Sources -----------------------------------------------------------------

const FICHIER_ACHATS = join(ROOT, "scripts", "roly-achats.json");
if (!existsSync(FICHIER_ACHATS)) {
  console.error(
    "scripts/roly-achats.json introuvable : il contient le tarif d'achat Roly\n" +
      "(confidentiel, hors depot). Sans lui, tous les prix seraient effaces."
  );
  process.exit(1);
}
const achats = JSON.parse(readFileSync(FICHIER_ACHATS, "utf8"));

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

// Execute les verifications par lots : plusieurs milliers de requetes HEAD.
async function enParallele(taches, n = 24) {
  const resultats = new Array(taches.length);
  let suivant = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (suivant < taches.length) {
        const i = suivant++;
        resultats[i] = await taches[i]();
      }
    })
  );
  return resultats;
}

// --- Prix --------------------------------------------------------------------

function grille(ref, idsap) {
  const tarif = achats[idsap];
  const fixe = SELECTION[ref]?.prices;
  if (!tarif) return fixe ?? null;

  const plancher = Math.ceil(tarif.achatMax * MAJORATION_MIN);
  const prix = fixe
    ? { ...fixe }
    : Object.fromEntries(
        Object.entries(COEFS).map(([p, c]) => [
          p,
          Math.max(PRIX_MIN, Math.ceil(tarif.achat * c)),
        ])
      );
  prix.bestof = Math.max(prix.bestof, plancher);
  prix.team = Math.max(prix.team, prix.bestof);
  prix.solo = Math.max(prix.solo, prix.team);
  if (fixe && prix.bestof !== fixe.bestof) {
    console.log(`  ${ref} : grille rehaussee au minimum Roly (${plancher} €)`);
  }
  return { solo: prix.solo, team: prix.team, bestof: prix.bestof };
}

// --- Import ------------------------------------------------------------------

console.log("Lecture du catalogue Roly...");
const [info, fr] = await Promise.all([json(CATALOGUE), json(LOCALE)]);

const refs = Object.keys(info.MODELS)
  .filter((ref) => {
    const m = info.MODELS[ref];
    return (
      m.BRANDS?.ROL &&
      !FAMILLES_EXCLUES.has(m.FAMILY) &&
      !EXCLUS.has(ref) &&
      fr.MODELS[ref]
    );
  })
  .sort();

// Toutes les vues a verifier, en une passe.
const aVerifier = [];
for (const ref of refs) {
  const m = info.MODELS[ref];
  const id = m.IDSAP;
  for (const code of Object.keys(m.COLORS)) {
    if (!m.MEDIA?.VIEWS?.[code]) continue; // pas de face publiee
    for (const v of VUES.slice(1)) {
      aVerifier.push({
        cle: `${ref}|${code}|${v}`,
        url: `${MODELS}/${id}/views/large/p_${id}_${code}_${v}_1.jpg`,
      });
    }
  }
}
console.log(`${refs.length} modeles, ${aVerifier.length} vues a verifier...`);
const presentes = new Set();
const verdicts = await enParallele(aVerifier.map((t) => () => existe(t.url)));
aVerifier.forEach((t, i) => verdicts[i] && presentes.add(t.cle));

const produits = [];
const sansCategorie = [];
for (const ref of refs) {
  const modele = info.MODELS[ref];
  const texte = fr.MODELS[ref];
  const fiche = SELECTION[ref] ?? {};
  const id = modele.IDSAP;
  const description = propre(texte.DESCRIPTION)
    .replace(/\n+/g, " ")
    .replace(/\s*·\s*/g, " · ")
    .replace(/^·\s*/, "")
    .trim();

  const category = fiche.category ?? categorieDe(modele, description);
  if (!category) {
    sansCategorie.push(`${ref} (famille ${modele.FAMILY})`);
    continue;
  }

  const composition = propre(texte.COMPOSITION).split("\n").map(propre).filter(Boolean);
  const grammage =
    composition.join(" ").match(/(\d+)\s*g\/m²/)?.[1] ?? (modele.GRAMS || null);

  // La composition Roly melange matiere et grammage : on retire le grammage,
  // affiche a part, et la ponctuation qui l'entourait.
  const material =
    composition
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
      .join(" — ") || "Non communiquée";

  const libelles = [
    ...new Set(
      Object.keys(modele.SIZES)
        .sort((a, b) => (info.SIZES[a]?.ORDEN ?? 0) - (info.SIZES[b]?.ORDEN ?? 0))
        .map((c) => propre(fr.SIZES[c] ?? "").replace(/\s*\(p\d\)$/i, ""))
        .filter((t) => t && t !== "NOT FOUND")
    ),
  ];
  // Un modele decline en adulte et en enfant n'affiche que l'adulte : la
  // fiche enfant, quand elle existe, est une reference a part chez Roly.
  const adultes = libelles.filter((t) => !estEnfant(t));
  const sizes = [...new Set((adultes.length ? adultes : libelles).map(libelleTaille))];

  const codes = Object.keys(modele.COLORS).sort(
    (a, b) => (info.COLORS[a]?.ORDEN ?? 0) - (info.COLORS[b]?.ORDEN ?? 0)
  );
  const colors = codes.map((code) => {
    const c = { name: capitaliser(fr.COLORS[code] ?? code), slug: code };
    const hex = info.COLORS[code]?.HEXCODE;
    if (hex) c.hex = hex;
    else if (modele.COLORS[code]?.MINIATURE)
      c.swatch = `${STATIC}${modele.COLORS[code].MINIATURE}`;
    if (modele.MEDIA?.VIEWS?.[code]) {
      const vues = VUES.filter((v) => v === 1 || presentes.has(`${ref}|${code}|${v}`));
      if (vues.length !== VUES.length) c.views = vues;
    } else {
      c.views = [];
      const photo = modele.COLORS[code]?.IMG;
      if (photo) c.photo = photo.replace("/images/models/", "");
    }
    return c;
  });

  // Photos portees (mannequin, format portrait) : la fiche les affiche avant
  // qu'un coloris soit choisi, recadrees comme celles de Toptex.
  const portees = Object.values(modele.MEDIA?.ADULT ?? {})
    .flatMap((vues) => Object.values(vues).flatMap((v) => Object.values(v)))
    .map((v) => `${STATIC}${v.IMG}`)
    .slice(0, 1);
  const vitrine = colors.find((c) => c.slug === "02") ?? colors[0];
  const defaultImages = portees.length
    ? portees
    : vitrine
      ? vitrine.views?.length === 0
        ? vitrine.photo
          ? [`${MODELS}/${vitrine.photo}`]
          : []
        : [`${MODELS}/${id}/views/large/p_${id}_${vitrine.slug}_1_1.jpg`]
      : [];
  if (!defaultImages.length) {
    console.log(`  ${ref} : aucune photo publiee, ignore`);
    continue;
  }

  const icones = (modele.ICONS ?? [])
    .map((i) => info.ICONS[String(i)])
    .filter((i) => i?.CERTIFICATE)
    .map((i) => i.URL);
  const certifications = CERTIFS.filter(([motif]) =>
    icones.some((u) => motif.test(u))
  ).map(([, nom]) => nom);

  // Intitule : nom Roly + premiere proposition de la description, qui dit ce
  // qu'est l'article (« T-shirt tubulaire à manches courtes »).
  const name =
    fiche.name ??
    `${nomCourt(texte.NAME)} - ${
      natureDe(description) || capitaliser(fr.FAMILIES[modele.FAMILY] ?? "")
    }`;

  const genre = GENRES[modele.GENDER] ?? "Unisexe";
  const oversize = /surdimensionn|oversize/i.test(description);
  const cut =
    fiche.cut ??
    [oversize ? "Oversize" : null, adultes.length ? genre : "Enfant"]
      .filter(Boolean)
      .join(", ");

  const prices = grille(ref, id);
  const produit = {
    ref,
    name,
    brand: "Roly",
    category,
    description,
    material,
    grammage: grammage ? `${grammage} g/m²` : "Non communiqué",
    cut,
    sizes,
    colors,
    certifications,
    defaultImages,
    price: prices ? `À partir de ${prices.bestof} €/pièce` : "Prix sur devis",
    packshotSource: "roly",
  };
  if (prices) produit.prices = prices;
  produits.push(produit);
}

if (sansCategorie.length) {
  console.log(`\nSans categorie, ignores : ${sansCategorie.join(", ")}`);
}

const parCategorie = {};
for (const p of produits) parCategorie[p.category] = (parCategorie[p.category] ?? 0) + 1;
console.log("\nPar categorie :");
for (const [c, n] of Object.entries(parCategorie)) console.log(`  ${c.padEnd(22)} ${n}`);
console.log(`  avec prix : ${produits.filter((p) => p.prices).length}, sur devis : ${produits.filter((p) => !p.prices).length}`);

const sortie = join(ROOT, "src", "data", "products-roly.ts");
writeFileSync(
  sortie,
  `// Genere par scripts/import-roly.mjs a partir du catalogue public Roly.
// Ne pas modifier a la main : relancer le script.

import type { Product } from "./products";

export const rolyProducts: Product[] = ${JSON.stringify(produits)};
`
);
console.log(`\n${produits.length} modeles ecrits dans src/data/products-roly.ts`);
