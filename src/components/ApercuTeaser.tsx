"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Upload } from "lucide-react";

/**
 * Renvoi vers l'atelier d'apercu.
 *
 * La fleche bat pour attirer l'oeil : c'est la fonction la moins devinable du
 * site, personne ne cherche spontanement a deposer son logo avant de demander
 * un devis. L'animation s'arrete si le visiteur a demande a reduire les
 * animations dans son systeme.
 */
export default function ApercuTeaser() {
  const reduit = useReducedMotion();

  return (
    <section className="py-14 sm:py-20 px-5 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/apercu"
          className="group relative block overflow-hidden rounded-3xl border border-[#C5FF00]/25 bg-gradient-to-br from-[#141414] to-[#0d0d0d] p-6 sm:p-10 hover:border-[#C5FF00]/60 transition-colors duration-300"
        >
          {/* Halo discret qui suit le survol, sans gener la lecture. */}
          <span className="pointer-events-none absolute -right-24 -top-24 w-64 h-64 rounded-full bg-[#C5FF00]/[0.07] blur-3xl group-hover:bg-[#C5FF00]/[0.14] transition-colors duration-500" />

          <div className="relative flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center gap-2 font-heading text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#C5FF00] bg-[#C5FF00]/10 px-3 py-1.5 rounded-full">
                <Upload className="w-3 h-3" strokeWidth={3} />
                Gratuit, sans inscription
              </span>

              <h2 className="font-heading text-2xl sm:text-4xl font-black uppercase text-white leading-[1.05] mt-4">
                Vois ton logo sur le textile
                <span className="text-[#C5FF00]"> avant de commander</span>
              </h2>

              <p className="font-body text-sm text-white/50 leading-relaxed mt-3 max-w-md">
                T-shirt, polo, sweat, hoodie, casquette ou tote bag : dépose
                ton visuel, place-le au cœur, en grand devant ou dans le dos.
                Tu télécharges l&apos;aperçu ou tu l&apos;envoies avec ta
                demande de devis.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Trois chevrons decales : la vague pointe vers le bouton. */}
              <span className="flex items-center" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={reduit ? undefined : { opacity: [0.15, 1, 0.15] }}
                    transition={{
                      duration: 1.1,
                      repeat: Infinity,
                      delay: i * 0.18,
                      ease: "easeInOut",
                    }}
                    className="-ml-1.5 first:ml-0"
                  >
                    <ArrowRight
                      className="w-5 h-5 sm:w-6 sm:h-6 text-[#C5FF00]"
                      strokeWidth={3}
                    />
                  </motion.span>
                ))}
              </span>

              <span className="inline-flex items-center gap-2 bg-[#C5FF00] text-[#0A0A0A] px-5 sm:px-7 py-3.5 sm:py-4 rounded-xl font-heading text-sm font-bold uppercase tracking-wider group-hover:bg-[#9ECC00] transition-colors duration-200 whitespace-nowrap">
                Essaie ton logo
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
