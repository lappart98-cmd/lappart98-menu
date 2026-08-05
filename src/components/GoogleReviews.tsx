"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Meriem",
    rating: 5,
    text: "J'ai fais appel au service de Romain et n'est pas été déçue. Le travail est de qualité et rapide ! Je recommande grandement.",
    date: "Il y a 2 semaines",
  },
  {
    name: "Key A Dom",
    rating: 5,
    text: "Commande de polos pour mon entreprise : qualité au top, livraison rapide et prix très correct. Tout était parfaitement au rendez-vous. Je recommande sans hésiter.",
    date: "Il y a 2 semaines",
  },
  {
    name: "Mickael Pied",
    rating: 5,
    text: "J'ai demandé des t-shirt personnalisés pour un concert. Le résultat est top et correspond à 100 % à mes attentes. Encore un grand merci.",
    date: "Il y a 2 semaines",
  },
  {
    name: "Elise L.",
    rating: 5,
    text: "Toujours un plaisir de travailler avec l'Appart98 : réactive, professionnelle et force de proposition. Un accompagnement sur mesure que je recommande sans hésitation !",
    date: "Il y a 2 semaines",
  },
  {
    name: "Arnaud Valencia",
    rating: 5,
    text: "Accueil génial, super professionnel, excellente travail !! Absolument faire vos travaux de flocage et publicité chez lui !!",
    date: "Il y a 6 mois",
  },
  {
    name: "Lilie B.",
    rating: 5,
    text: "Boutique original et personnel très accueillants.",
    date: "Il y a 8 mois",
  },
  {
    name: "O D",
    rating: 5,
    text: "Très beau résultat sur les tee-shirts ! À l'écoute des demandes, très réactif et pro. Je recommande à 100 % L'appart 98 !",
    date: "Il y a 10 mois",
  },
  {
    name: "Serey Tan",
    rating: 5,
    text: "Création et pose de visuels pour Atelier 10H10. Nous sommes très content du résultat. Le prix, les délais et la communication sont top. Je recommande.",
    date: "Il y a 10 mois",
  },
  {
    name: "LaPouze Design",
    rating: 5,
    text: "Professionnalisme et passion = travail hyper propre. Romain est très à l'écoute, réactif et pro. Designeuse, je suis très exigeante et avec L'Appart 98, j'ai trouvé mon prestataire idéal. Je vous le recommande les yeux fermés.",
    date: "Il y a 10 mois",
  },
  {
    name: "Sara Jezequel",
    rating: 5,
    text: "Pour un projet d'entreprise j'ai fait confiance à l'appart 98 et je recommande, résultats au top. C'était rapide et dans les temps pour la livraison. Mes collègues étaient tous ravis. Je recommande à 200 % !",
    date: "Févr. 2024",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < count ? "text-yellow-400 fill-yellow-400" : "text-white/20"
          }`}
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

export default function GoogleReviews() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const avgRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <section className="py-16 sm:py-24 relative" ref={ref}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#111_0%,_#0A0A0A_70%)]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white">
              AVIS <span className="text-[#C5FF00]">CLIENTS</span>
            </h2>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Stars count={5} />
            <span className="font-heading text-lg font-bold text-white">
              {avgRating}
            </span>
            <span className="font-body text-sm text-white/40">
              sur Google ({reviews.length} avis)
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-[#141414] border border-[#222] rounded-xl p-5 flex flex-col hover:border-[#C5FF00]/30 transition-colors duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#C5FF00]/10 flex items-center justify-center">
                    <span className="font-heading text-sm font-bold text-[#C5FF00]">
                      {review.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <span className="font-heading text-sm font-bold text-white block">
                      {review.name}
                    </span>
                    <span className="font-body text-[11px] text-white/30">
                      {review.date}
                    </span>
                  </div>
                </div>
                <Stars count={review.rating} />
              </div>
              <p className="font-body text-sm text-white/60 leading-relaxed flex-1">
                {review.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
