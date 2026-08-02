"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Leaf,
  Shield,
  Weight,
  Ruler,
  MessageCircle,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import {
  products,
  categories,
  getPackshotImages,
  type Product,
  type Category,
} from "@/data/products";

function ProductCard({
  product,
  isOpen,
  onToggle,
}: {
  product: Product;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [activeColor, setActiveColor] = useState<string | null>(null);

  const currentImages = activeColor
    ? getPackshotImages(product.ref, activeColor)
    : product.defaultImages;

  const handleColorClick = (slug: string) => {
    if (activeColor === slug) {
      setActiveColor(null);
      setActiveImage(0);
    } else {
      setActiveColor(slug);
      setActiveImage(0);
    }
  };

  return (
    <div
      className={`bg-[#111] border rounded-2xl overflow-hidden transition-colors duration-300 ${
        isOpen ? "border-[#C5FF00]/30" : "border-[#222] hover:border-[#333]"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 sm:p-5 cursor-pointer group"
      >
        <div className="relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-[#1a1a1a]">
          <Image
            src={product.defaultImages[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-heading text-[10px] font-bold tracking-wider uppercase text-[#C5FF00] bg-[#C5FF00]/10 px-2 py-0.5 rounded-full">
              {product.ref}
            </span>
            <span className="font-body text-[10px] text-white/30">
              {product.brand}
            </span>
          </div>
          <h3 className="font-heading text-sm sm:text-base font-black text-white uppercase truncate">
            {product.name}
          </h3>
        </div>
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <span className="font-heading text-xs text-white/40">
            {product.colors.length} couleurs
          </span>
          <span className="font-heading text-xs text-white/40">
            {product.grammage}
          </span>
        </div>
        <span className="font-heading text-sm sm:text-base font-black text-[#C5FF00] shrink-0 mr-2">
          {product.price.replace("A partir de ", "des ")}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-white/40 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          strokeWidth={2}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#222]">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-4 sm:p-6">
                  <div
                    className={`relative aspect-[3/4] rounded-xl overflow-hidden ${
                      activeColor ? "bg-white" : "bg-[#1a1a1a]"
                    }`}
                  >
                    <Image
                      src={currentImages[activeImage] || currentImages[0]}
                      alt={`${product.name} - ${product.ref}${
                        activeColor ? ` - ${activeColor}` : ""
                      }`}
                      fill
                      className={
                        activeColor ? "object-contain p-4" : "object-cover"
                      }
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </div>
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {currentImages.map((img, i) => (
                      <button
                        key={`${activeColor}-${i}`}
                        onClick={() => setActiveImage(i)}
                        className={`relative shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-colors duration-200 cursor-pointer ${
                          activeImage === i
                            ? "border-[#C5FF00]"
                            : "border-transparent hover:border-white/20"
                        } ${activeColor ? "bg-white" : "bg-[#1a1a1a]"}`}
                      >
                        <Image
                          src={img}
                          alt=""
                          fill
                          className={
                            activeColor
                              ? "object-contain p-1"
                              : "object-cover"
                          }
                          sizes="80px"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex flex-col">
                  <p className="font-body text-sm text-white/50 mb-6 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center gap-2.5 bg-[#1a1a1a] rounded-lg p-3">
                      <Leaf
                        className="w-4 h-4 text-[#C5FF00] shrink-0"
                        strokeWidth={2}
                      />
                      <div>
                        <span className="font-body text-[10px] text-white/30 uppercase tracking-wider block">
                          Matiere
                        </span>
                        <span className="font-heading text-xs font-bold text-white">
                          {product.material}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 bg-[#1a1a1a] rounded-lg p-3">
                      <Weight
                        className="w-4 h-4 text-[#C5FF00] shrink-0"
                        strokeWidth={2}
                      />
                      <div>
                        <span className="font-body text-[10px] text-white/30 uppercase tracking-wider block">
                          Grammage
                        </span>
                        <span className="font-heading text-xs font-bold text-white">
                          {product.grammage}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 bg-[#1a1a1a] rounded-lg p-3">
                      <Ruler
                        className="w-4 h-4 text-[#C5FF00] shrink-0"
                        strokeWidth={2}
                      />
                      <div>
                        <span className="font-body text-[10px] text-white/30 uppercase tracking-wider block">
                          Coupe
                        </span>
                        <span className="font-heading text-xs font-bold text-white">
                          {product.cut}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 bg-[#1a1a1a] rounded-lg p-3">
                      <Shield
                        className="w-4 h-4 text-[#C5FF00] shrink-0"
                        strokeWidth={2}
                      />
                      <div>
                        <span className="font-body text-[10px] text-white/30 uppercase tracking-wider block">
                          Labels
                        </span>
                        <span className="font-heading text-xs font-bold text-white">
                          {product.certifications.length
                            ? product.certifications.join(" · ")
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-heading text-xs font-bold text-white/60 uppercase tracking-wider">
                        {product.colors.length} couleurs disponibles
                      </span>
                      {activeColor && (
                        <span className="font-heading text-xs font-bold text-[#C5FF00]">
                          —{" "}
                          {
                            product.colors.find((c) => c.slug === activeColor)
                              ?.name
                          }
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color.slug}
                          onClick={() => handleColorClick(color.slug)}
                          className="group relative cursor-pointer"
                          title={color.name}
                        >
                          <div
                            className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all duration-200 ${
                              activeColor === color.slug
                                ? "border-[#C5FF00] scale-110 shadow-[0_0_10px_rgba(197,255,0,0.3)]"
                                : "border-[#333] hover:border-white/40"
                            }`}
                          >
                            <Image
                              src={`https://cdn.toptex.com/stickers/PAST_${product.ref}_${color.slug}.jpg?w=48`}
                              alt={color.name}
                              width={36}
                              height={36}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <span className="font-heading text-xs font-bold text-white/60 uppercase tracking-wider mb-3 block">
                      Tailles
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <span
                          key={size}
                          className="font-heading text-xs font-bold text-white/70 bg-[#1a1a1a] border border-[#333] px-3 py-1.5 rounded-lg"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-end gap-2 mb-4">
                      <span className="font-heading text-2xl sm:text-3xl font-black text-[#C5FF00]">
                        {product.price}
                      </span>
                      <span className="font-body text-xs text-white/30 mb-1">
                        hors flocage
                      </span>
                    </div>
                    <a
                      href={`https://wa.me/33675008633?text=${encodeURIComponent(
                        `Salut ! Je suis interesse par le ${product.ref} - ${product.name}. Est-ce que je pourrais avoir un devis ?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-[#C5FF00] text-[#0A0A0A] px-6 py-4 font-heading text-sm font-bold tracking-wider uppercase hover:bg-[#9ECC00] transition-colors duration-200 rounded-xl cursor-pointer"
                    >
                      <MessageCircle className="w-5 h-5" strokeWidth={2} />
                      Demander un devis
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CataloguePage() {
  const searchParams = useSearchParams();
  const openFromUrl = searchParams.get("open");

  const [activeCategory, setActiveCategory] = useState<Category>("Tous");
  const [openRef, setOpenRef] = useState<string | null>(openFromUrl);

  const filtered =
    activeCategory === "Tous"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <div className="pt-24 pb-8 sm:pt-28 sm:pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-heading text-xs tracking-wider uppercase text-white/40 hover:text-[#C5FF00] transition-colors duration-200 mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            Retour a l&apos;accueil
          </Link>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black uppercase">
            LE <span className="text-[#C5FF00]">CATALOGUE</span>
          </h1>
          <p className="font-body text-sm text-white/40 mt-3 max-w-lg">
            Tous nos textiles premium personnalisables — choisissez votre
            modele, on s&apos;occupe du flocage.
          </p>
        </div>
      </div>

      {/* Category filter */}
      <div className="sticky top-16 z-40 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#222]">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => {
              const count =
                cat === "Tous"
                  ? products.length
                  : products.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setOpenRef(null);
                  }}
                  className={`shrink-0 font-heading text-xs font-bold tracking-wider uppercase px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer ${
                    activeCategory === cat
                      ? "bg-[#C5FF00] text-[#0A0A0A] border-[#C5FF00]"
                      : "bg-transparent text-white/50 border-[#333] hover:border-white/30"
                  }`}
                >
                  {cat}{" "}
                  <span
                    className={
                      activeCategory === cat
                        ? "text-[#0A0A0A]/60"
                        : "text-white/20"
                    }
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product list */}
      <div className="max-w-6xl mx-auto px-6 py-8 sm:py-12">
        <div className="space-y-3">
          {filtered.map((product) => (
            <ProductCard
              key={product.ref}
              product={product}
              isOpen={openRef === product.ref}
              onToggle={() =>
                setOpenRef(openRef === product.ref ? null : product.ref)
              }
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-heading text-lg text-white/30 uppercase">
              Aucun produit dans cette categorie
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
