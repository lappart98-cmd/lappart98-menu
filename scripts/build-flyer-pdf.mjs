// Genere le flyer recto verso A5 destine a la distribution en boites aux lettres.
//
//   node scripts/build-flyer-pdf.mjs
//
// Canvas : A5 (148 x 210 mm) + 3 mm de fond perdu sur chaque bord = 154 x 216 mm.
// Le fond sombre va jusqu'au bord du fichier ; apres massicotage il n'y a donc
// aucun liseré blanc, meme si la coupe derive de 1 ou 2 mm. Tout le contenu
// reste a l'interieur d'une marge de securite.
//
// Les chiffres (formules, tarifs, categories) sont lus depuis le code du site
// pour que le flyer ne puisse pas diverger de la vitrine.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve, extname } from "node:path";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";

const ROOT = resolve(import.meta.dirname, "..");

// Deux sorties possibles :
//  - par defaut : A5 + 3 mm de fond perdu (154 x 216 mm), pour un imprimeur
//    qui massicote. Le fond sombre deborde, donc pas de liseré blanc a la coupe.
//  - --sans-fond-perdu : A5 exact (148 x 210 mm), pour une impression de
//    proximite sans façonnage.
const SANS_FOND_PERDU = process.argv.includes("--sans-fond-perdu");
const BLEED = SANS_FOND_PERDU ? 0 : 3;      // mm
const W = 148 + BLEED * 2;
const H = 210 + BLEED * 2;
// 8 mm de retrait au trait de coupe, quelle que soit la variante
const SAFE = BLEED + 8;
const PX = (mm) => Math.round((mm / 25.4) * 96);

const OUT = join(
  ROOT,
  "public",
  SANS_FOND_PERDU ? "flyer-lappart98-a5.pdf" : "flyer-lappart98.pdf"
);
const CACHE = join(ROOT, "node_modules", ".cache", "catalogue-pdf");
mkdirSync(CACHE, { recursive: true });

const chrome = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((p) => existsSync(p));

if (!chrome) {
  console.error("Aucun navigateur Chrome/Chromium trouve pour le rendu PDF.");
  process.exit(1);
}

// --- Donnees du site ---------------------------------------------------------

const build = join(CACHE, "ts");
execFileSync(
  "npx",
  ["tsc", "src/data/products.ts", "--outDir", build, "--module", "commonjs",
   "--target", "es2020", "--skipLibCheck"],
  { cwd: ROOT, stdio: "inherit" }
);
const require = createRequire(import.meta.url);
const { products, categories } = require(join(build, "products.js"));

const gammes = categories
  .filter((c) => c !== "Tous")
  .map((c) => ({ nom: c, n: products.filter((p) => p.category === c).length }))
  .filter((g) => g.n > 0);

// --- Images ------------------------------------------------------------------
// Tout est embarque en base64 : le fichier HTML reste autonome et le rendu ne
// depend d'aucune ressource externe au moment de l'impression.

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg" };

function dataUri(absPath, maxPx) {
  const ext = extname(absPath).toLowerCase();
  let src = absPath;
  if (maxPx) {
    const key = createHash("sha1").update(absPath + maxPx).digest("hex").slice(0, 12);
    const out = join(CACHE, `flyer-${key}${ext}`);
    if (!existsSync(out)) {
      // -Z conserve le format, donc la transparence des PNG detoures survit.
      execFileSync("sips", ["-Z", String(maxPx), absPath, "--out", out], { stdio: "ignore" });
    }
    src = out;
  }
  return `data:${MIME[ext] ?? "image/png"};base64,${readFileSync(src).toString("base64")}`;
}

// Le domaine definitif, pas l'URL de deploiement Vercel : un flyer vit des
// mois, l'adresse imprimee doit survivre a un changement d'hebergeur.
const SITE = "https://www.lappart98.com/catalogue";
// Le cache porte l'empreinte de l'adresse : changer SITE regenere le QR au
// lieu de resservir celui qui menait ailleurs.
const qrPath = join(
  CACHE,
  `flyer-qr-${createHash("sha1").update(SITE).digest("hex").slice(0, 10)}.png`
);
if (!existsSync(qrPath)) {
  execFileSync("curl", ["-sL", "--max-time", "30", "-o", qrPath,
    `https://api.qrserver.com/v1/create-qr-code/?size=800x800&margin=0&ecc=M&data=${encodeURIComponent(SITE)}`]);
}

const img = {
  logo: dataUri(join(ROOT, "public", "logo-lappart98.png"), 1600),
  tshirt: dataUri(join(ROOT, "public", "tshirt-noir.png"), 700),
  hoodie: dataUri(join(ROOT, "public", "hoodie-kaki.png"), 700),
  sweat: dataUri(join(ROOT, "public", "sweat-noir.png"), 700),
  polo: dataUri(join(ROOT, "public", "polo-noir.png"), 700),
  casquette: dataUri(join(ROOT, "public", "casquette-noire.png"), 700),
  totebag: dataUri(join(ROOT, "public", "totebag.png"), 700),
  qr: dataUri(qrPath),
};

// --- Contenu -----------------------------------------------------------------

const LIME = "#C5FF00";
const NOIR = "#0A0A0A";

// Les tarifs sont deduits du catalogue : le prix affiche est le plancher de
// chaque palier, toutes references confondues. Le flyer ne peut donc pas
// annoncer un prix que le site ne pratique plus.
const plancher = (palier) =>
  String(Math.min(...products.map((p) => p.prices[palier])));

const menus = [
  { nom: "LE P'TIT SOLO", qte: "1 a 4 pieces", prix: plancher("solo") },
  { nom: "LE MENU TEAM", qte: "5 a 14 pieces", prix: plancher("team") },
  { nom: "LE MAXI BEST-OF", qte: "15 a 40 pieces", prix: plancher("bestof"), star: true },
];

const etapes = [
  ["1", "Envoie ton visuel", "Par WhatsApp ou par mail, avec ce que tu veux floquer."],
  ["2", "On valide ensemble", "Devis sous 2h, puis un BAT avant toute production."],
  ["3", "Tu recuperes", "A l'atelier de Gentilly, ou en livraison."],
];

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Flyer L'Appart 98</title>
<meta name="hz:slide-selector" content=".flyer">
<meta name="hz:canvas-width" content="${PX(W)}">
<meta name="hz:canvas-height" content="${PX(H)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
/* Sans cette regle, Chrome imprime sur du format Letter par defaut et le
   fond perdu ne tombe pas au bon endroit. */
@page { size: ${W}mm ${H}mm; margin: 0; }
body { background: ${NOIR}; }

/* A5, avec ou sans fond perdu selon la variante */
.flyer {
  position: relative;
  width: ${W}mm;
  height: ${H}mm;
  background: ${NOIR};
  overflow: hidden;
  page-break-after: always;
  font-family: Inter, sans-serif;
  color: #fff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.flyer:last-child { page-break-after: auto; }

/* Fond perdu eventuel + 8 mm de retrait au trait de coupe */
.safe { position: absolute; top: ${SAFE}mm; right: ${SAFE}mm; bottom: ${SAFE}mm; left: ${SAFE}mm; }

.oswald { font-family: Oswald, sans-serif; }

/* ---------- RECTO ---------- */
.halo {
  position: absolute; left: 50%; top: 46mm; width: 150mm; height: 150mm;
  transform: translateX(-50%);
  background: radial-gradient(circle, rgba(197,255,0,.16) 0%, rgba(197,255,0,.05) 42%, rgba(197,255,0,0) 68%);
}
/* Le logo du site est noir sur fond transparent : sur un fond sombre il faut
   le forcer en blanc, sinon il disparait completement. */
.logo { display: block; width: 74mm; margin: 0 auto; filter: brightness(0) invert(1); }
.kicker {
  font-family: Oswald, sans-serif; font-size: 7.4pt; letter-spacing: .34em;
  text-transform: uppercase; color: rgba(255,255,255,.5); text-align: center; margin-top: 4.5mm;
}
h1 {
  font-family: Oswald, sans-serif; font-weight: 700; font-size: 33pt; line-height: .94;
  text-transform: uppercase; text-align: center; margin-top: 4mm; letter-spacing: -.4pt;
}
h1 em { color: ${LIME}; font-style: normal; }

.shots { position: relative; height: 62mm; margin-top: 4mm; }
.shots img { position: absolute; bottom: 0; }
.shots .s1 { height: 57mm; left: 2mm; }
.shots .s2 { height: 62mm; left: 50%; transform: translateX(-50%); }
.shots .s3 { height: 38mm; right: 2mm; bottom: 3mm; }

.burst {
  position: absolute; right: 0; top: 2mm; width: 27mm; height: 27mm; border-radius: 50%;
  background: ${LIME}; color: ${NOIR}; display: flex; flex-direction: column;
  align-items: center; justify-content: center; transform: rotate(-9deg);
}
.burst .a { font-family: Oswald, sans-serif; font-size: 7pt; font-weight: 600; text-transform: uppercase; }
.burst .b { font-family: Oswald, sans-serif; font-size: 20pt; font-weight: 700; line-height: .9; }
.burst .c { font-family: Oswald, sans-serif; font-size: 6.6pt; font-weight: 600; }

.menus { display: flex; gap: 2mm; margin-top: 4mm; }
.menu {
  flex: 1; border: .35mm solid rgba(255,255,255,.16); border-radius: 1.6mm;
  padding: 3mm 2mm; text-align: center; background: rgba(255,255,255,.03);
}
.menu.star { border-color: ${LIME}; background: rgba(197,255,0,.09); }
.menu .n { font-family: Oswald, sans-serif; font-size: 7.4pt; font-weight: 600; text-transform: uppercase; line-height: 1.15; }
.menu .q { font-size: 6pt; color: rgba(255,255,255,.45); margin-top: .8mm; }
.menu .p { font-family: Oswald, sans-serif; font-size: 17pt; font-weight: 700; margin-top: 1.6mm; }
.menu.star .p { color: ${LIME}; }
.menu .u { font-size: 5.6pt; color: rgba(255,255,255,.4); }

.inclus {
  display: grid; grid-template-columns: 1fr 1fr; gap: 1.8mm 4mm; margin-top: 5mm;
}
.inclus div { display: flex; align-items: center; gap: 1.8mm; font-size: 7.4pt; color: rgba(255,255,255,.8); }
.inclus .tick {
  width: 3.6mm; height: 3.6mm; border-radius: 50%; background: rgba(197,255,0,.16);
  color: ${LIME}; font-size: 6pt; font-weight: 700; display: flex; align-items: center;
  justify-content: center; flex: none;
}

.cta {
  position: absolute; left: 0; right: 0; bottom: 0;
  background: ${LIME}; color: ${NOIR}; text-align: center; padding: 4.5mm 3mm 4mm;
}
.cta .t { font-family: Oswald, sans-serif; font-size: 9.5pt; font-weight: 600; text-transform: uppercase; letter-spacing: .1em; }
.cta .tel { font-family: Oswald, sans-serif; font-size: 21pt; font-weight: 700; line-height: 1.05; margin-top: .6mm; }
.cta .adr { font-size: 6.8pt; font-weight: 500; margin-top: 1mm; }

/* ---------- VERSO ---------- */
.vtitle { font-family: Oswald, sans-serif; font-size: 8pt; font-weight: 600; letter-spacing: .26em; text-transform: uppercase; color: ${LIME}; }
.vrule { height: .3mm; background: rgba(255,255,255,.14); margin: 1.6mm 0 2.6mm; }

.gammes { display: grid; grid-template-columns: 1fr 1fr; gap: 1.4mm 3mm; }
.gamme { display: flex; align-items: baseline; gap: 1.5mm; font-size: 7.6pt; }
.gamme .dot { width: 1.4mm; height: 1.4mm; border-radius: 50%; background: ${LIME}; flex: none; }
.gamme .n { color: rgba(255,255,255,.4); font-family: Oswald, sans-serif; font-size: 6.6pt; margin-left: auto; }

.vshots { display: flex; align-items: flex-end; height: 29mm; margin: 3.5mm 0 0; }
.vshots div { flex: 1; display: flex; align-items: flex-end; justify-content: center; }
.vshots img { max-height: 29mm; max-width: 100%; object-fit: contain; }

.steps { display: flex; flex-direction: column; gap: 2mm; }
.step { display: flex; gap: 2.5mm; align-items: flex-start; }
.step .num {
  font-family: Oswald, sans-serif; font-size: 8pt; font-weight: 700; color: ${NOIR};
  background: ${LIME}; width: 5.4mm; height: 5.4mm; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; flex: none;
}
.step .h { font-family: Oswald, sans-serif; font-size: 8.2pt; font-weight: 600; text-transform: uppercase; }
.step .d { font-size: 6.8pt; color: rgba(255,255,255,.5); line-height: 1.35; margin-top: .3mm; }

.tech { display: flex; gap: 1.6mm; margin-top: 3mm; }
.tech span {
  font-family: Oswald, sans-serif; font-size: 6.6pt; letter-spacing: .08em; text-transform: uppercase;
  border: .3mm solid rgba(197,255,0,.55); color: ${LIME}; padding: 1.1mm 2.2mm; border-radius: 1mm;
}

.pourqui { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2mm; margin-top: 4.5mm; }
.pourqui div {
  border: .3mm solid rgba(255,255,255,.14); border-radius: 1.4mm; padding: 2mm 1.5mm;
  text-align: center; font-family: Oswald, sans-serif; font-size: 6.8pt; font-weight: 500;
  text-transform: uppercase; letter-spacing: .04em; line-height: 1.25;
}

.qrzone { display: flex; gap: 4mm; align-items: center; background: rgba(197,255,0,.07); border: .3mm solid rgba(197,255,0,.3); border-radius: 2mm; padding: 3.2mm; margin-top: 4mm; }
.qrzone img { width: 21mm; height: 21mm; background: #fff; padding: 1.2mm; border-radius: 1mm; }
.qrzone .h { font-family: Oswald, sans-serif; font-size: 10.5pt; font-weight: 600; text-transform: uppercase; line-height: 1.1; }
.qrzone .d { font-size: 6.8pt; color: rgba(255,255,255,.5); line-height: 1.4; margin-top: 1.2mm; }
.qrzone .u { font-family: Oswald, sans-serif; font-size: 7pt; color: ${LIME}; margin-top: 1.5mm; }

.vfoot { position: absolute; left: ${SAFE}mm; right: ${SAFE}mm; bottom: ${SAFE}mm; }
.vfoot .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2mm 3mm; font-size: 6.9pt; }
.vfoot .k { font-family: Oswald, sans-serif; font-size: 6pt; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,.35); display: block; }
</style>
</head>
<body>

<!-- ============ RECTO ============ -->
<div class="flyer" data-canvas-width="${PX(W)}" data-canvas-height="${PX(H)}">
  <div class="halo"></div>
  <div class="safe">
    <img class="logo" src="${img.logo}" alt="L'Appart 98">
    <div class="kicker">Textile personnalise &middot; Gentilly</div>

    <h1>TON VISUEL<br><em>SUR TON TEXTILE</em></h1>

    <div class="shots">
      <img class="s1" src="${img.hoodie}" alt="">
      <img class="s2" src="${img.tshirt}" alt="">
      <img class="s3" src="${img.casquette}" alt="">
      <div class="burst">
        <span class="a">Des</span>
        <span class="b">${plancher("bestof")}&euro;</span>
        <span class="c">la piece</span>
      </div>
    </div>

    <div class="menus">
      ${menus.map((m) => `<div class="menu${m.star ? " star" : ""}">
        <div class="n">${m.nom}</div>
        <div class="q">${m.qte}</div>
        <div class="p">${m.prix}&euro;</div>
        <div class="u">la piece</div>
      </div>`).join("")}
    </div>

      <div class="inclus">
        <div><span class="tick">&#10003;</span>Flocage inclus</div>
        <div><span class="tick">&#10003;</span>Ton visuel, tes couleurs</div>
        <div><span class="tick">&#10003;</span>Des 1 seule piece</div>
        <div><span class="tick">&#10003;</span>BAT avant production</div>
      </div>
  </div>

  <div class="cta">
    <div class="t">Devis gratuit &middot; Reponse en 2h</div>
    <div class="tel">06 75 00 86 33</div>
    <div class="adr">65 rue Charles Frerot, 94250 Gentilly &nbsp;&middot;&nbsp; www.lappart98.com</div>
  </div>
</div>

<!-- ============ VERSO ============ -->
<div class="flyer" data-canvas-width="${PX(W)}" data-canvas-height="${PX(H)}">
  <div class="safe">
    <div class="vtitle">Ce qu'on floque</div>
    <div class="vrule"></div>
    <div class="gammes">
      ${gammes.map((g) => `<div class="gamme"><span class="dot"></span><span>${g.nom}</span><span class="n">${g.n}</span></div>`).join("")}
    </div>

    <div class="vshots">
      <div><img src="${img.sweat}" alt=""></div>
      <div><img src="${img.polo}" alt=""></div>
      <div><img src="${img.totebag}" alt=""></div>
      <div><img src="${img.casquette}" alt=""></div>
    </div>

    <div class="vtitle" style="margin-top:3.5mm">Comment ca marche</div>
    <div class="vrule"></div>
    <div class="steps">
      ${etapes.map(([n, h, d]) => `<div class="step">
        <div class="num">${n}</div>
        <div><div class="h">${h}</div><div class="d">${d}</div></div>
      </div>`).join("")}
    </div>

    <div class="tech">
      <span>DTF</span><span>Broderie</span><span>Stickers UV</span><span>Flocage</span>
    </div>

    <div class="vtitle" style="margin-top:4mm">Pour qui</div>
    <div class="vrule"></div>
    <div class="pourqui" style="margin-top:0">
      <div>Clubs<br>&amp; assos</div>
      <div>Entreprises<br>&amp; equipes</div>
      <div>Evenements<br>&amp; EVJF</div>
      <div>Projets<br>perso</div>
    </div>

    <div class="qrzone">
      <img src="${img.qr}" alt="Catalogue en ligne">
      <div>
        <div class="h">Le catalogue<br>complet</div>
        <div class="d">${products.length} references, ${gammes.length} gammes, toutes les tailles et coloris.</div>
        <div class="u">www.lappart98.com/catalogue</div>
      </div>
    </div>
  </div>

  <div class="vfoot">
    <div class="vrule" style="margin-bottom:2.5mm"></div>
    <div class="grid">
      <div><span class="k">Atelier</span>65 rue Charles Frerot, 94250 Gentilly</div>
      <div><span class="k">WhatsApp</span>06 75 00 86 33</div>
      <div><span class="k">Instagram</span>@lappart_98</div>
      <div><span class="k">Mail</span>contact@lappart98.com</div>
    </div>
  </div>
</div>

</body></html>`;

const htmlPath = join(CACHE, SANS_FOND_PERDU ? "flyer-a5.html" : "flyer.html");
writeFileSync(htmlPath, html);

execFileSync(chrome, [
  "--headless", "--disable-gpu", "--no-sandbox",
  "--run-all-compositor-stages-before-draw",
  "--virtual-time-budget=30000",
  "--no-pdf-header-footer",
  `--print-to-pdf=${OUT}`,
  `file://${htmlPath}`,
], { stdio: "inherit" });

console.log(`\nFlyer genere : ${OUT}`);
console.log(SANS_FOND_PERDU
  ? "A5 exact 148 x 210 mm, sans fond perdu - recto verso"
  : "A5 154 x 216 mm (fond perdu 3 mm inclus) - recto verso");
