// Importe des photos d'atelier et les range par coloris et par vue.
//
//   node scripts/import-photos.mjs <reference> <dossier-des-photos>
//
// Les fournisseurs Velilla et Mukua ne publient qu'une photo de groupe pour
// toute une reference : les pastilles de couleur du catalogue ne changent
// alors rien. Photographier chaque coloris a l'atelier resout le probleme,
// mais il faut ensuite rattacher chaque fichier au bon coloris et a la bonne
// vue. Ce script s'en charge, sans exiger de nommer les fichiers.
//
//   coloris : la teinte du buste est comparee aux pastilles du fournisseur,
//             telles qu'elles sont declarees dans src/data/products.ts ;
//   vue     : la largeur du vetement dans le cadre departage le profil, bien
//             plus etroit, puis l'ordre de prise de vue separe face et dos.
//
// Le filigrane du fabricant est efface au passage : il gene doublement, a
// l'ecran et dans la detection du contour du vetement, qui le prendrait pour
// une partie du textile et decalerait tous les marquages.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const [REF, SOURCE] = process.argv.slice(2);

if (!REF || !SOURCE || !existsSync(SOURCE)) {
  console.error("Usage : node scripts/import-photos.mjs <reference> <dossier>");
  process.exit(1);
}

// --- Coloris attendus, lus dans le catalogue ---------------------------------

const catalogue = readFileSync(join(ROOT, "src/data/products.ts"), "utf8");
const debut = catalogue.indexOf(`ref: "${REF}"`);
if (debut < 0) {
  console.error(`Reference ${REF} absente du catalogue.`);
  process.exit(1);
}
const bloc = catalogue.slice(debut, catalogue.indexOf("certifications:", debut));
const coloris = [...bloc.matchAll(/name: "([^"]+)",\s*\n?\s*slug: "([^"]+)"/g)].map(
  (m) => ({ nom: m[1], slug: m[2] })
);
if (!coloris.length) {
  console.error(`Aucun coloris declare pour ${REF}.`);
  process.exit(1);
}

// La pastille du fournisseur donne la teinte de reference de chaque coloris.
const CDN =
  "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails";
const CACHE = join(ROOT, "node_modules", ".cache", "pastilles");
mkdirSync(CACHE, { recursive: true });
for (const c of coloris) {
  const dest = join(CACHE, `${c.slug}.jpg`);
  if (!existsSync(dest)) {
    execFileSync("curl", ["-sL", "--max-time", "30", "-o", dest,
      `${CDN}/${c.slug}_100.jpg`]);
  }
}

const SORTIE = join(ROOT, "public", "textiles", REF.toLowerCase());
mkdirSync(SORTIE, { recursive: true });

const script = `
import sys, json, glob, os, re
import numpy as np
from PIL import Image

ref, source, sortie, cache = sys.argv[1:5]
coloris = json.loads(sys.argv[5])

# Le filigrane du fabricant occupe toujours le meme coin haut gauche.
BOITE = (0.03, 0.03, 0.38, 0.095)

def teinte_pastille(slug):
    im = Image.open(os.path.join(cache, slug + ".jpg")).convert("RGB")
    w, h = im.size
    z = im.crop((w // 3, h // 3, 2 * w // 3, 2 * h // 3))
    d = list(z.getdata()); n = len(d)
    return (sum(p[0] for p in d) // n, sum(p[1] for p in d) // n,
            sum(p[2] for p in d) // n)

pastilles = {c["slug"]: teinte_pastille(c["slug"]) for c in coloris}
noms = {c["slug"]: c["nom"] for c in coloris}

def couleur(t):
    """Le coloris le plus proche.

    Le noir et le blanc sont traites a part : un noir photographie ne descend
    jamais a zero, les eclairages le remontent vers 40, ce qui le rapproche
    numeriquement d'un marine. Ce qui les separe est l'absence de dominante,
    pas la luminosite.
    """
    mx, mn = max(t), min(t)
    sat = (mx - mn) / mx if mx else 0
    if mx < 90 and sat < 0.35 and "200" in pastilles: return "200"
    if mn > 190 and "100" in pastilles: return "100"
    autres = [s for s in pastilles if s not in ("100", "200")]
    return min(autres, key=lambda s: sum(abs(a - b) for a, b in zip(t, pastilles[s])))

def sans_filigrane(im):
    """Blanchit le logo du fabricant sans toucher au vetement.

    Seuls les pixels neutres sont effaces : un rectangle plein rognerait le
    haut d'epaule des photos cadrees un peu plus haut que les autres.
    """
    a = np.asarray(im).astype(int); H, W, _ = a.shape
    y0, y1 = int(H * BOITE[1]), int(H * BOITE[3])
    x0, x1 = int(W * BOITE[0]), int(W * BOITE[2])
    b = a[y0:y1, x0:x1]
    b[(b.max(2) - b.min(2)) < 40] = [255, 255, 255]
    a[y0:y1, x0:x1] = b
    return Image.fromarray(a.astype(np.uint8))

photos = {}
for p in sorted(glob.glob(os.path.join(source, "*"))):
    if os.path.splitext(p)[1].lower() not in (".jpg", ".jpeg", ".png", ".webp"):
        continue
    im = Image.open(p).convert("RGB"); W, H = im.size; px = im.load()
    z = im.crop((int(W * .42), int(H * .55), int(W * .58), int(H * .7)))
    d = list(z.getdata()); n = len(d)
    t = (sum(q[0] for q in d) // n, sum(q[1] for q in d) // n,
         sum(q[2] for q in d) // n)
    y = int(H * .6)
    xs = [x for x in range(W) if sum(px[x, y]) < 735]
    photos[p] = {"slug": couleur(t), "teinte": t,
                 "largeur": (max(xs) - min(xs) + 1) / W if xs else 0}

par = {}
for p, r in photos.items(): par.setdefault(r["slug"], []).append(p)
for slug, groupe in par.items():
    groupe.sort(key=lambda p: photos[p]["largeur"])
    photos[groupe[0]]["vue"] = "profil"
    # L'ordre de prise de vue departe face et dos. On trie sur le numero de
    # photo, pas sur le nom de fichier : celui-ci peut porter un prefixe
    # quelconque selon la facon dont les fichiers ont transite.
    def rang(p):
        nombres = re.findall(r"\\d+", os.path.basename(p))
        return int(nombres[-1]) if nombres else 0
    for p, v in zip(sorted(groupe[1:], key=rang), ["face", "dos"]):
        photos[p]["vue"] = v

rapport = {}
for p, r in sorted(photos.items()):
    if "vue" not in r: continue
    sans_filigrane(Image.open(p).convert("RGB")).save(
        os.path.join(sortie, f"{r['slug']}-{r['vue']}.jpg"),
        "JPEG", quality=86, optimize=True, progressive=True)
    rapport.setdefault(r["slug"], []).append(r["vue"])

print(json.dumps({"rapport": rapport, "noms": noms,
                  "attendus": [c["slug"] for c in coloris]}, ensure_ascii=False))
`;

const sortie = execFileSync(
  "python3",
  ["-c", script, REF, SOURCE, SORTIE, CACHE, JSON.stringify(coloris)],
  { encoding: "utf8" }
).trim();
const { rapport, noms, attendus } = JSON.parse(sortie.split("\n").pop());

console.log(`\n=== ${REF} ===`);
for (const slug of attendus) {
  const vues = rapport[slug];
  console.log(
    `  ${slug.padEnd(6)} ${noms[slug].padEnd(16)} ` +
      (vues ? vues.sort().join(", ") : "aucune photo")
  );
}

const manquants = attendus.filter((s) => !rapport[s]);
console.log(
  `\n${Object.keys(rapport).length}/${attendus.length} coloris couverts` +
    (manquants.length ? ` — manquent : ${manquants.join(", ")}` : "")
);

console.log("\n--- a coller dans src/data/products.ts ---\n");
for (const slug of attendus) {
  const vues = rapport[slug];
  if (!vues) continue;
  const ordre = ["face", "dos", "profil"].filter((v) => vues.includes(v));
  console.log(
    `        images: [\n` +
      ordre
        .map((v) => `          "/textiles/${REF.toLowerCase()}/${slug}-${v}.jpg",`)
        .join("\n") +
      `\n        ],   // ${noms[slug]}`
  );
}
console.log("");
