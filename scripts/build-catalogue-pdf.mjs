// Genere le catalogue PDF a partir de src/data/products.ts.
//
//   node scripts/build-catalogue-pdf.mjs
//
// Le fichier de donnees etant en TypeScript, on le compile d'abord avec le tsc
// du projet, puis on rend le HTML en PDF via Chrome en mode headless. Ainsi le
// PDF reste toujours le reflet exact du catalogue du site.

import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = join(ROOT, "public", "catalogue-lappart98.pdf");

const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];

const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.error("Aucun navigateur Chrome/Chromium trouve pour le rendu PDF.");
  process.exit(1);
}

// --- Donnees -----------------------------------------------------------------

const build = mkdtempSync(join(tmpdir(), "catalogue-"));
execFileSync(
  "npx",
  [
    "tsc",
    "src/data/products.ts",
    "--outDir",
    build,
    "--module",
    "commonjs",
    "--target",
    "es2020",
    "--skipLibCheck",
  ],
  { cwd: ROOT, stdio: "inherit" }
);

const require = createRequire(import.meta.url);
const { products, categories, grammageValue } = require(
  join(build, "products.js")
);

// --- Cache d'images ----------------------------------------------------------
// Chrome embarque les bitmaps a leur resolution source : un packshot 1667x2500
// pese autant dans le PDF que sur le CDN, meme affiche en 88 mm. On rapatrie
// donc chaque visuel une fois, redimensionne a la taille reellement utile.

const CACHE = join(ROOT, "node_modules", ".cache", "catalogue-pdf");
mkdirSync(CACHE, { recursive: true });

const localFor = new Map();

function cacheImage(url, maxPx) {
  if (localFor.has(url)) return localFor.get(url);
  const name = createHash("sha1").update(url).digest("hex").slice(0, 16);
  const out = join(CACHE, `${name}-${maxPx}.jpg`);

  if (!existsSync(out)) {
    const raw = join(CACHE, `${name}.raw`);
    if (!existsSync(raw)) {
      execFileSync("curl", ["-sL", "--max-time", "40", "-o", raw, url]);
    }
    try {
      execFileSync(
        "sips",
        ["-Z", String(maxPx), "-s", "format", "jpeg", "-s", "formatOptions", "78", raw, "--out", out],
        { stdio: "ignore" }
      );
    } catch {
      console.warn(`  visuel illisible, ignore : ${url}`);
      localFor.set(url, null);
      return null;
    }
  }
  localFor.set(url, out);
  return out;
}

// --- Rendu -------------------------------------------------------------------

const LIME = "#C5FF00";
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const ordered = categories
  .filter((c) => c !== "Tous")
  .flatMap((cat) => {
    const list = products
      .filter((p) => p.category === cat)
      .sort((a, b) => {
        const ga = grammageValue(a);
        const gb = grammageValue(b);
        if (ga === null) return gb === null ? 0 : 1;
        if (gb === null) return -1;
        return ga - gb;
      });
    return list.map((p) => ({ ...p, _cat: cat }));
  });

const countByCat = Object.fromEntries(
  categories
    .filter((c) => c !== "Tous")
    .map((c) => [c, products.filter((p) => p.category === c).length])
);

const fileUrl = (path) => (path ? "file://" + path : "");

function swatchUrl(product, color) {
  return (
    color.swatch ??
    `https://cdn.toptex.com/stickers/PAST_${product.ref}_${color.slug}.jpg?w=48`
  );
}

function productPage(p, index) {
  const specs = [
    ["Matiere", p.material],
    ["Grammage", p.grammage],
    ["Coupe", p.cut],
    ["Marque", p.brand],
  ];

  return `
  <section class="page">
    <header class="phead">
      <span class="cat">${esc(p._cat)}</span>
      <span class="ref">${esc(p.ref)}</span>
    </header>

    <div class="hero">
      <img src="${esc(fileUrl(cacheImage(p.defaultImages[0], 900)))}" alt="${esc(p.name)}">
    </div>

    <h2>${esc(p.name)}</h2>
    <p class="desc">${esc(p.description)}</p>

    <div class="specs">
      ${specs
        .map(
          ([k, v]) =>
            `<div class="spec"><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></div>`
        )
        .join("")}
    </div>

    <div class="block">
      <span class="label">Tailles</span>
      <div class="sizes">${p.sizes.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
    </div>

    <div class="block">
      <span class="label">${p.colors.length} coloris</span>
      <div class="colors">
        ${p.colors
          .map(
            (c) => `<figure>
              <img src="${esc(fileUrl(cacheImage(swatchUrl(p, c), 80)))}" alt="${esc(c.name)}">
              <figcaption>${esc(c.name)}</figcaption>
            </figure>`
          )
          .join("")}
      </div>
    </div>

    <footer class="pfoot">
      ${
        p.certifications.length
          ? `<div class="certs">${p.certifications.map((c) => `<span>${esc(c)}</span>`).join("")}</div>`
          : `<div></div>`
      }
      <span class="price">${esc(p.price)}</span>
      <span class="num">${String(index + 1).padStart(2, "0")}</span>
    </footer>
  </section>`;
}

const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<title>Catalogue L'Appart 98</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0A0A0A; color: #fff; font-family: Inter, system-ui, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .page { width: 210mm; height: 297mm; padding: 14mm 16mm; page-break-after: always; position: relative; display: flex; flex-direction: column; overflow: hidden; }
  .page:last-child { page-break-after: auto; }

  /* Couverture */
  .cover { justify-content: center; align-items: center; text-align: center;
           background: radial-gradient(ellipse at center, #16180d 0%, #0A0A0A 70%); }
  .cover h1 { font-family: Oswald, sans-serif; font-weight: 700; font-size: 68pt; line-height: .95; text-transform: uppercase; letter-spacing: -1px; }
  .cover h1 em { color: ${LIME}; font-style: normal; }
  .cover .sub { font-family: Oswald, sans-serif; letter-spacing: .38em; text-transform: uppercase; font-size: 10pt; color: rgba(255,255,255,.45); margin-bottom: 10mm; }
  .cover .rule { width: 34mm; height: 3px; background: ${LIME}; margin: 8mm auto; }
  .cover .meta { color: rgba(255,255,255,.5); font-size: 10pt; line-height: 1.9; }
  .cover .meta b { color: #fff; font-weight: 600; }

  /* Sommaire */
  .toc h2 { font-family: Oswald, sans-serif; font-size: 30pt; text-transform: uppercase; margin-bottom: 8mm; }
  .toc h2 em { color: ${LIME}; font-style: normal; }
  .toc table { width: 100%; border-collapse: collapse; }
  .toc td { vertical-align: middle; }
  .toc .head td { padding: 4.5mm 0 1.8mm; border-bottom: 1px solid rgba(255,255,255,.18); }
  .toc tr:first-child td { padding-top: 0; }
  .toc .c1 { font-family: Oswald, sans-serif; text-transform: uppercase; letter-spacing: .08em; font-size: 12pt; color: ${LIME}; }
  .toc .c2 { color: rgba(255,255,255,.35); font-size: 8pt; text-align: right; white-space: nowrap; padding-right: 5mm; }
  .toc .c3 { text-align: right; color: rgba(255,255,255,.5); font-family: Oswald, sans-serif; font-size: 8.5pt; white-space: nowrap; }
  .toc .item td { padding: 1.9mm 0; border-bottom: 1px solid rgba(255,255,255,.06); font-size: 9pt; }
  .toc .i1 { font-family: Oswald, sans-serif; color: rgba(255,255,255,.4); width: 22mm; letter-spacing: .06em; }
  .toc .i2 { padding-right: 4mm; }
  .toc .i3 { text-align: right; color: rgba(255,255,255,.4); white-space: nowrap; font-size: 8.5pt; }
  .toc .i4 { text-align: right; width: 14mm; font-family: Oswald, sans-serif; color: ${LIME}; font-size: 8.5pt; }

  /* Fiche produit */
  .phead { display: flex; justify-content: space-between; align-items: center; font-family: Oswald, sans-serif; text-transform: uppercase; font-size: 8.5pt; letter-spacing: .22em; padding-bottom: 3mm; border-bottom: 1px solid rgba(255,255,255,.12); }
  .phead .cat { color: ${LIME}; }
  .phead .ref { color: rgba(255,255,255,.4); }

  .hero { height: 88mm; margin: 6mm 0; background: #141414; border: 1px solid rgba(255,255,255,.08); border-radius: 3mm; display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .hero img { max-width: 100%; max-height: 100%; object-fit: contain; }

  h2 { font-family: Oswald, sans-serif; font-weight: 700; font-size: 21pt; text-transform: uppercase; line-height: 1.08; }
  .desc { color: rgba(255,255,255,.55); font-size: 9.5pt; line-height: 1.55; margin-top: 2.5mm; }

  .specs { display: grid; grid-template-columns: 1fr 1fr; gap: 2mm; margin-top: 6mm; }
  .spec { background: #131313; border-left: 2px solid ${LIME}; padding: 2.6mm 3mm; }
  .spec .k { display: block; font-family: Oswald, sans-serif; font-size: 7pt; letter-spacing: .2em; text-transform: uppercase; color: rgba(255,255,255,.35); }
  .spec .v { display: block; font-size: 9pt; margin-top: .8mm; }

  .block { margin-top: 5.5mm; }
  .label { font-family: Oswald, sans-serif; font-size: 8pt; letter-spacing: .2em; text-transform: uppercase; color: rgba(255,255,255,.4); display: block; margin-bottom: 2.5mm; }
  .sizes { display: flex; flex-wrap: wrap; gap: 1.6mm; }
  .sizes span { font-family: Oswald, sans-serif; font-size: 8.5pt; border: 1px solid rgba(255,255,255,.18); padding: 1.2mm 2.6mm; border-radius: 1mm; }

  .colors { display: flex; flex-wrap: wrap; gap: 2.2mm; }
  .colors figure { width: 15.5mm; text-align: center; }
  .colors img { width: 10mm; height: 10mm; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,.2); }
  .colors figcaption { font-size: 5.6pt; color: rgba(255,255,255,.45); margin-top: .8mm; line-height: 1.25; }

  .pfoot { margin-top: auto; padding-top: 4mm; border-top: 1px solid rgba(255,255,255,.12); display: flex; align-items: center; justify-content: space-between; gap: 4mm; }
  .certs { display: flex; gap: 1.6mm; }
  .certs span { font-family: Oswald, sans-serif; font-size: 7pt; letter-spacing: .12em; border: 1px solid ${LIME}; color: ${LIME}; padding: 1mm 2.2mm; border-radius: 1mm; }
  .price { font-family: Oswald, sans-serif; font-size: 12pt; color: ${LIME}; text-transform: uppercase; }
  .num { font-family: Oswald, sans-serif; font-size: 8pt; color: rgba(255,255,255,.25); }
</style></head>
<body>

<section class="page cover">
  <div class="sub">Textile personnalise &middot; Gentilly</div>
  <h1>LE<br><em>CATALOGUE</em></h1>
  <div class="rule"></div>
  <div class="meta">
    <b>${products.length} references</b> &middot; ${categories.length - 1} categories<br>
    65 rue Charles Frerot, 94250 Gentilly<br>
    06 75 00 86 33 &middot; contact@lappart98.fr<br>
    www.lappart98.com
  </div>
</section>

<section class="page toc">
  <h2>LES <em>GAMMES</em></h2>
  <table>
    ${categories
      .filter((c) => c !== "Tous")
      .map((c) => {
        const g = products
          .filter((p) => p.category === c)
          .map(grammageValue)
          .filter((v) => v !== null);
        const range = !g.length
          ? "n.c."
          : Math.min(...g) === Math.max(...g)
            ? `${Math.min(...g)} g/m²`
            : `${Math.min(...g)} - ${Math.max(...g)} g/m²`;

        const rows = ordered
          .map((p, i) => ({ p, page: i + 3 }))
          .filter(({ p }) => p.category === c)
          .map(
            ({ p, page }) => `<tr class="item">
              <td class="i1">${esc(p.ref)}</td>
              <td class="i2">${esc(p.name)}</td>
              <td class="i3">${esc(p.grammage)}</td>
              <td class="i4">p.${page}</td>
            </tr>`
          )
          .join("");

        return `<tr class="head">
            <td class="c1" colspan="2">${esc(c)}</td>
            <td class="c2">${countByCat[c]} ref.</td>
            <td class="c3">${esc(range)}</td>
          </tr>${rows}`;
      })
      .join("")}
  </table>
</section>

${ordered.map(productPage).join("")}

</body></html>`;

// Conserve dans le cache (et non dans le dossier temporaire) pour pouvoir
// inspecter le rendu sans relancer toute la generation.
const htmlPath = join(CACHE, "catalogue.html");
writeFileSync(htmlPath, html);

mkdirSync(join(ROOT, "public"), { recursive: true });
execFileSync(
  chrome,
  [
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=60000",
    "--no-pdf-header-footer",
    `--print-to-pdf=${OUT}`,
    `file://${htmlPath}`,
  ],
  { stdio: "inherit" }
);

console.log(`\nPDF genere : ${OUT}`);
console.log(`${ordered.length} fiches + couverture + sommaire`);
