"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Send } from "lucide-react";
import ApercuLogo, { type Composition } from "@/components/ApercuLogo";
import { envoyerDevis, type DevisState } from "@/app/actions/devis";

const initial: DevisState = { status: "idle", message: "" };

const champ =
  "w-full bg-[#111] border rounded-xl px-3.5 py-3 font-body text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#C5FF00]/50 transition-colors duration-200";

export default function ApercuPage() {
  const [etat, action, enCours] = useActionState(envoyerDevis, initial);
  const [composition, setComposition] = useState<Composition>({
    logo: null,
    apercus: [],
    resume: "",
  });
  const fichiersRef = useRef<HTMLInputElement>(null);

  // La reference reste stable : sans useCallback, l'effet de l'atelier
  // d'apercu se relancerait a chaque rendu de cette page.
  const recevoir = useCallback((c: Composition) => setComposition(c), []);

  // Un <input type="file"> ne se remplit qu'avec une FileList. DataTransfer
  // permet d'en fabriquer une a partir des PNG composes dans le navigateur.
  useEffect(() => {
    const input = fichiersRef.current;
    if (!input) return;
    const dt = new DataTransfer();
    if (composition.logo) dt.items.add(composition.logo);
    for (const a of composition.apercus) dt.items.add(a);
    input.files = dt.files;
  }, [composition]);

  const erreurs = etat.fieldErrors ?? {};
  const bordure = (nom: string) =>
    erreurs[nom] ? "border-red-500/60" : "border-[#2a2a2a]";

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-8 sm:py-12">
        <Link
          href="/"
          className="font-heading text-xs tracking-wider uppercase text-white/40 hover:text-[#C5FF00] transition-colors duration-200"
        >
          &larr; Retour à l&apos;accueil
        </Link>

        <header className="mt-6 mb-8 sm:mb-12">
          <h1 className="font-heading text-4xl sm:text-6xl font-black uppercase leading-[0.95]">
            Essaie <span className="text-[#C5FF00]">ton logo</span>
          </h1>
          <p className="font-body text-sm sm:text-base text-white/50 mt-4 max-w-xl leading-relaxed">
            Dépose ton visuel, choisis le textile et les emplacements : tu vois
            le rendu avant même de demander un devis. Rien n&apos;est envoyé
            tant que tu ne remplis pas le formulaire.
          </p>
        </header>

        <ApercuLogo onComposition={recevoir} />

        {/* ── Demande de devis ──────────────────────────────────── */}
        <section className="mt-14 sm:mt-20 border-t border-[#222] pt-10 sm:pt-14">
          <h2 className="font-heading text-2xl sm:text-4xl font-black uppercase">
            Ça te plaît ?{" "}
            <span className="text-[#C5FF00]">Demande le devis</span>
          </h2>
          <p className="font-body text-sm text-white/45 mt-3 max-w-xl">
            {composition.apercus.length > 0
              ? `Ton visuel et ${
                  composition.apercus.length === 1
                    ? "l'aperçu composé partiront"
                    : "les aperçus composés partiront"
                } avec la demande.`
              : "Compose un aperçu ci-dessus et il partira avec ta demande."}
          </p>

          {etat.status === "success" ? (
            <p className="font-heading text-sm font-bold uppercase tracking-wider text-[#C5FF00] bg-[#C5FF00]/10 border border-[#C5FF00]/30 rounded-xl px-4 py-4 mt-6 max-w-xl">
              {etat.message}
            </p>
          ) : (
            <form action={action} className="mt-6 max-w-xl space-y-3">
              {/* Piege a bots, invisible a l'ecran comme au lecteur d'ecran. */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute w-px h-px -left-full opacity-0"
              />
              <input type="hidden" name="formule" value="Essai de visuel" />
              <input
                type="hidden"
                name="message"
                value={
                  composition.resume
                    ? `Aperçu composé sur le site : ${composition.resume}`
                    : "Aperçu non composé."
                }
              />
              <input
                ref={fichiersRef}
                type="file"
                name="logo"
                multiple
                className="hidden"
                tabIndex={-1}
              />

              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  name="nom"
                  placeholder="Ton nom *"
                  defaultValue={etat.values?.nom}
                  className={`${champ} ${bordure("nom")}`}
                />
                <input
                  name="structure"
                  placeholder="Structure / asso"
                  defaultValue={etat.values?.structure}
                  className={`${champ} ${bordure("structure")}`}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  name="email"
                  type="email"
                  placeholder="Email *"
                  defaultValue={etat.values?.email}
                  className={`${champ} ${bordure("email")}`}
                />
                <input
                  name="telephone"
                  type="tel"
                  placeholder="Téléphone *"
                  defaultValue={etat.values?.telephone}
                  className={`${champ} ${bordure("telephone")}`}
                />
              </div>
              <input
                name="tailles"
                placeholder="Quantité et répartition des tailles"
                defaultValue={etat.values?.tailles}
                className={`${champ} ${bordure("tailles")}`}
              />

              {Object.values(erreurs).length > 0 && (
                <p className="font-body text-sm text-red-400">
                  {Object.values(erreurs)[0]}
                </p>
              )}
              {etat.status === "error" && !etat.fieldErrors && (
                <p className="font-body text-sm text-red-400">{etat.message}</p>
              )}

              <button
                type="submit"
                disabled={enCours}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#C5FF00] text-[#0A0A0A] font-heading text-sm font-bold uppercase tracking-wider hover:bg-[#9ECC00] disabled:opacity-60 disabled:cursor-wait cursor-pointer transition-colors duration-200"
              >
                {enCours ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" strokeWidth={2.5} />
                    Envoyer ma demande
                  </>
                )}
              </button>
              <p className="font-body text-[11px] text-white/25 text-center">
                Réponse sous 2 h. On te renvoie un BAT avant toute production.
              </p>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
