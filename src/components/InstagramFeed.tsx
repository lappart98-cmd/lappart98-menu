"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

export default function InstagramFeed() {
  useEffect(() => {
    if (typeof window !== "undefined" && !(window as any).__bhldScript) {
      (window as any).__bhldScript = true;
      const s = document.createElement("script");
      s.type = "module";
      s.src = "https://w.behold.so/widget.js";
      document.head.append(s);
    }
  }, []);

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0A0A0A]" />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 px-6"
        >
          <a
            href="https://instagram.com/lappart_98"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 group cursor-pointer"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-7 h-7 text-[#C5FF00] group-hover:scale-110 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
            </svg>
            <span className="font-heading text-2xl sm:text-3xl font-black text-white uppercase group-hover:text-[#C5FF00] transition-colors duration-200">
              @lappart_98
            </span>
          </a>
          <p className="font-body text-sm text-white/40 mt-2">
            Nos dernières réalisations
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto px-6">
          {/* @ts-expect-error - Behold custom element */}
          <behold-widget feed-id="u6DTAcrU6pVUs9MuctsR"></behold-widget>
        </div>
      </div>
    </section>
  );
}
