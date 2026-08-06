"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Upload, Download, Loader2, X, Check } from "lucide-react";
import {
  products,
  getColorImages,
  getPackshotImages,
  getColorSwatch,
  type Product,
  type ProductColor,
} from "@/data/products";
import {
  emplacementsDe,
  familleDe,
  largeurVetementCm,
  mesurerVetement,
  type BoiteVetement,
  type Emplacement,
  type Famille,
  type Vue,
} from "@/lib/apercu";

/** Le relais rend l'image de meme origine, seule condition pour l'exporter. */
const viaRelais = (url: string) =>
  `/api/packshot?url=${encodeURIComponent(url)}`;

/** Cote du rendu a l'ecran. L'export double cette resolution. */
const RENDU = 900;

const FORMATS_LOGO = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const POIDS_MAX = 6 * 1024 * 1024;

// Un article par famille : proposer les vingt references du catalogue noyait
// le choix, alors que la geometrie du marquage ne depend que de la famille.
// Changer un modele ici suffit a changer celui de l'apercu.
const REFERENCES = ["NS332", "NS443", "NS444", "KP162", "KI3223"];

const textiles = REFERENCES.map((ref) =>
  products.find((p) => p.ref === ref)!,
).filter(Boolean);

const ETIQUETTE_VUE: Record<Vue, string> = {
  face: "Devant",
  profil: "Profil",
  dos: "Dos",
};

const ETIQUETTE_FAMILLE: Record<Famille, string> = {
  tshirt: "T-shirt",
  sweat: "Sweat col rond",
  hoodie: "Sweat à capuche",
  casquette: "Casquette",
  totebag: "Tote bag",
};

/** Un reglage par famille et par emplacement : changer de textile ne perd rien. */
const cleReglage = (famille: Famille, id: string) => `${famille}:${id}`;

interface Reglage {
  actif: boolean;
  cm: number;
}

interface Visuel {
  image: HTMLImageElement;
  fichier: File;
}

/** Dimensions du pictogramme « image absente » de Toptex. */
const PLACEHOLDER = { l: 1900, h: 2848 };

function chargerImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () =>
      // Second filet, si le fournisseur omet l'en-tete de poids que le relais
      // controle : le pictogramme se reconnait aussi a ses dimensions.
      img.naturalWidth === PLACEHOLDER.l && img.naturalHeight === PLACEHOLDER.h
        ? reject(new Error(`visuel absent : ${src}`))
        : resolve(img);
    img.onerror = () => reject(new Error(src));
    img.src = src;
  });
}

/**
 * Pose le visuel dans le tissu plutot que par-dessus.
 *
 * Deux effets tires du packshot lui-meme, sans texture externe :
 *  - le relief : chaque pixel du visuel est decale selon la pente locale de
 *    luminosite du vetement, si bien que le marquage suit les plis ;
 *  - l'ombrage : le visuel est multiplie par l'ecart local a la luminosite
 *    moyenne, donc creux et bosses le traversent.
 *
 * Le rapport a la moyenne, plutot qu'une valeur absolue, evite d'assombrir un
 * visuel pose sur un textile noir : ce sont les variations qui comptent, pas
 * le niveau.
 */
function poserDansLeTissu(
  ctx: CanvasRenderingContext2D,
  calque: HTMLCanvasElement,
  logo: HTMLImageElement,
  rect: { x: number; y: number; l: number; h: number },
) {
  const x = Math.round(rect.x);
  const y = Math.round(rect.y);
  const l = Math.round(rect.l);
  const h = Math.round(rect.h);
  if (l < 2 || h < 2) return;

  // Hors cadre, getImageData renverrait du vide : on retombe sur un poser plat.
  if (x < 0 || y < 0 || x + l > ctx.canvas.width || y + h > ctx.canvas.height) {
    ctx.drawImage(logo, x, y, l, h);
    return;
  }

  const cctx = calque.getContext("2d", { willReadFrequently: true });
  if (!cctx) return;
  calque.width = l;
  calque.height = h;
  cctx.clearRect(0, 0, l, h);
  cctx.drawImage(logo, 0, 0, l, h);

  let fond: ImageData;
  let source: ImageData;
  try {
    fond = ctx.getImageData(x, y, l, h);
    source = cctx.getImageData(0, 0, l, h);
  } catch {
    ctx.drawImage(logo, x, y, l, h);
    return;
  }

  const lum = new Float32Array(l * h);
  let somme = 0;
  for (let i = 0; i < l * h; i++) {
    const p = i * 4;
    const v =
      0.2126 * fond.data[p] +
      0.7152 * fond.data[p + 1] +
      0.0722 * fond.data[p + 2];
    lum[i] = v;
    somme += v;
  }
  const moyenne = Math.max(1, somme / (l * h));

  // Amplitude du decalage, proportionnelle a la taille du marquage : un logo
  // de 7 cm ne doit pas gondoler autant qu'un dos de 30 cm.
  const amplitude = Math.min(l, h) * 0.05;
  const FORCE_OMBRE = 0.9;

  const sortie = cctx.createImageData(l, h);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < l; i++) {
      const n = j * l + i;

      const gx =
        (lum[j * l + Math.min(l - 1, i + 1)] -
          lum[j * l + Math.max(0, i - 1)]) /
        255;
      const gy =
        (lum[Math.min(h - 1, j + 1) * l + i] -
          lum[Math.max(0, j - 1) * l + i]) /
        255;

      const si = Math.round(i - gx * amplitude);
      const sj = Math.round(j - gy * amplitude);
      if (si < 0 || si >= l || sj < 0 || sj >= h) continue;

      const src = (sj * l + si) * 4;
      const alpha = source.data[src + 3];
      if (alpha === 0) continue;

      const ombre = Math.max(
        0.5,
        Math.min(1.5, 1 + (lum[n] / moyenne - 1) * FORCE_OMBRE),
      );
      const dst = n * 4;
      sortie.data[dst] = Math.min(255, source.data[src] * ombre);
      sortie.data[dst + 1] = Math.min(255, source.data[src + 1] * ombre);
      sortie.data[dst + 2] = Math.min(255, source.data[src + 2] * ombre);
      sortie.data[dst + 3] = alpha;
    }
  }

  cctx.putImageData(sortie, 0, 0);
  // drawImage compose avec l'alpha, contrairement a putImageData qui ecrase.
  ctx.drawImage(calque, x, y);
}

export interface Composition {
  /** Les fichiers d'origine deposes par le client, un par face distincte. */
  logos: File[];
  /** Les PNG composes, une par vue marquee. */
  apercus: File[];
  /** Resume lisible des emplacements retenus, pour le courriel. */
  resume: string;
}

export default function ApercuLogo({
  onComposition,
}: {
  /** Remonte de quoi joindre l'apercu a la demande de devis. */
  onComposition?: (composition: Composition) => void;
}) {
  const [produit, setProduit] = useState<Product>(
    textiles.find((p) => p.ref === "NS332") ?? textiles[0],
  );
  const [coloris, setColoris] = useState<ProductColor>(produit.colors[0]);
  // Un visuel par face : beaucoup de commandes portent un logo coeur devant
  // et un tout autre motif dans le dos.
  const [visuels, setVisuels] = useState<Record<Vue, Visuel | null>>({
    face: null,
    profil: null,
    dos: null,
  });
  // Cas courant : le meme motif des deux cotes. Coche tant que le client n'a
  // pas depose un visuel de dos distinct.
  const [dosIdentique, setDosIdentique] = useState(true);
  const [erreurLogo, setErreurLogo] = useState<string | null>(null);
  const [vue, setVue] = useState<Vue>("face");
  const [telecharge, setTelecharge] = useState(false);
  // Un seul etat pour le chargement, pose une fois les deux vues pretes.
  // Le deduire evite un setState synchrone dans l'effet, qui relancerait un
  // rendu avant meme que le chargement ait commence.
  const [charge, setCharge] = useState<{ cle: string; vues: Vue[] } | null>(
    null,
  );

  const [reglages, setReglages] = useState<Record<string, Reglage>>(() => {
    const init: Record<string, Reglage> = {};
    for (const t of textiles) {
      const famille = familleDe(t);
      const liste = emplacementsDe(famille);
      for (const e of liste) {
        init[cleReglage(famille, e.id)] = {
          // Le premier emplacement de chaque famille est coche d'office.
          actif: e.id === liste[0].id,
          cm: e.cmDefaut,
        };
      }
    }
    return init;
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vetementsRef = useRef<
    Partial<Record<Vue, { image: HTMLImageElement; boite: BoiteVetement }>>
  >({});
  const inputsRef = useRef<Partial<Record<Vue, HTMLInputElement | null>>>({});
  // Un seul calque hors ecran, reutilise a chaque marquage.
  const calqueRef = useRef<HTMLCanvasElement>(
    typeof document === "undefined"
      ? (null as unknown as HTMLCanvasElement)
      : document.createElement("canvas"),
  );

  const famille = familleDe(produit);
  const emplacements = emplacementsDe(famille);
  const reglageDe = useCallback(
    (e: Emplacement) => reglages[cleReglage(famille, e.id)],
    [reglages, famille],
  );

  const urls = useMemo(() => {
    const face = getColorImages(produit, coloris)[0];
    // Seul Toptex publie le dos (-B) et le profil (-S).
    const autres =
      produit.packshotSource === "none"
        ? null
        : getPackshotImages(produit.ref, coloris.slug);
    return {
      face: viaRelais(face),
      profil: autres ? viaRelais(autres[2]) : null,
      dos: autres ? viaRelais(autres[1]) : null,
    };
  }, [produit, coloris]);

  /** Le visuel effectivement pose sur une face. */
  const visuelPour = useCallback(
    (cible: Vue): Visuel | null => {
      // La manche porte forcement le visuel du devant : personne ne depose un
      // troisieme fichier pour un marquage de 7 cm.
      if (cible === "profil") return visuels.face;
      if (cible === "dos" && dosIdentique) return visuels.face;
      return visuels[cible];
    },
    [visuels, dosIdentique],
  );

  /**
   * Largeur reellement rendue, une fois la contrainte de hauteur appliquee.
   * Le curseur demande une largeur, mais un visuel haut est reduit pour tenir
   * dans sa zone : afficher la valeur demandee serait mentir sur le rendu.
   */
  const largeurEffective = useCallback(
    (e: Emplacement, cm: number) => {
      const visuel = visuelPour(e.vue);
      if (!visuel || !e.hauteurMaxCm) return cm;
      const proportion = visuel.image.naturalHeight / visuel.image.naturalWidth;
      const hauteurCm = cm * proportion;
      if (hauteurCm <= e.hauteurMaxCm) return cm;
      return Math.round((e.hauteurMaxCm / proportion) * 10) / 10;
    },
    [visuelPour],
  );

  const cle = `${urls.face}|${urls.profil}|${urls.dos}`;
  const enCours = charge?.cle !== cle;
  // Memoise : sans cela, le tableau vide par defaut serait recree a chaque
  // rendu et relancerait les calculs qui en dependent.
  const vuesChargees = useMemo(() => charge?.vues ?? [], [charge]);
  const dosDisponible = vuesChargees.includes("dos");
  // Changer de textile peut faire disparaitre un angle : on retombe sur la
  // face sans avoir a corriger l'etat, donc sans rendu supplementaire.
  const vueAffichee = vuesChargees.includes(vue) ? vue : "face";

  // Charge les deux vues du vetement et mesure ses bords une fois pour toutes.
  useEffect(() => {
    let annule = false;

    (async () => {
      const chargees: Partial<Record<Vue, HTMLImageElement>> = {};
      for (const cible of ["face", "profil", "dos"] as Vue[]) {
        const url = urls[cible];
        if (!url) continue;
        const img = await chargerImage(url).catch(() => null);
        if (annule) return;
        if (img) chargees[cible] = img;
      }

      vetementsRef.current = {};
      const vues: Vue[] = [];
      for (const [cible, img] of Object.entries(chargees) as [
        Vue,
        HTMLImageElement,
      ][]) {
        vetementsRef.current[cible] = {
          image: img,
          boite: mesurerVetement(img),
        };
        vues.push(cible);
      }
      setCharge({ cle, vues });
    })();

    return () => {
      annule = true;
    };
  }, [urls, cle]);

  /** Compose une vue sur un canvas ; sert a l'ecran comme a l'export. */
  const composer = useCallback(
    (canvas: HTMLCanvasElement, cible: Vue, cote: number) => {
      const vetement = vetementsRef.current[cible];
      const ctx = canvas.getContext("2d");
      if (!ctx || !vetement) return false;

      const { image, boite } = vetement;
      const ratio = image.naturalHeight / image.naturalWidth;
      canvas.width = cote;
      canvas.height = Math.round(cote * ratio);

      ctx.fillStyle = "#f5f5f5";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      const visuel = visuelPour(cible);
      if (!visuel) return true;
      const logo = visuel.image;

      const k = canvas.width / image.naturalWidth;
      // Les trois packshots sont pris a la meme echelle : la hauteur du
      // vetement y est identique. On calibre donc les centimetres sur la vue
      // de face, ou la largeur reelle est connue, et on reporte le rapport.
      // Les packshots d'une meme reference sont pris a la meme echelle : le
      // rapport pixels/centimetre y est constant. On le calibre donc une fois
      // sur la vue de face, ou la largeur reelle est connue, et on l'applique
      // tel quel aux autres vues.
      //
      // Le reporter au prorata des hauteurs serait faux : un t-shirt fait la
      // meme hauteur de face et de profil, mais une casquette non.
      const reference = vetementsRef.current.face ?? vetement;
      const kFace = canvas.width / reference.image.naturalWidth;
      const cmParPixel =
        largeurVetementCm(produit) / (reference.boite.largeur * kFace);

      for (const e of emplacements) {
        if (e.vue !== cible) continue;
        const r = reglageDe(e);
        if (!r?.actif) continue;

        let largeur = r.cm / cmParPixel;
        let hauteur = (logo.naturalHeight / logo.naturalWidth) * largeur;

        // Un visuel large et bas tient dans les centimetres demandes ; un
        // visuel haut deborderait la zone. On le reduit alors, plutot que de
        // le laisser mordre sur la visiere ou sur l'ourlet.
        if (e.hauteurMaxCm) {
          const plafond = e.hauteurMaxCm / cmParPixel;
          if (hauteur > plafond) {
            largeur *= plafond / hauteur;
            hauteur = plafond;
          }
        }

        const x = boite.x * k + boite.largeur * k * e.centreX - largeur / 2;
        const repere = boite.y * k + boite.hauteur * k * e.hautY;
        const y = e.ancrage === "centre" ? repere - hauteur / 2 : repere;
        poserDansLeTissu(ctx, calqueRef.current, logo, {
          x,
          y,
          l: largeur,
          h: hauteur,
        });
      }
      return true;
    },
    [visuelPour, produit, emplacements, reglageDe],
  );

  useEffect(() => {
    if (enCours || !canvasRef.current) return;
    composer(canvasRef.current, vueAffichee, RENDU);
  }, [composer, vueAffichee, enCours]);

  /**
   * Les vues qui portent un marquage et disposent d'un visuel.
   *
   * Deduit de l'etat, pas du ref des images : lire un ref pendant le rendu
   * ne declencherait pas de nouveau rendu quand il change.
   */
  const vuesMarquees = useMemo(
    () =>
      vuesChargees.filter(
        (cible) =>
          visuelPour(cible) &&
          emplacements.some((e) => e.vue === cible && reglageDe(e)?.actif),
      ),
    [vuesChargees, visuelPour, emplacements, reglageDe],
  );

  /**
   * Une seule planche pour toutes les vues marquees.
   *
   * Un fichier par cote obligeait a lancer autant de telechargements, et
   * l'atelier recevait des images separees a rapprocher a la main. La planche
   * porte son propre libelle : ouverte seule, elle dit de quel modele, de quel
   * coloris et de quels marquages elle parle.
   */
  const composerPlanche = useCallback(
    (cote: number): HTMLCanvasElement | null => {
      if (vuesMarquees.length === 0) return null;

      const vignettes: HTMLCanvasElement[] = [];
      for (const cible of vuesMarquees) {
        const c = document.createElement("canvas");
        if (composer(c, cible, cote)) vignettes.push(c);
      }
      if (vignettes.length === 0) return null;

      const hauteurVues = Math.max(...vignettes.map((v) => v.height));
      const bandeau = Math.round(cote * 0.09);
      const planche = document.createElement("canvas");
      planche.width = vignettes.reduce((t, v) => t + v.width, 0);
      planche.height = hauteurVues + bandeau;

      const ctx = planche.getContext("2d");
      if (!ctx) return null;
      ctx.fillStyle = "#f5f5f5";
      ctx.fillRect(0, 0, planche.width, planche.height);

      let x = 0;
      for (const v of vignettes) {
        ctx.drawImage(v, x, 0);
        x += v.width;
      }

      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, hauteurVues, planche.width, bandeau);
      ctx.fillStyle = "#C5FF00";
      ctx.font = `bold ${Math.round(bandeau * 0.3)}px sans-serif`;
      ctx.textBaseline = "middle";
      const marge = Math.round(cote * 0.03);
      ctx.fillText(
        `${produit.ref} · ${produit.name}`,
        marge,
        hauteurVues + bandeau * 0.36,
      );
      ctx.fillStyle = "#FFFFFF";
      ctx.font = `${Math.round(bandeau * 0.26)}px sans-serif`;
      const details = emplacements
        .filter((e) => reglageDe(e)?.actif)
        .map((e) => `${e.nom} ${largeurEffective(e, reglageDe(e).cm)} cm`)
        .join("  ·  ");
      const teinte =
        produit.packshotSource === "none" ? "coloris à préciser" : coloris.name;
      ctx.fillText(
        `${teinte}  ·  ${details}`,
        marge,
        hauteurVues + bandeau * 0.72,
      );

      return planche;
    },
    [
      composer,
      vuesMarquees,
      emplacements,
      reglageDe,
      largeurEffective,
      produit,
      coloris,
    ],
  );

  /** La planche, prete a joindre ou a telecharger. */
  const exporter = useCallback(async (): Promise<File[]> => {
    const planche = composerPlanche(RENDU);
    if (!planche) return [];
    const blob = await new Promise<Blob | null>((r) =>
      // JPEG plutot que PNG : une planche de trois vues en PNG depasse les
      // 4 Mo acceptes en piece jointe, pour un gain invisible sur un apercu.
      planche.toBlob(r, "image/jpeg", 0.92),
    );
    if (!blob) return [];
    return [
      new File([blob], `apercu-${produit.ref}.jpg`, { type: "image/jpeg" }),
    ];
  }, [composerPlanche, produit.ref]);

  const resume = useMemo(() => {
    const parts = emplacements
      .filter((e) => reglageDe(e)?.actif)
      .map((e) => {
        const v =
          e.vue === "dos" && dosIdentique ? visuels.face : visuels[e.vue];
        const fichier = v ? ` (${v.fichier.name})` : " (aucun visuel)";
        return `${e.nom} ${largeurEffective(e, reglageDe(e).cm)} cm${fichier}`;
      });
    if (!parts.length) return "";
    return `${produit.ref} ${produit.name}, coloris ${coloris.name} — ${parts.join(", ")}`;
  }, [
    emplacements,
    reglageDe,
    largeurEffective,
    produit,
    coloris,
    visuels,
    dosIdentique,
  ]);

  // Les apercus composes remontent au formulaire, qui les joint au courriel.
  // Les fichiers d'origine, sans doublon si le dos reprend celui du devant.
  const originaux = useMemo(() => {
    const liste: File[] = [];
    if (visuels.face) liste.push(visuels.face.fichier);
    if (!dosIdentique && visuels.dos) liste.push(visuels.dos.fichier);
    return liste;
  }, [visuels, dosIdentique]);

  useEffect(() => {
    if (!onComposition) return;
    if (originaux.length === 0 || enCours) {
      onComposition({ logos: originaux, apercus: [], resume });
      return;
    }
    let annule = false;
    exporter().then((apercus) => {
      if (!annule) onComposition({ logos: originaux, apercus, resume });
    });
    return () => {
      annule = true;
    };
  }, [exporter, onComposition, enCours, originaux, resume]);

  const choisirVisuel = async (cible: Vue, file: File | undefined) => {
    if (!file) return;
    setErreurLogo(null);
    if (file.size > POIDS_MAX) {
      setErreurLogo("Fichier trop lourd (6 Mo max).");
      return;
    }
    if (!FORMATS_LOGO.includes(file.type)) {
      setErreurLogo("Formats acceptés : PNG, JPG, WEBP, SVG.");
      return;
    }
    try {
      const img = await chargerImage(URL.createObjectURL(file));
      setVisuels((p) => ({ ...p, [cible]: { image: img, fichier: file } }));
      // Deposer un visuel de dos, c'est vouloir un motif different.
      if (cible === "dos") setDosIdentique(false);
    } catch {
      setErreurLogo("Ce fichier n'a pas pu être lu.");
    }
  };

  const retirerVisuel = (cible: Vue) => {
    setVisuels((p) => ({ ...p, [cible]: null }));
    if (cible === "dos") setDosIdentique(true);
  };

  const telecharger = async () => {
    const planche = composerPlanche(RENDU * 2);
    if (!planche) return;
    const blob = await new Promise<Blob | null>((r) =>
      planche.toBlob(r, "image/jpeg", 0.95),
    );
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const lien = document.createElement("a");
    lien.href = url;
    lien.download = `apercu-${produit.ref}-${coloris.slug.toLowerCase()}.jpg`;
    lien.click();
    URL.revokeObjectURL(url);

    setTelecharge(true);
    setTimeout(() => setTelecharge(false), 2200);
  };

  // Les trois marquages avant occupent la meme zone : les cumuler donnerait un
  // apercu impossible a produire. Choisir l'un desactive les autres ; le dos
  // reste independant, un logo coeur avec un grand dos est courant.
  const basculer = (cible: Emplacement) =>
    setReglages((prev) => {
      const cle = cleReglage(famille, cible.id);
      const actif = !prev[cle].actif;
      const suivant = { ...prev, [cle]: { ...prev[cle], actif } };
      if (actif) {
        for (const e of emplacements) {
          if (e.id === cible.id || e.vue !== cible.vue) continue;
          const autre = cleReglage(famille, e.id);
          suivant[autre] = { ...prev[autre], actif: false };
        }
      }
      return suivant;
    });

  const regler = (e: Emplacement, cm: number) =>
    setReglages((p) => {
      const cle = cleReglage(famille, e.id);
      return { ...p, [cle]: { ...p[cle], cm } };
    });

  const actifs = emplacements.filter((e) => reglageDe(e)?.actif);
  const marquagesSurLaVue = actifs.filter((e) => e.vue === vueAffichee).length;

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-10">
      {/* ── Aperçu ─────────────────────────────────────────────── */}
      <div>
        {vuesChargees.length > 1 && (
          <div className="flex gap-2 mb-3">
            {vuesChargees.map((v) => {
              const n = actifs.filter((e) => e.vue === v).length;
              return (
                <button
                  key={v}
                  onClick={() => setVue(v)}
                  className={`font-heading text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg border transition-colors duration-200 cursor-pointer ${
                    vueAffichee === v
                      ? "border-[#C5FF00] bg-[#C5FF00]/10 text-[#C5FF00]"
                      : "border-[#2a2a2a] text-white/50 hover:border-white/30"
                  }`}
                >
                  {ETIQUETTE_VUE[v]}
                  {n > 0 && <span className="ml-1.5 text-white/40">{n}</span>}
                </button>
              );
            })}
          </div>
        )}

        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#f5f5f5]">
          {enCours ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-black/25" />
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain"
              aria-label={`Aperçu ${produit.ref} ${coloris.name}, vue ${vueAffichee}`}
            />
          )}

          {!visuelPour(vueAffichee) && !enCours && (
            <button
              onClick={() => inputsRef.current.face?.click()}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/45 backdrop-blur-[2px] cursor-pointer group"
            >
              <Upload
                className="w-7 h-7 text-[#C5FF00] group-hover:scale-110 transition-transform duration-200"
                strokeWidth={2}
              />
              <span className="font-heading text-sm font-bold uppercase tracking-wider text-white">
                {vueAffichee === "dos"
                  ? "Dépose le visuel du dos"
                  : "Dépose ton visuel"}
              </span>
              <span className="font-body text-xs text-white/60">
                PNG, JPG, WEBP ou SVG
              </span>
            </button>
          )}

          {visuelPour(vueAffichee) && marquagesSurLaVue === 0 && (
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-body text-[11px] text-black/45 bg-white/85 rounded-full px-3 py-1.5">
              Aucun marquage sur cette vue
            </span>
          )}
        </div>

        <p className="font-body text-[11px] text-white/30 mt-3 leading-relaxed">
          Simulation indicative : les proportions sont calculées sur une largeur
          de vêtement moyenne, la teinte dépend de ton écran. Le BAT reste la
          référence avant production.
        </p>
      </div>

      {/* ── Réglages ───────────────────────────────────────────── */}
      <div className="space-y-6">
        <div>
          <span className="font-heading text-xs font-bold text-white/60 uppercase tracking-wider block mb-2.5">
            Tes visuels
          </span>

          <div className="space-y-2">
            {(dosDisponible
              ? (["face", "dos"] as Vue[])
              : (["face"] as Vue[])
            ).map((cible) => {
              const visuel = visuels[cible];
              const herite = cible === "dos" && dosIdentique;
              return (
                <div
                  key={cible}
                  className="rounded-xl border border-[#222] bg-[#111] p-3"
                >
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="font-heading text-[11px] font-bold uppercase tracking-wider text-white/70">
                      {cible === "face" ? "Devant" : "Dos"}
                    </span>
                    {(visuel || herite) && (
                      <span className="font-body text-[11px] text-white/30 truncate">
                        {herite
                          ? "reprend le visuel du devant"
                          : visuel!.fichier.name}
                      </span>
                    )}
                  </div>

                  <input
                    ref={(el) => {
                      inputsRef.current[cible] = el;
                    }}
                    type="file"
                    accept={FORMATS_LOGO.join(",")}
                    onChange={(ev) =>
                      choisirVisuel(cible, ev.target.files?.[0])
                    }
                    className="hidden"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => inputsRef.current[cible]?.click()}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#2a2a2a] font-heading text-[11px] font-bold uppercase tracking-wider text-white/70 hover:border-[#C5FF00]/50 hover:text-[#C5FF00] transition-colors duration-200 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" strokeWidth={2.5} />
                      {visuel
                        ? "Changer"
                        : cible === "dos"
                          ? "Visuel différent"
                          : "Choisir un fichier"}
                    </button>
                    {visuel && (
                      <button
                        onClick={() => {
                          retirerVisuel(cible);
                          const input = inputsRef.current[cible];
                          if (input) input.value = "";
                        }}
                        aria-label={`Retirer le visuel ${cible === "face" ? "du devant" : "du dos"}`}
                        className="px-3 rounded-lg border border-[#2a2a2a] text-white/40 hover:text-red-400 hover:border-red-400/40 transition-colors duration-200 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {erreurLogo && (
            <p className="font-body text-[11px] text-red-400 mt-2">
              {erreurLogo}
            </p>
          )}
          <p className="font-body text-[11px] text-white/25 mt-2 leading-relaxed">
            Sans visuel de dos, le devant est repris à l&apos;identique. Un PNG
            à fond transparent donne le rendu le plus fidèle. Tes fichiers
            restent dans ton navigateur tant que tu n&apos;envoies pas de
            demande.
          </p>
        </div>

        <div>
          <span className="font-heading text-xs font-bold text-white/60 uppercase tracking-wider block mb-2.5">
            Emplacements
          </span>
          <div className="space-y-2">
            {emplacements.map((e) => {
              const r = reglageDe(e);
              const indisponible = !vuesChargees.includes(e.vue);
              return (
                <div
                  key={e.id}
                  className={`rounded-xl border transition-colors duration-200 ${
                    r.actif
                      ? "border-[#C5FF00]/40 bg-[#C5FF00]/[0.04]"
                      : "border-[#222] bg-[#111]"
                  } ${indisponible ? "opacity-40" : ""}`}
                >
                  <button
                    onClick={() => !indisponible && basculer(e)}
                    disabled={indisponible}
                    className="w-full flex items-center gap-3 p-3 text-left cursor-pointer disabled:cursor-not-allowed"
                  >
                    <span
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors duration-200 ${
                        r.actif
                          ? "border-[#C5FF00] bg-[#C5FF00]"
                          : "border-[#333]"
                      }`}
                    >
                      {r.actif && (
                        <Check
                          className="w-3 h-3 text-[#0A0A0A]"
                          strokeWidth={4}
                        />
                      )}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="font-heading text-sm font-bold uppercase text-white block">
                        {e.nom}
                      </span>
                      <span className="font-body text-[11px] text-white/35">
                        {indisponible
                          ? "Le fournisseur ne publie pas cet angle"
                          : e.aide}
                      </span>
                    </span>
                    {r.actif && (
                      <span className="font-heading text-xs text-[#C5FF00] shrink-0">
                        {largeurEffective(e, r.cm)} cm
                      </span>
                    )}
                  </button>

                  {r.actif && !indisponible && (
                    <div className="px-3 pb-3">
                      <input
                        type="range"
                        min={e.cmMin}
                        max={e.cmMax}
                        step={1}
                        value={r.cm}
                        onChange={(ev) => regler(e, Number(ev.target.value))}
                        aria-label={`Largeur du marquage ${e.nom}`}
                        className="w-full accent-[#C5FF00] cursor-pointer"
                      />
                      <div className="flex justify-between font-body text-[10px] text-white/25 mt-0.5">
                        <span>{e.cmMin} cm</span>
                        <span>{e.cmMax} cm</span>
                      </div>
                      {largeurEffective(e, r.cm) < r.cm && (
                        <p className="font-body text-[10px] text-white/40 mt-1.5 leading-relaxed">
                          Réduit à {largeurEffective(e, r.cm)} cm : ton visuel
                          est trop haut pour la zone, limitée à {e.hauteurMaxCm}{" "}
                          cm.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="font-body text-[11px] text-white/25 mt-2.5 leading-relaxed">
            {famille === "casquette"
              ? "Trois zones étroites sur une casquette : le panneau avant, un côté, l'arrière au-dessus de la fermeture. Un seul marquage par vue."
              : famille === "totebag"
                ? "Une seule face marquable sur un tote bag. Largeur limitée à 28 cm pour garder une marge sur les coutures."
                : famille === "hoodie"
                  ? "Un seul marquage par face. Le grand devant s'arrête à 26 cm pour ne pas mordre sur la poche kangourou."
                  : "Un seul marquage par face : les formats avant occupent la même zone. Largeur limitée à 30 cm, celle du film DTF de l'atelier."}
          </p>
        </div>

        <div>
          <span className="font-heading text-xs font-bold text-white/60 uppercase tracking-wider block mb-2.5">
            Textile
          </span>
          <div className="grid grid-cols-2 gap-2">
            {textiles.map((p) => {
              const choisi = p.ref === produit.ref;
              return (
                <button
                  key={p.ref}
                  onClick={() => {
                    setProduit(p);
                    setColoris(p.colors[0]);
                    setVue("face");
                  }}
                  className={`p-3 rounded-xl border text-left transition-colors duration-200 cursor-pointer ${
                    choisi
                      ? "border-[#C5FF00] bg-[#C5FF00]/[0.06]"
                      : "border-[#222] bg-[#111] hover:border-white/25"
                  }`}
                >
                  <span
                    className={`font-heading text-xs font-bold uppercase block ${
                      choisi ? "text-[#C5FF00]" : "text-white"
                    }`}
                  >
                    {ETIQUETTE_FAMILLE[familleDe(p)]}
                  </span>
                  <span className="font-body text-[10px] text-white/30 block mt-0.5">
                    {p.ref} &middot; {p.grammage}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sans photo par coloris, les pastilles ne feraient que promettre un
              changement qui n'arrive pas. On annonce le coloris du visuel. */}
          {produit.packshotSource !== "none" && (
            <div className="flex flex-wrap gap-2 mt-3">
              {produit.colors.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setColoris(c)}
                  title={c.name}
                  aria-label={c.name}
                  className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                    coloris.slug === c.slug
                      ? "border-[#C5FF00] scale-110"
                      : "border-[#333] hover:border-white/40"
                  }`}
                >
                  <Image
                    src={getColorSwatch(produit.ref, c)}
                    alt=""
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
          <p className="font-body text-[11px] text-white/35 mt-2">
            {produit.packshotSource === "none"
              ? produit.name
              : `${coloris.name} · ${produit.name}`}
          </p>
          {produit.packshotSource === "none" && (
            <p className="font-body text-[11px] text-white/25 mt-1.5 leading-relaxed">
              {produit.colors.length} coloris au catalogue, mais le fournisseur
              n&apos;en photographie qu&apos;un : l&apos;aperçu sert à juger le
              placement, pas la teinte. Précise le coloris voulu dans ta
              demande.
            </p>
          )}
        </div>

        <button
          onClick={telecharger}
          disabled={originaux.length === 0 || actifs.length === 0}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#C5FF00] text-[#0A0A0A] font-heading text-sm font-bold uppercase tracking-wider hover:bg-[#9ECC00] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors duration-200"
        >
          {telecharge ? (
            <>
              <Check className="w-4 h-4" strokeWidth={3} />
              Téléchargé
            </>
          ) : (
            <>
              <Download className="w-4 h-4" strokeWidth={2.5} />
              Télécharger l&apos;aperçu
              {actifs.length > 1 && (
                <span className="font-body text-[11px] normal-case tracking-normal opacity-60">
                  ({vuesMarquees.length} vues, 1 fichier)
                </span>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
