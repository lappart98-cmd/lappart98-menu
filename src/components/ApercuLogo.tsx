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
  EMPLACEMENTS,
  emplacementParId,
  largeurVetementCm,
  mesurerVetement,
  type BoiteVetement,
  type Vue,
} from "@/lib/apercu";

/** Le relais rend l'image de meme origine, seule condition pour l'exporter. */
const viaRelais = (url: string) => `/api/packshot?url=${encodeURIComponent(url)}`;

/** Cote du rendu a l'ecran. L'export double cette resolution. */
const RENDU = 900;

const FORMATS_LOGO = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const POIDS_MAX = 6 * 1024 * 1024;

/** Seuls les articles dont le fournisseur publie un packshot par coloris. */
const textiles = products.filter((p) => p.packshotSource !== "none");

interface Reglage {
  actif: boolean;
  cm: number;
}

function chargerImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(src));
    img.src = src;
  });
}

export interface Composition {
  /** Le fichier d'origine depose par le client. */
  logo: File | null;
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
    textiles.find((p) => p.ref === "NS332") ?? textiles[0]
  );
  const [coloris, setColoris] = useState<ProductColor>(produit.colors[0]);
  const [logo, setLogo] = useState<HTMLImageElement | null>(null);
  const [fichierLogo, setFichierLogo] = useState<File | null>(null);
  const [erreurLogo, setErreurLogo] = useState<string | null>(null);
  const [vue, setVue] = useState<Vue>("face");
  const [telecharge, setTelecharge] = useState(false);
  // Un seul etat pour le chargement, pose une fois les deux vues pretes.
  // Le deduire evite un setState synchrone dans l'effet, qui relancerait un
  // rendu avant meme que le chargement ait commence.
  const [charge, setCharge] = useState<{ cle: string; dos: boolean } | null>(
    null
  );

  const [reglages, setReglages] = useState<Record<string, Reglage>>(() =>
    Object.fromEntries(
      EMPLACEMENTS.map((e) => [
        e.id,
        { actif: e.id === "coeur", cm: e.cmDefaut },
      ])
    )
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vetementsRef = useRef<
    Partial<Record<Vue, { image: HTMLImageElement; boite: BoiteVetement }>>
  >({});
  const inputRef = useRef<HTMLInputElement>(null);

  const urls = useMemo(() => {
    const face = getColorImages(produit, coloris)[0];
    const dos = getPackshotImages(produit.ref, coloris.slug)[1];
    return { face: viaRelais(face), dos: viaRelais(dos) };
  }, [produit, coloris]);

  const cle = `${urls.face}|${urls.dos}`;
  const enCours = charge?.cle !== cle;
  const dosDisponible = charge?.dos ?? false;

  // Charge les deux vues du vetement et mesure ses bords une fois pour toutes.
  useEffect(() => {
    let annule = false;

    (async () => {
      const face = await chargerImage(urls.face).catch(() => null);
      if (annule) return;
      const dos = await chargerImage(urls.dos).catch(() => null);
      if (annule) return;

      vetementsRef.current = {};
      if (face) {
        vetementsRef.current.face = { image: face, boite: mesurerVetement(face) };
      }
      if (dos) {
        vetementsRef.current.dos = { image: dos, boite: mesurerVetement(dos) };
      } else {
        setVue("face");
      }
      setCharge({ cle, dos: Boolean(dos) });
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

      if (!logo) return true;

      const k = canvas.width / image.naturalWidth;
      const cmParPixel = largeurVetementCm(produit) / (boite.largeur * k);

      for (const e of EMPLACEMENTS) {
        if (e.vue !== cible) continue;
        const r = reglages[e.id];
        if (!r?.actif) continue;

        const largeur = r.cm / cmParPixel;
        const hauteur = (logo.naturalHeight / logo.naturalWidth) * largeur;
        const x = boite.x * k + boite.largeur * k * e.centreX - largeur / 2;
        const y = boite.y * k + boite.hauteur * k * e.hautY;
        ctx.drawImage(logo, x, y, largeur, hauteur);
      }
      return true;
    },
    [logo, produit, reglages]
  );

  useEffect(() => {
    if (enCours || !canvasRef.current) return;
    composer(canvasRef.current, vue, RENDU);
  }, [composer, vue, enCours]);

  /** Rend chaque vue portant un marquage, en PNG. */
  const exporter = useCallback(async (): Promise<File[]> => {
    const fichiers: File[] = [];
    for (const cible of ["face", "dos"] as Vue[]) {
      const utilisee = EMPLACEMENTS.some(
        (e) => e.vue === cible && reglages[e.id]?.actif
      );
      if (!utilisee || !vetementsRef.current[cible]) continue;

      const canvas = document.createElement("canvas");
      if (!composer(canvas, cible, RENDU * 2)) continue;
      const blob = await new Promise<Blob | null>((r) =>
        canvas.toBlob(r, "image/png")
      );
      if (!blob) continue;
      fichiers.push(
        new File([blob], `apercu-${produit.ref}-${cible}.png`, {
          type: "image/png",
        })
      );
    }
    return fichiers;
  }, [composer, produit.ref, reglages]);

  const resume = useMemo(() => {
    const parts = EMPLACEMENTS.filter((e) => reglages[e.id]?.actif).map(
      (e) => `${e.nom} ${reglages[e.id].cm} cm`
    );
    return parts.length
      ? `${produit.ref} ${produit.name}, coloris ${coloris.name} — ${parts.join(", ")}`
      : "";
  }, [reglages, produit, coloris]);

  // Les apercus composes remontent au formulaire, qui les joint au courriel.
  useEffect(() => {
    if (!onComposition) return;
    if (!logo || enCours) {
      onComposition({ logo: fichierLogo, apercus: [], resume });
      return;
    }
    let annule = false;
    exporter().then((apercus) => {
      if (!annule) onComposition({ logo: fichierLogo, apercus, resume });
    });
    return () => {
      annule = true;
    };
  }, [exporter, onComposition, logo, enCours, fichierLogo, resume]);

  const choisirLogo = async (file: File | undefined) => {
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
    const url = URL.createObjectURL(file);
    try {
      const img = await chargerImage(url);
      setLogo(img);
      setFichierLogo(file);
    } catch {
      setErreurLogo("Ce fichier n'a pas pu être lu.");
    }
  };

  const telecharger = async () => {
    const fichiers = await exporter();
    for (const f of fichiers) {
      const url = URL.createObjectURL(f);
      const a = document.createElement("a");
      a.href = url;
      a.download = f.name;
      a.click();
      URL.revokeObjectURL(url);
    }
    setTelecharge(true);
    setTimeout(() => setTelecharge(false), 2200);
  };

  // Les trois marquages avant occupent la meme zone : les cumuler donnerait un
  // apercu impossible a produire. Choisir l'un desactive les autres ; le dos
  // reste independant, un logo coeur avec un grand dos est courant.
  const basculer = (id: string) =>
    setReglages((prev) => {
      const cible = emplacementParId(id);
      const suivant = { ...prev };
      const actif = !prev[id].actif;
      suivant[id] = { ...prev[id], actif };
      if (actif && cible) {
        for (const e of EMPLACEMENTS) {
          if (e.id !== id && e.vue === cible.vue) {
            suivant[e.id] = { ...prev[e.id], actif: false };
          }
        }
      }
      return suivant;
    });

  const regler = (id: string, cm: number) =>
    setReglages((p) => ({ ...p, [id]: { ...p[id], cm } }));

  const actifs = EMPLACEMENTS.filter((e) => reglages[e.id]?.actif);
  const marquagesSurLaVue = actifs.filter((e) => e.vue === vue).length;

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-10">
      {/* ── Aperçu ─────────────────────────────────────────────── */}
      <div>
        {dosDisponible && (
          <div className="flex gap-2 mb-3">
            {(["face", "dos"] as Vue[]).map((v) => {
              const n = actifs.filter((e) => e.vue === v).length;
              return (
                <button
                  key={v}
                  onClick={() => setVue(v)}
                  className={`font-heading text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg border transition-colors duration-200 cursor-pointer ${
                    vue === v
                      ? "border-[#C5FF00] bg-[#C5FF00]/10 text-[#C5FF00]"
                      : "border-[#2a2a2a] text-white/50 hover:border-white/30"
                  }`}
                >
                  {v === "face" ? "Devant" : "Dos"}
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
              aria-label={`Aperçu ${produit.ref} ${coloris.name}, vue ${vue}`}
            />
          )}

          {!logo && !enCours && (
            <button
              onClick={() => inputRef.current?.click()}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/45 backdrop-blur-[2px] cursor-pointer group"
            >
              <Upload
                className="w-7 h-7 text-[#C5FF00] group-hover:scale-110 transition-transform duration-200"
                strokeWidth={2}
              />
              <span className="font-heading text-sm font-bold uppercase tracking-wider text-white">
                Dépose ton logo
              </span>
              <span className="font-body text-xs text-white/60">
                PNG, JPG, WEBP ou SVG
              </span>
            </button>
          )}

          {logo && marquagesSurLaVue === 0 && (
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
            Ton visuel
          </span>
          <input
            ref={inputRef}
            type="file"
            accept={FORMATS_LOGO.join(",")}
            onChange={(e) => choisirLogo(e.target.files?.[0])}
            className="hidden"
          />
          <div className="flex gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#2a2a2a] font-heading text-xs font-bold uppercase tracking-wider text-white/70 hover:border-[#C5FF00]/50 hover:text-[#C5FF00] transition-colors duration-200 cursor-pointer"
            >
              <Upload className="w-4 h-4" strokeWidth={2.5} />
              {fichierLogo ? "Changer" : "Choisir un fichier"}
            </button>
            {logo && (
              <button
                onClick={() => {
                  setLogo(null);
                  setFichierLogo(null);
                  if (inputRef.current) inputRef.current.value = "";
                }}
                aria-label="Retirer le visuel"
                className="px-3 rounded-xl border border-[#2a2a2a] text-white/40 hover:text-red-400 hover:border-red-400/40 transition-colors duration-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {fichierLogo && (
            <p className="font-body text-[11px] text-white/35 mt-2 truncate">
              {fichierLogo.name}
            </p>
          )}
          {erreurLogo && (
            <p className="font-body text-[11px] text-red-400 mt-2">{erreurLogo}</p>
          )}
          <p className="font-body text-[11px] text-white/25 mt-2 leading-relaxed">
            Un PNG à fond transparent donne le rendu le plus fidèle. Ton fichier
            reste dans ton navigateur tant que tu n&apos;envoies pas de demande.
          </p>
        </div>

        <div>
          <span className="font-heading text-xs font-bold text-white/60 uppercase tracking-wider block mb-2.5">
            Emplacements
          </span>
          <div className="space-y-2">
            {EMPLACEMENTS.map((e) => {
              const r = reglages[e.id];
              const indisponible = e.vue === "dos" && !dosDisponible;
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
                    onClick={() => !indisponible && basculer(e.id)}
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
                          ? "Pas de visuel de dos pour ce coloris"
                          : e.aide}
                      </span>
                    </span>
                    {r.actif && (
                      <span className="font-heading text-xs text-[#C5FF00] shrink-0">
                        {r.cm} cm
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
                        onChange={(ev) => regler(e.id, Number(ev.target.value))}
                        aria-label={`Largeur du marquage ${e.nom}`}
                        className="w-full accent-[#C5FF00] cursor-pointer"
                      />
                      <div className="flex justify-between font-body text-[10px] text-white/25 mt-0.5">
                        <span>{e.cmMin} cm</span>
                        <span>{e.cmMax} cm</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="font-body text-[11px] text-white/25 mt-2.5 leading-relaxed">
            Un seul marquage par face : les trois formats avant occupent la
            même zone. Largeur limitée à 30 cm, celle du film DTF de
            l&apos;atelier — au-delà, le marquage doit être scindé.
          </p>
        </div>

        <div>
          <span className="font-heading text-xs font-bold text-white/60 uppercase tracking-wider block mb-2.5">
            Textile
          </span>
          <select
            value={produit.ref}
            onChange={(ev) => {
              const p = textiles.find((t) => t.ref === ev.target.value)!;
              setProduit(p);
              setColoris(p.colors[0]);
            }}
            className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-3.5 py-3 font-body text-sm text-white focus:border-[#C5FF00]/50 focus:outline-none cursor-pointer"
          >
            {textiles.map((p) => (
              <option key={p.ref} value={p.ref}>
                {p.ref} — {p.name}
              </option>
            ))}
          </select>

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
          <p className="font-body text-[11px] text-white/35 mt-2">
            {coloris.name} &middot; {produit.grammage}
          </p>
        </div>

        <button
          onClick={telecharger}
          disabled={!logo || actifs.length === 0}
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
            </>
          )}
        </button>
      </div>
    </div>
  );
}
