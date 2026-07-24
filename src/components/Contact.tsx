"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Phone, AtSign, Globe, Send } from "lucide-react";

const contactItems = [
  {
    icon: MapPin,
    label: "Atelier",
    value: "65 rue Charles Frerot, 94250 Gentilly",
    href: "https://maps.google.com/?q=65+rue+Charles+Frerot+94250+Gentilly",
  },
  {
    icon: Phone,
    label: "WhatsApp",
    value: "06 75 00 86 33",
    href: "https://wa.me/33675008633",
  },
  {
    icon: AtSign,
    label: "Instagram",
    value: "@lappart_98",
    href: "https://instagram.com/lappart_98",
  },
  {
    icon: Globe,
    label: "Site web",
    value: "www.lappart98.com",
    href: "https://www.lappart98.com",
  },
];

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="py-24 sm:py-32 relative" ref={ref}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_#1a1a0a_0%,_#0A0A0A_70%)]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl font-black uppercase">
            ON <span className="text-[#C5FF00]">T&apos;ATTEND</span>
          </h2>
          <p className="font-body text-base text-white/50 mt-4 max-w-md mx-auto">
            Passe nous voir a l&apos;atelier ou envoie ton projet par WhatsApp.
            Devis gratuit, reponse en moins de 2h.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {contactItems.map((item, index) => (
            <motion.a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, borderColor: "#C5FF00" }}
              className="bg-[#141414] border border-[#222] p-6 flex items-center gap-4 cursor-pointer group transition-colors duration-200"
            >
              <div className="w-12 h-12 bg-[#C5FF00]/10 rounded-xl flex items-center justify-center group-hover:bg-[#C5FF00]/20 transition-colors duration-200 shrink-0">
                <item.icon
                  className="w-5 h-5 text-[#C5FF00]"
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <span className="font-heading text-[10px] tracking-[0.2em] text-white/40 uppercase block">
                  {item.label}
                </span>
                <span className="font-body text-sm text-white group-hover:text-[#C5FF00] transition-colors duration-200">
                  {item.value}
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.a
            href="https://wa.me/33675008633?text=Salut%20!%20Je%20voudrais%20un%20devis%20pour%20du%20textile%20personnalis%C3%A9."
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 bg-[#C5FF00] text-[#0A0A0A] px-10 py-5 font-heading text-lg font-bold tracking-wider uppercase hover:bg-[#9ECC00] transition-colors duration-200 cursor-pointer"
          >
            <Send className="w-5 h-5" strokeWidth={2} />
            Demander un devis gratuit
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
