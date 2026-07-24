"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageSquare, PenTool, Package } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "CONTACTE-NOUS",
    description:
      "Envoie-nous ton visuel ou ton idee par WhatsApp. On te repond en moins de 2h avec un devis gratuit.",
  },
  {
    number: "02",
    icon: PenTool,
    title: "ON PREPARE",
    description:
      "On adapte ton visuel, tu valides le BAT. Tu choisis ton textile et ta technique (DTF, stickers UV ou broderie).",
  },
  {
    number: "03",
    icon: Package,
    title: "C'EST PRET",
    description:
      "Production express dans notre atelier a Gentilly. Retrait sur place ou livraison.",
  },
];

export default function Process() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="process" className="py-24 sm:py-32 relative" ref={ref}>
      <div className="absolute inset-0 bg-[#0e0e0e]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="font-heading text-xs tracking-[0.3em] text-white/40 uppercase">
            Simple comme bonjour
          </span>
          <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl font-black uppercase mt-3">
            COMMENT <span className="text-[#C5FF00]">CA MARCHE</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                ease: "easeOut",
              }}
            >
              <motion.div
                whileHover={{ y: -8, borderColor: "#C5FF00" }}
                transition={{ duration: 0.2 }}
                className="relative bg-[#141414] border border-[#222] p-8 sm:p-10 h-full cursor-pointer group"
              >
                <div className="absolute -top-5 left-8">
                  <span className="font-heading text-5xl font-black text-[#C5FF00]/20 group-hover:text-[#C5FF00]/40 transition-colors duration-200">
                    {step.number}
                  </span>
                </div>

                <div className="mt-4 mb-6">
                  <div className="w-14 h-14 bg-[#C5FF00]/10 rounded-xl flex items-center justify-center group-hover:bg-[#C5FF00]/20 transition-colors duration-200">
                    <step.icon
                      className="w-7 h-7 text-[#C5FF00]"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                <h3 className="font-heading text-xl font-bold uppercase mb-3">
                  {step.title}
                </h3>

                <p className="font-body text-sm text-white/50 leading-relaxed">
                  {step.description}
                </p>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-[#C5FF00]/40"
                    >
                      <path
                        d="M5 12h14M13 5l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
