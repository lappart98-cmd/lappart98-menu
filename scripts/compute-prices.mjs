// Calcule les prix de vente a partir du prix de revient reel.
//
//   node scripts/compute-prices.mjs
//
// Les donnees d'entree sont dans scripts/pricing.config.json. Le calcul :
//
//   prix de revient d'une piece = textile vierge
//                               + cout DTF (film + encre + poudre, au cm2)
//                               + quote-part des charges fixes
//   prix de vente                = prix de revient x coefficient de marge du palier
//
// La quote-part de charges fixes est le point qu'on oublie le plus souvent :
// le loyer se paie que l'atelier tourne ou non, donc chaque piece doit en
// porter une fraction. Plus le volume mensuel est eleve, plus cette fraction
// est faible — c'est ce qui justifie economiquement les paliers de quantite.

import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
// Le fichier de travail contient des donnees commerciales et reste hors du
// depot (cf. .gitignore). Le gabarit versionne sert de repli et documente la
// structure attendue.
const reel = join(ROOT, "scripts", "pricing.config.json");
const gabarit = join(ROOT, "scripts", "pricing.config.example.json");
const chemin = existsSync(reel) ? reel : gabarit;
if (chemin === gabarit) {
  console.log(
    "\n  pricing.config.json absent : lecture du gabarit, tous les montants sont a zero."
  );
}
const cfg = JSON.parse(readFileSync(chemin, "utf8"));

const eur = (n) => `${n.toFixed(2)} €`;
const manquants = [];
const need = (v, label) => {
  if (!v) manquants.push(label);
  return v || 0;
};

// --- Cout du flocage, au cm2 -------------------------------------------------

const film = cfg.consommables.film;
const surfaceRouleauM2 =
  need(film.longueurM, "consommables.film.longueurM") * film.largeurM;
const coutFilmM2 = surfaceRouleauM2
  ? need(film.prixRouleauHT, "consommables.film.prixRouleauHT") / surfaceRouleauM2
  : 0;

const encre = cfg.consommables.encre;
const coutEncreM2 =
  (need(encre.prixLitreHT, "consommables.encre.prixLitreHT") / 1000) *
  need(encre.consommationMlParM2, "consommables.encre.consommationMlParM2");

const poudre = cfg.consommables.poudre;
const coutPoudreM2 =
  (need(poudre.prixKgHT, "consommables.poudre.prixKgHT") / 1000) *
  need(poudre.consommationGParM2, "consommables.poudre.consommationGParM2");

const coutDtfM2 = coutFilmM2 + coutEncreM2 + coutPoudreM2;
const coutDtfCm2 = coutDtfM2 / 10_000;

// --- Charges fixes, par piece ------------------------------------------------

const ch = cfg.charges;
const chargesMensuelles =
  need(ch.loyerMensuel, "charges.loyerMensuel") +
  (ch.assuranceMensuelle || 0) +
  (ch.autresChargesMensuelles || 0) +
  (ch.amortissementMachineMensuel || 0);
const volume = need(ch.piecesParMois, "charges.piecesParMois");
const chargesParPiece = volume ? chargesMensuelles / volume : 0;

// --- Restitution -------------------------------------------------------------

console.log("\n=== COUT DU FLOCAGE DTF ===");
console.log(`  film    ${eur(coutFilmM2).padStart(9)} /m²`);
console.log(`  encre   ${eur(coutEncreM2).padStart(9)} /m²`);
console.log(`  poudre  ${eur(coutPoudreM2).padStart(9)} /m²`);
console.log(`  TOTAL   ${eur(coutDtfM2).padStart(9)} /m²`);

console.log("\n=== COUT PAR EMPLACEMENT ===");
const empl = Object.entries(cfg.emplacements).filter(([k]) => !k.startsWith("_"));
for (const [nom, e] of empl) {
  const revient = e.surfaceCm2 * coutDtfCm2;
  console.log(
    `  ${nom.padEnd(10)} ${String(e.surfaceCm2).padStart(4)} cm²   revient ${eur(revient).padStart(8)}` +
      (cfg.marge.bestof ? `   vente ~${eur(revient * cfg.marge.bestof)}` : "")
  );
}

console.log("\n=== CHARGES FIXES ===");
console.log(`  ${eur(chargesMensuelles)} / mois sur ${volume || "?"} pieces`);
console.log(`  = ${eur(chargesParPiece)} par piece`);

console.log("\n=== PRIX DE VENTE PAR REFERENCE ===");
console.log("  (textile + charges fixes, hors flocage — le flocage s'ajoute)");
console.log(
  "\n  REF        ACHAT    REVIENT   " +
    ["solo", "team", "bestof"].map((t) => t.toUpperCase().padStart(8)).join("")
);

const refs = Object.entries(cfg.textiles);
for (const [ref, t] of refs) {
  const achat = t.achatHT || 0;
  const revient = achat + chargesParPiece;
  const prix = ["solo", "team", "bestof"].map((p) => {
    const coef = cfg.marge[p];
    return coef ? eur(revient * coef).padStart(8) : "       ?";
  });
  console.log(
    `  ${ref.padEnd(10)} ${eur(achat).padStart(7)} ${eur(revient).padStart(9)} ${prix.join("")}` +
      (achat ? "" : "   <- prix d'achat manquant")
  );
}

if (manquants.length) {
  console.log("\n=== DONNEES MANQUANTES ===");
  console.log("  Le calcul est incomplet tant que ces champs valent 0 :");
  [...new Set(manquants)].forEach((m) => console.log(`  - ${m}`));
}
const sansAchat = refs.filter(([, t]) => !t.achatHT).length;
if (sansAchat) {
  console.log(`  - prix d'achat de ${sansAchat} reference(s) sur ${refs.length}`);
}
if (!cfg.marge.solo && !cfg.marge.team && !cfg.marge.bestof) {
  console.log("  - marge.solo / marge.team / marge.bestof (coefficients)");
}
console.log("");
