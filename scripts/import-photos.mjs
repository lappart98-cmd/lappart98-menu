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
import sys, json, glob, os, re, colorsys
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

def ecart(t, ref):
    """Distance entre une teinte photographiee et une pastille.

    Comparer les composantes brutes ne marche pas : un textile sombre ressort
    bien plus fonce en photo que sur sa pastille, si bien que la distance
    designerait la pastille la plus sombre du nuancier quelle que soit sa
    couleur. On raisonne donc en teinte, saturation, clarte, en donnant le
    poids principal a la teinte : c'est elle qui ne bouge pas avec
    l'eclairage, et elle seule separe un bleu roi d'un bleu atoll ou un vert
    kaki d'un marron.
    """
    h1, s1, v1 = colorsys.rgb_to_hsv(*[c / 255 for c in t])
    h2, s2, v2 = colorsys.rgb_to_hsv(*[c / 255 for c in ref])
    dh = min(abs(h1 - h2), 1 - abs(h1 - h2))
    # La teinte ne veut rien dire sur un gris : son poids suit la saturation
    # de la moins saturee des deux couleurs comparees.
    return dh * 4 * min(s1, s2) + abs(v1 - v2) * 1.2 + abs(s1 - s2) * 0.8

import re as _re
CHINE = _re.compile(r"heather|chin", _re.I)

def couleur(t, grain):
    """Le coloris le plus proche.

    Trois cas resistent a la simple distance de couleur :

    - le noir photographie ne descend jamais a zero, les eclairages le
      remontent vers 40, ce qui le rapproche numeriquement d'un marine. Ce
      qui les separe est l'absence de dominante, pas la luminosite ;
    - le blanc, symetriquement, plafonne bien avant 255 ;
    - un gris chine est plus sombre en photo que sur sa pastille, au point
      de tomber du cote du gris fonce. Mais il est mouchete, donc bien plus
      granuleux : c'est le grain qui les departage, pas la teinte.
    """
    mx, mn = max(t), min(t)
    sat = (mx - mn) / mx if mx else 0
    # Un vert bouteille ou un marine tres sombre passent sous 90 eux aussi.
    # Seule l'absence de dominante signe le noir, d'ou un seuil serre.
    if mx < 90 and sat < 0.20 and "200" in pastilles: return "200"
    if mn > 190 and "100" in pastilles: return "100"

    autres = [s for s in pastilles if s not in ("100", "200")]
    chines = [s for s in autres if CHINE.search(noms[s])]
    if chines:
        # Le grain ne departage que des gris : sur un coloris franc il monte
        # aussi, par un pli ou une ombre, sans rien vouloir dire.
        if sat < 0.15:
            autres = chines if grain > 6 else [s for s in autres if s not in chines]
        else:
            autres = [s for s in autres if s not in chines]
    return min(autres, key=lambda s: ecart(t, pastilles[s]))

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
    grain = float(np.asarray(z).astype(int).reshape(-1, 3).std(0).mean())
    y = int(H * .6)
    xs = [x for x in range(W) if sum(px[x, y]) < 735]
    photos[p] = {"slug": couleur(t, grain), "teinte": t, "grain": round(grain, 1),
                 "largeur": (max(xs) - min(xs) + 1) / W if xs else 0}

par = {}
for p, r in photos.items(): par.setdefault(r["slug"], []).append(p)

# Trois vues par coloris. Au-dela, deux coloris ont ete confondus et les
# fichiers s'ecraseraient en silence : mieux vaut le dire et ne rien ecrire.
trop = {s: len(g) for s, g in par.items() if len(g) > 3}
if trop:
    print(json.dumps({"erreur": "trop de photos", "detail": {
        noms[s]: [os.path.basename(p) + " grain=" + str(photos[p]["grain"])
                  + " teinte=" + str(photos[p]["teinte"]) for p in sorted(par[s])]
        for s in trop}}, ensure_ascii=False))
    sys.exit(2)

# L'ordre de prise de vue departe face et dos. On trie sur le numero de photo,
# pas sur le nom de fichier : celui-ci peut porter un prefixe quelconque selon
# la facon dont les fichiers ont transite.
def rang(p):
    nombres = re.findall(r"\\d+", os.path.basename(p))
    return int(nombres[-1]) if nombres else 0

for slug, groupe in par.items():
    if len(groupe) == 3:
        # La vue de profil se reconnait a elle seule : le vetement y est bien
        # plus etroit que de face ou de dos.
        groupe.sort(key=lambda p: photos[p]["largeur"])
        photos[groupe[0]]["vue"] = "profil"
        reste = sorted(groupe[1:], key=rang)
    else:
        # Serie incomplete, souvent un envoi encore en cours : on s'en tient a
        # l'ordre de prise de vue, sans deviner un profil peut-etre absent.
        reste = sorted(groupe, key=rang)
    for p, v in zip(reste, ["face", "dos", "profil"]):
        photos[p]["vue"] = v

rapport = {}
for p, r in sorted(photos.items()):
    if "vue" not in r: continue
    sans_filigrane(Image.open(p).convert("RGB")).save(
        os.path.join(sortie, f"{r['slug']}-{r['vue']}.jpg"),
        "JPEG", quality=86, optimize=True, progressive=True)
    rapport.setdefault(r["slug"], []).append(r["vue"])

print(json.dumps({"rapport": rapport, "noms": noms,
                  "attendus": [c["slug"] for c in coloris],
                  "partiels": [noms[s] for s, g in par.items() if len(g) < 3]},
                 ensure_ascii=False))
`;

let sortie;
try {
  sortie = execFileSync(
    "python3",
    ["-c", script, REF, SOURCE, SORTIE, CACHE, JSON.stringify(coloris)],
    { encoding: "utf8" }
  ).trim();
} catch (e) {
  // Le classement s'est arrete de lui-meme : on relaie son diagnostic plutot
  // qu'une trace Node illisible.
  const dernier = String(e.stdout ?? "").trim().split("\n").pop();
  let detail;
  try {
    detail = JSON.parse(dernier);
  } catch {
    console.error(String(e.stderr ?? e.message));
    process.exit(1);
  }
  console.error(`\n${detail.erreur} : deux coloris ont ete confondus.\n`);
  for (const [nom, fichiers] of Object.entries(detail.detail)) {
    console.error(`  ${nom}`);
    for (const f of fichiers) console.error(`    ${f}`);
  }
  console.error("\nRien n'a ete ecrit.\n");
  process.exit(1);
}
const { rapport, noms, attendus, partiels } = JSON.parse(
  sortie.split("\n").pop(),
);

console.log(`\n=== ${REF} ===`);
for (const slug of attendus) {
  const vues = rapport[slug];
  console.log(
    `  ${slug.padEnd(6)} ${noms[slug].padEnd(16)} ` +
      (vues ? vues.sort().join(", ") : "aucune photo")
  );
}

if (partiels?.length) {
  console.log(`\nSerie incomplete : ${partiels.join(", ")} — envoi en cours ?`);
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
