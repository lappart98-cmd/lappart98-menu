"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { Leaf, Shield, Weight, Ruler, MessageCircle } from "lucide-react";

interface ProductColor {
  name: string;
  slug: string;
}

interface Product {
  ref: string;
  name: string;
  brand: string;
  collection: string;
  description: string;
  material: string;
  grammage: string;
  cut: string;
  sizes: string[];
  colors: ProductColor[];
  certifications: string[];
  defaultImages: string[];
  price: string;
}

const products: Product[] = [
  {
    ref: "NS332",
    name: "T-shirt ecoresponsable oversize homme",
    brand: "Native Spirit",
    collection: "Collection Oversize",
    description:
      "Coton biologique, coupe oversize avec epaules tombantes. No label : 100% personnalisable a votre projet.",
    material: "100% coton biologique",
    grammage: "220 g/m²",
    cut: "Oversize, epaules tombantes",
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", slug: "WHITE" },
      { name: "Black", slug: "BLACK" },
      { name: "Aquamarine", slug: "AQUAMARINE" },
      { name: "Driftwood", slug: "DRIFTWOOD" },
      { name: "Iron Grey", slug: "IRONGREY" },
      { name: "Ivory", slug: "IVORY" },
      { name: "Navy Blue", slug: "NAVYBLUE" },
      { name: "Organic Khaki", slug: "ORGANICKHAKI" },
      { name: "Peacock Green", slug: "PEACOCKGREEN" },
      { name: "Toffee", slug: "TOFFEE" },
    ],
    certifications: ["GOTS", "OEKO-TEX", "VEGAN"],
    defaultImages: [
      "https://cdn.toptex.com/pictures/NS332-5_2025.jpg",
      "https://cdn.toptex.com/pictures/NS332-1_2025.jpg",
      "https://cdn.toptex.com/pictures/NS332-2_2025.jpg",
      "https://cdn.toptex.com/pictures/NS332-3_2023.jpg",
      "https://cdn.toptex.com/pictures/NS332-4_2025.jpg",
      "https://cdn.toptex.com/pictures/NS332-6_2025.jpg",
    ],
    price: "A partir de 11€/piece",
  },
  {
    ref: "BY102",
    name: "T-shirt oversize lourd",
    brand: "Build Your Brand",
    collection: "Oversize",
    description:
      "Jersey epais 240g, coupe oversize large. Epaules tombantes, double surpiqure col/manches/bas. No label.",
    material: "100% coton",
    grammage: "240 g/m²",
    cut: "Oversize large, epaules tombantes",
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    colors: [
      { name: "White", slug: "WHITE" },
      { name: "Black", slug: "BLACK" },
      { name: "Baltic Blue", slug: "BALTICBLUE" },
      { name: "Bark", slug: "BARK" },
      { name: "Beryl Blue", slug: "BERYLBLUE" },
      { name: "Bottle Green", slug: "BOTTLEGREEN" },
      { name: "Charcoal", slug: "CHARCOAL" },
      { name: "Cherry", slug: "CHERRY" },
      { name: "Chocolate Brown", slug: "CHOCOLATEBROWN" },
      { name: "Dusk Rose", slug: "DUSKROSE" },
      { name: "Hibiskus Pink", slug: "HIBISKUSPINK" },
      { name: "Lilac", slug: "LILAC" },
      { name: "Navy", slug: "NAVY" },
      { name: "Olive", slug: "OLIVE" },
      { name: "Purple Night", slug: "PURPLENIGHT" },
      { name: "Ready For Dye", slug: "READYFORDYE" },
      { name: "Sand", slug: "SAND" },
      { name: "Soft Salvia", slug: "SOFTSALVIA" },
      { name: "Soft Yellow", slug: "SOFTYELLOW" },
      { name: "Union Beige", slug: "UNIONBEIGE" },
    ],
    certifications: [],
    defaultImages: [
      "https://cdn.toptex.com/pictures/BY102_2027.jpg",
      "https://cdn.toptex.com/pictures/BY102-2_2027.jpg",
      "https://cdn.toptex.com/pictures/BY102-3_2027.jpg",
    ],
    price: "A partir de 13€/piece",
  },
  {
    ref: "NS308",
    name: "T-shirt oversize French Terry unisexe",
    brand: "Native Spirit",
    collection: "Oversize French Terry",
    description:
      "Hybride t-shirt/sweatshirt en French Terry 300g. Coton bio + polyester recycle. Lave aux enzymes. No label.",
    material: "85% coton bio / 15% polyester recycle",
    grammage: "300 g/m²",
    cut: "Oversize, matiere French Terry",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", slug: "BLACK" },
      { name: "Burnt Brick", slug: "BURNTBRICK" },
      { name: "Iron Grey", slug: "IRONGREY" },
      { name: "Ivory", slug: "IVORY" },
      { name: "Navy Blue", slug: "NAVYBLUE" },
      { name: "Organic Khaki", slug: "ORGANICKHAKI" },
      { name: "Raw Natural", slug: "RAWNATURAL" },
      { name: "Wet Sand", slug: "WETSAND" },
    ],
    certifications: ["GOTS", "OEKO-TEX", "VEGAN"],
    defaultImages: [
      "https://cdn.toptex.com/pictures/NS308-8_2025.jpg",
      "https://cdn.toptex.com/pictures/NS308-12_2024.jpg",
      "https://cdn.toptex.com/pictures/NS308-10_2024.jpg",
    ],
    price: "A partir de 24€/piece",
  },
  {
    ref: "NS330",
    name: "T-shirt epaules tombantes unisexe",
    brand: "Native Spirit",
    collection: "Ecoresponsable",
    description:
      "Coton bio peigne 200g, coupe standard a epaules tombantes. Lave aux enzymes, renfort epaules. No label.",
    material: "100% coton biologique",
    grammage: "200 g/m²",
    cut: "Standard, epaules tombantes",
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL"],
    colors: [
      { name: "White", slug: "WHITE" },
      { name: "Black", slug: "BLACK" },
      { name: "Antique Rose", slug: "ANTIQUEROSE" },
      { name: "Ivory", slug: "IVORY" },
      { name: "Navy Blue", slug: "NAVYBLUE" },
      { name: "Organic Khaki", slug: "ORGANICKHAKI" },
      { name: "Peacock Green", slug: "PEACOCKGREEN" },
      { name: "Wet Sand", slug: "WETSAND" },
    ],
    certifications: ["GOTS", "OEKO-TEX", "VEGAN"],
    defaultImages: [
      "https://cdn.toptex.com/pictures/NS330-7_2024.jpg",
      "https://cdn.toptex.com/pictures/NS330-12_2024.jpg",
      "https://cdn.toptex.com/pictures/NS330-10_2024.jpg",
    ],
    price: "A partir de 13€/piece",
  },
  {
    ref: "BY163",
    name: "T-shirt urbain lourd",
    brand: "Build Your Brand",
    collection: "Urbain",
    description:
      "Jersey epais 300g, coupe oversize large. Epaules tombantes, coutures laterales. No label.",
    material: "100% coton",
    grammage: "300 g/m²",
    cut: "Oversize large, jersey epais",
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    colors: [
      { name: "White", slug: "WHITE" },
      { name: "Black", slug: "BLACK" },
    ],
    certifications: [],
    defaultImages: [
      "https://cdn.toptex.com/pictures/BY163-6_2027.jpg",
      "https://cdn.toptex.com/pictures/BY163-4_2027.jpg",
      "https://cdn.toptex.com/pictures/BY163-5_2027.jpg",
    ],
    price: "A partir de 18€/piece",
  },
];

function getPackshotImages(ref: string, colorSlug: string): string[] {
  return [
    `https://cdn.toptex.com/packshots/PS_${ref}_${colorSlug}.png`,
    `https://cdn.toptex.com/packshots/PS_${ref}-B_${colorSlug}.png`,
    `https://cdn.toptex.com/packshots/PS_${ref}-S_${colorSlug}.png`,
  ];
}

function ProductCard({ product }: { product: Product }) {
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
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image gallery */}
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
              className={activeColor ? "object-contain p-4" : "object-cover"}
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
                  className={activeColor ? "object-contain p-1" : "object-cover"}
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="p-6 sm:p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-1">
            <span className="font-heading text-[11px] font-bold tracking-wider uppercase text-[#C5FF00] bg-[#C5FF00]/10 px-3 py-1 rounded-full">
              {product.ref}
            </span>
            <span className="font-body text-xs text-white/40">
              {product.brand}
            </span>
          </div>

          <h3 className="font-heading text-xl sm:text-2xl font-black text-white uppercase mt-2 mb-1">
            {product.name}
          </h3>

          <p className="font-body text-sm text-white/50 mb-6 leading-relaxed">
            {product.description}
          </p>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2.5 bg-[#1a1a1a] rounded-lg p-3">
              <Leaf className="w-4 h-4 text-[#C5FF00] shrink-0" strokeWidth={2} />
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
              <Weight className="w-4 h-4 text-[#C5FF00] shrink-0" strokeWidth={2} />
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
              <Ruler className="w-4 h-4 text-[#C5FF00] shrink-0" strokeWidth={2} />
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
              <Shield className="w-4 h-4 text-[#C5FF00] shrink-0" strokeWidth={2} />
              <div>
                <span className="font-body text-[10px] text-white/30 uppercase tracking-wider block">
                  Labels
                </span>
                <span className="font-heading text-xs font-bold text-white">
                  {product.certifications.join(" · ")}
                </span>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-heading text-xs font-bold text-white/60 uppercase tracking-wider">
                {product.colors.length} couleurs disponibles
              </span>
              {activeColor && (
                <span className="font-heading text-xs font-bold text-[#C5FF00]">
                  — {product.colors.find((c) => c.slug === activeColor)?.name}
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

          {/* Sizes */}
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

          {/* Price + CTA */}
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
    </motion.div>
  );
}

export default function Catalogue() {
  return (
    <section id="catalogue" className="py-16 sm:py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#111_0%,_#0A0A0A_70%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="font-heading text-sm tracking-[0.3em] text-white/40 uppercase block mb-3">
            Nos textiles
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white">
            LE <span className="text-[#C5FF00]">CATALOGUE</span>
          </h2>
          <p className="font-body text-sm text-white/40 mt-3 max-w-md mx-auto">
            Decouvrez nos textiles premium — tous personnalisables avec votre
            visuel
          </p>
        </motion.div>

        <div className="space-y-8">
          {products.map((product) => (
            <ProductCard key={product.ref} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
