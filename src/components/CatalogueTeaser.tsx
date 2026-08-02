"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products } from "@/data/products";

export default function CatalogueTeaser() {
  return (
    <section className="py-16 sm:py-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#111_0%,_#0A0A0A_70%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="font-heading text-sm tracking-[0.3em] text-white/40 uppercase block mb-3">
            Nos textiles
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white">
            LE <span className="text-[#C5FF00]">CATALOGUE</span>
          </h2>
          <p className="font-body text-sm text-white/40 mt-3 max-w-md mx-auto">
            Textiles premium personnalisables avec votre visuel
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
        >
          {products.map((product) => (
            <Link
              key={product.ref}
              href={`/catalogue?open=${product.ref}`}
              className="group shrink-0 snap-start w-36 sm:w-44 cursor-pointer"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#222] group-hover:border-[#C5FF00]/40 transition-colors duration-300">
                <Image
                  src={product.defaultImages[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="180px"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-10">
                  <span className="font-heading text-[9px] font-bold tracking-wider uppercase text-[#C5FF00] block">
                    {product.ref}
                  </span>
                  <span className="font-heading text-[11px] font-bold text-white uppercase leading-tight line-clamp-2 block mt-0.5">
                    {product.name}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between px-1">
                <span className="font-heading text-xs font-bold text-[#C5FF00]">
                  {product.price.replace("A partir de ", "des ")}
                </span>
                <span className="font-body text-[10px] text-white/30">
                  {product.colors.length} col.
                </span>
              </div>
            </Link>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-8"
        >
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-3 bg-[#C5FF00] text-[#0A0A0A] px-8 py-4 font-heading text-sm font-bold tracking-wider uppercase hover:bg-[#9ECC00] transition-colors duration-200 cursor-pointer"
          >
            Voir le catalogue
            <ArrowRight className="w-5 h-5" strokeWidth={2} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
