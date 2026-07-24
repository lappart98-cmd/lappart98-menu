"use client";

import { motion } from "framer-motion";
import { Palette, Flame, Shirt } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const steps = [
  { icon: Palette, label: "TON\nVISUEL" },
  { icon: Flame, label: "LA\nPOSE" },
  { icon: Shirt, label: "LE\nTEXTILE" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a1a_0%,_#0A0A0A_70%)]" />

      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 49px, #C5FF00 49px, #C5FF00 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, #C5FF00 49px, #C5FF00 50px)",
          }}
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        <motion.div variants={fadeUp} className="mb-4">
          <span className="font-heading text-sm md:text-base tracking-[0.3em] text-white/50 uppercase">
            Atelier textile &middot; Gentilly (94)
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.9] mb-2"
        >
          <span className="text-white">LE </span>
          <span className="text-[#C5FF00]">MENU</span>
        </motion.h1>

        <motion.h2
          variants={fadeUp}
          className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-[0.9] mb-6"
        >
          DE L&apos;ATELIER
        </motion.h2>

        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2 bg-[#141414] border border-[#333] px-4 py-2 mb-12"
        >
          <span className="font-heading text-xs md:text-sm tracking-[0.2em] text-white/60 uppercase">
            DTF &middot; Stickers UV &middot; Broderie
          </span>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-10"
        >
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-4 sm:gap-6">
              <motion.div
                variants={scaleIn}
                whileHover={{ scale: 1.05, borderColor: "#C5FF00" }}
                className="w-28 h-28 sm:w-32 sm:h-32 bg-[#141414] border-2 border-[#333] rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
              >
                <step.icon className="w-8 h-8 text-[#C5FF00]" strokeWidth={1.5} />
                <span className="font-heading text-xs sm:text-sm font-bold text-white text-center uppercase leading-tight whitespace-pre-line">
                  {step.label}
                </span>
              </motion.div>
              {i < steps.length - 1 && (
                <motion.span
                  variants={scaleIn}
                  className="text-[#C5FF00] font-heading text-3xl font-black"
                >
                  +
                </motion.span>
              )}
            </div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp}>
          <span className="font-heading text-2xl sm:text-3xl md:text-4xl font-black text-[#C5FF00]">
            = TA PIECE PERSO
          </span>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="font-body text-base md:text-lg text-white/50 mt-6 max-w-xl mx-auto"
        >
          Compose ton textile personnalise comme au comptoir : choisis ta
          formule, on s&apos;occupe du reste.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#menus"
            className="bg-[#C5FF00] text-[#0A0A0A] px-8 py-4 font-heading text-base font-bold tracking-wider uppercase hover:bg-[#9ECC00] transition-colors duration-200 cursor-pointer"
          >
            Voir les menus
          </a>
          <a
            href="https://wa.me/33675008633"
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-white/20 text-white px-8 py-4 font-heading text-base font-bold tracking-wider uppercase hover:border-[#C5FF00] hover:text-[#C5FF00] transition-colors duration-200 cursor-pointer"
          >
            Devis gratuit
          </a>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="absolute -bottom-4 right-4 sm:right-12 rotate-12"
        >
          <div className="relative">
            <svg
              viewBox="0 0 120 120"
              className="w-24 h-24 sm:w-32 sm:h-32 text-[#C5FF00] animate-[spin_15s_linear_infinite]"
            >
              {Array.from({ length: 16 }).map((_, i) => (
                <polygon
                  key={i}
                  points="60,10 65,50 60,55 55,50"
                  fill="currentColor"
                  transform={`rotate(${i * 22.5} 60 60)`}
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-heading text-[8px] sm:text-[10px] font-bold text-[#0A0A0A] uppercase">
                Sans
              </span>
              <span className="font-heading text-[10px] sm:text-xs font-black text-[#0A0A0A] uppercase">
                Minimum
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-1.5 bg-[#C5FF00] rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
