// Genere des mockups produit : un visuel incruste sur le t-shirt NS332.
//
//   node scripts/build-mockups.mjs <dossier-des-visuels> [dossier-sortie]
//
// Chaque PNG a fond transparent du dossier d'entree ressort en deux versions,
// sur t-shirt blanc et sur t-shirt noir. Les packshots viennent du CDN Toptex
// et sont mis en cache localement.
//
// Le placement est calcule a partir du vetement lui-meme : on lit le canal
// alpha du packshot pour trouver ses bords, puis on centre le visuel dans la
// zone de poitrine. Le rendu reste donc correct meme si Toptex change de
// cadrage.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, resolve, basename, extname } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const CACHE = join(ROOT, "node_modules", ".cache", "mockups");
mkdirSync(CACHE, { recursive: true });

const SOURCE = process.argv[2];
const SORTIE = resolve(process.argv[3] ?? join(ROOT, "public", "mockups"));

if (!SOURCE || !existsSync(SOURCE)) {
  console.error("Usage : node scripts/build-mockups.mjs <dossier-des-visuels> [sortie]");
  process.exit(1);
}
mkdirSync(SORTIE, { recursive: true });

// Coloris retenus pour la boutique.
const COLORIS = [
  { slug: "WHITE", nom: "blanc", sombre: false },
  { slug: "BLACK", nom: "noir", sombre: true },
];

// Un visuel sombre disparait sur un textile noir. Convention : deposer a cote
// de "mon-visuel.png" un fichier "mon-visuel@clair.png", qui sera utilise sur
// les coloris sombres. Sans lui, le meme fichier sert pour les deux.
function fichierPour(nom, ext, sombre) {
  const clair = join(SOURCE, `${nom}@clair${ext}`);
  return sombre && existsSync(clair) ? clair : join(SOURCE, `${nom}${ext}`);
}

// Zone d'impression, en fraction de la largeur et de la hauteur du vetement.
// Un flocage poitrine occupe environ 40 % de la largeur, place sous le col.
const ZONE = { largeur: 0.42, hautDepuisEpaule: 0.22 };

for (const c of COLORIS) {
  const dest = join(CACHE, `NS332_${c.slug}.png`);
  if (!existsSync(dest)) {
    execFileSync("curl", ["-sL", "--max-time", "60", "-o", dest,
      `https://cdn.toptex.com/packshots/PS_NS332_${c.slug}.png`]);
  }
}

const visuels = readdirSync(SOURCE).filter(
  (f) =>
    [".png", ".webp"].includes(extname(f).toLowerCase()) &&
    // les variantes claires ne sont pas des visuels a part entiere
    !basename(f, extname(f)).endsWith("@clair")
);

if (!visuels.length) {
  console.error(`Aucun PNG trouve dans ${SOURCE}.`);
  console.error("Les visuels doivent etre en PNG a fond transparent.");
  process.exit(1);
}

const script = `
import sys, json
from PIL import Image

packshot_path, visuel_path, sortie, largeur_ratio, haut_ratio = sys.argv[1:6]
largeur_ratio, haut_ratio = float(largeur_ratio), float(haut_ratio)

shirt = Image.open(packshot_path).convert("RGBA")
# Les bords du vetement, lus dans le canal alpha : le packshot est detoure,
# donc la boite englobante non transparente est exactement le t-shirt.
bbox = shirt.split()[3].getbbox()
gx0, gy0, gx1, gy1 = bbox
gw, gh = gx1 - gx0, gy1 - gy0

art = Image.open(visuel_path).convert("RGBA")
cible_w = int(gw * largeur_ratio)
cible_h = int(art.height * cible_w / art.width)
art = art.resize((cible_w, cible_h), Image.LANCZOS)

x = gx0 + (gw - cible_w) // 2
y = gy0 + int(gh * haut_ratio)

calque = Image.new("RGBA", shirt.size, (0, 0, 0, 0))
calque.paste(art, (x, y), art)
rendu = Image.alpha_composite(shirt, calque)

# Fond neutre clair : un PNG transparent s'affiche mal dans une fiche produit.
fond = Image.new("RGBA", rendu.size, (245, 245, 245, 255))
fond.alpha_composite(rendu)
fond.convert("RGB").save(sortie, "JPEG", quality=88, optimize=True)
print(json.dumps({"vetement": [gw, gh], "visuel": [cible_w, cible_h]}))
`;

console.log(`${visuels.length} visuel(s), ${COLORIS.length} coloris\n`);
let n = 0;

for (const v of visuels) {
  const nom = basename(v, extname(v));
  for (const c of COLORIS) {
    const sortie = join(SORTIE, `${nom}-${c.nom}.jpg`);
    const out = execFileSync(
      "python3",
      ["-c", script, join(CACHE, `NS332_${c.slug}.png`),
       fichierPour(nom, extname(v), c.sombre), sortie,
       String(ZONE.largeur), String(ZONE.hautDepuisEpaule)],
      { encoding: "utf8" }
    ).trim();
    const d = JSON.parse(out);
    const variante = c.sombre && existsSync(join(SOURCE, `${nom}@clair${extname(v)}`))
      ? " (variante claire)" : "";
    console.log(`  ${nom} sur ${c.nom.padEnd(6)} -> ${d.visuel[0]}x${d.visuel[1]} px${variante}`);
    n++;
  }
}

console.log(`\n${n} mockups dans ${SORTIE}`);
