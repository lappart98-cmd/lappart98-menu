export interface ProductColor {
  name: string;
  slug: string;
}

export interface Product {
  ref: string;
  name: string;
  brand: string;
  category: string;
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

export const categories = [
  "Tous",
  "T-shirts Oversize",
  "T-shirts Urbains",
  "Sweats a capuche",
  "Sweats col rond",
] as const;

export type Category = (typeof categories)[number];

// Le grammage est stocke en texte ("280 g/m²") pour l'affichage. Cette fonction
// en extrait la valeur numerique pour permettre le tri du catalogue.
export function grammageValue(product: Product): number {
  const match = product.grammage.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export const products: Product[] = [
  {
    ref: "NS332",
    name: "T-shirt ecoresponsable oversize homme",
    brand: "Native Spirit",
    category: "T-shirts Oversize",
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
    category: "T-shirts Oversize",
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
    ref: "NS330",
    name: "T-shirt epaules tombantes unisexe",
    brand: "Native Spirit",
    category: "T-shirts Oversize",
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
    category: "T-shirts Urbains",
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
  {
    ref: "IB402",
    name: "Sweat-shirt a capuche unisexe",
    brand: "iDeal Basic Brand",
    category: "Sweats a capuche",
    description:
      "Hoodie 50/50 avec poche kangourou et interieur gratte. Coupe droite, capuche doublee jersey, etiquette detachable.",
    material: "50% coton / 50% polyester",
    grammage: "260 g/m²",
    cut: "Droite, manches montees",
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"],
    colors: [
      { name: "Ideal White", slug: "IDEALWHITE" },
      { name: "Ideal Black", slug: "IDEALBLACK" },
      { name: "Ideal Ash Heather", slug: "IDEALASHHEATHER" },
      { name: "Ideal Dark Grey", slug: "IDEALDARKGREY" },
      { name: "Ideal Forest Green", slug: "IDEALFORESTGREEN" },
      { name: "Ideal Navy", slug: "IDEALNAVY" },
      { name: "Ideal Orange", slug: "IDEALORANGE" },
      { name: "Ideal Oxford Grey", slug: "IDEALOXFORDGREY" },
      { name: "Ideal Red", slug: "IDEALRED" },
      { name: "Ideal Royal Blue", slug: "IDEALROYALBLUE" },
    ],
    certifications: ["OEKO-TEX", "VEGAN"],
    defaultImages: [
      "https://cdn.toptex.com/pictures/IB402-2_2026.jpg",
      "https://cdn.toptex.com/pictures/IB402-3_2026.jpg",
      "https://cdn.toptex.com/pictures/IB402-4_2026.jpg",
    ],
    price: "Prix sur demande",
  },
  {
    ref: "K4018",
    name: "Sweatshirt a capuche molleton oversize unisexe",
    brand: "Kariban",
    category: "Sweats a capuche",
    description:
      "Hoodie oversize en molleton gratte, epaules tombantes, esprit streetwear. No label, poche zippee dissimulee sur le cote droit.",
    material: "80% coton / 20% polyester",
    grammage: "280 g/m²",
    cut: "Oversize, epaules tombantes",
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL"],
    colors: [
      { name: "Black", slug: "BLACK" },
      { name: "Clay", slug: "CLAY" },
      { name: "Light Khaki", slug: "LIGHTKHAKI" },
      { name: "Navy", slug: "NAVY" },
      { name: "Oxford Grey", slug: "OXFORDGREY" },
      { name: "Wine", slug: "WINE" },
    ],
    certifications: ["OEKO-TEX", "VEGAN"],
    defaultImages: [
      "https://cdn.toptex.com/pictures/K4018-2_2027.jpg",
      "https://cdn.toptex.com/pictures/K4018-3_2027.jpg",
      "https://cdn.toptex.com/pictures/K4018-4_2027.jpg",
    ],
    price: "Prix sur demande",
  },
  {
    ref: "NS444",
    name: "Sweat-shirt ecoresponsable a capuche unisexe",
    brand: "Native Spirit",
    category: "Sweats a capuche",
    description:
      "Hoodie en coton bio peigne, surface lisse ideale pour le flocage. Molleton LSF 3 fils, stable au lavage.",
    material: "85% coton bio / 15% polyester recycle",
    grammage: "280 g/m²",
    cut: "Droite, capuche et poche kangourou",
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"],
    colors: [
      { name: "White", slug: "WHITE" },
      { name: "Black", slug: "BLACK" },
      { name: "Ivory", slug: "IVORY" },
      { name: "Moon Grey Heather", slug: "MOONGREYHEATHER" },
      { name: "Navy Blue", slug: "NAVYBLUE" },
    ],
    certifications: ["GOTS", "OEKO-TEX", "VEGAN"],
    defaultImages: [
      "https://cdn.toptex.com/pictures/NS444-4_2026.jpg",
      "https://cdn.toptex.com/pictures/NS444-5_2026.jpg",
      "https://cdn.toptex.com/packshots/PS_NS444_BLACK.png",
    ],
    price: "Prix sur demande",
  },
  {
    ref: "NS408",
    name: "Sweat-shirt ecoresponsable a capuche oversize unisexe",
    brand: "Native Spirit",
    category: "Sweats a capuche",
    description:
      "Hoodie oversize en coton bio, epaules tombantes et capuche doublee. Molleton traite anti-retrecissement, lave aux enzymes.",
    material: "85% coton bio / 15% polyester recycle",
    grammage: "300 g/m²",
    cut: "Oversize, epaules tombantes",
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL"],
    colors: [
      { name: "White", slug: "WHITE" },
      { name: "Black", slug: "BLACK" },
      { name: "Adriatic Blue", slug: "ADRIATICBLUE" },
      { name: "Aquamarine", slug: "AQUAMARINE" },
      { name: "Brook Green", slug: "BROOKGREEN" },
      { name: "Burnt Brick", slug: "BURNTBRICK" },
      { name: "Driftwood", slug: "DRIFTWOOD" },
      { name: "Iron Grey", slug: "IRONGREY" },
      { name: "Ivory", slug: "IVORY" },
      { name: "Jade Green", slug: "JADEGREEN" },
      { name: "Navy Blue", slug: "NAVYBLUE" },
      { name: "Organic Khaki", slug: "ORGANICKHAKI" },
      { name: "Peacock Green", slug: "PEACOCKGREEN" },
      { name: "Raw Natural", slug: "RAWNATURAL" },
      { name: "Toffee", slug: "TOFFEE" },
    ],
    certifications: ["GOTS", "OEKO-TEX", "VEGAN"],
    defaultImages: [
      "https://cdn.toptex.com/pictures/NS408-1_2025.jpg",
      "https://cdn.toptex.com/pictures/NS408-2_2025.jpg",
      "https://cdn.toptex.com/pictures/NS408-3_2025.jpg",
    ],
    price: "Prix sur demande",
  },
  {
    ref: "BY284",
    name: "Sweat capuche au toucher doux",
    brand: "Build Your Brand",
    category: "Sweats a capuche",
    description:
      "Hoodie oversize au toucher doux, interieur gratte. Epaules tombantes, poche kangourou, cotes larges aux poignets et a la taille.",
    material: "70% coton / 30% polyester",
    grammage: "330 g/m²",
    cut: "Oversize, epaules tombantes",
    sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
    colors: [
      { name: "White", slug: "WHITE" },
      { name: "Black", slug: "BLACK" },
      { name: "White Sand", slug: "WHITESAND" },
    ],
    certifications: [],
    defaultImages: [
      "https://cdn.toptex.com/pictures/BY284-2_2027.jpg",
      "https://cdn.toptex.com/pictures/BY284-3_2027.jpg",
      "https://cdn.toptex.com/packshots/PS_BY284_BLACK.png",
    ],
    price: "Prix sur demande",
  },
  {
    ref: "BY268",
    name: "Sweat a capuche oversize",
    brand: "Build Your Brand",
    category: "Sweats a capuche",
    description:
      "Le plus epais du catalogue : molleton gratte 500g, coupe oversize. Capuche large sans cordon, poche kangourou, cotes larges.",
    material: "80% coton / 20% polyester",
    grammage: "500 g/m²",
    cut: "Oversize, epaules tombantes",
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    colors: [{ name: "Black", slug: "BLACK" }],
    certifications: [],
    defaultImages: [
      "https://cdn.toptex.com/pictures/BY268-2_2027.jpg",
      "https://cdn.toptex.com/pictures/BY268-3_2027.jpg",
      "https://cdn.toptex.com/pictures/BY268-4_2027.jpg",
    ],
    price: "Prix sur demande",
  },
  {
    ref: "IB400",
    name: "Sweat-shirt col rond unisexe",
    brand: "iDeal Basic Brand",
    category: "Sweats col rond",
    description:
      "Sweat col rond 50/50 a l'interieur gratte. Coupe droite, cotes 1x1 au col, aux poignets et a la base avec surpiqure double.",
    material: "50% coton / 50% polyester",
    grammage: "260 g/m²",
    cut: "Droite, manches montees",
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"],
    colors: [
      { name: "Ideal White", slug: "IDEALWHITE" },
      { name: "Ideal Black", slug: "IDEALBLACK" },
      { name: "Ideal Ash Heather", slug: "IDEALASHHEATHER" },
      { name: "Ideal Dark Grey", slug: "IDEALDARKGREY" },
      { name: "Ideal Forest Green", slug: "IDEALFORESTGREEN" },
      { name: "Ideal Navy", slug: "IDEALNAVY" },
      { name: "Ideal Orange", slug: "IDEALORANGE" },
      { name: "Ideal Oxford Grey", slug: "IDEALOXFORDGREY" },
      { name: "Ideal Red", slug: "IDEALRED" },
      { name: "Ideal Royal Blue", slug: "IDEALROYALBLUE" },
    ],
    certifications: ["OEKO-TEX", "VEGAN"],
    defaultImages: [
      "https://cdn.toptex.com/pictures/IB400-2_2026.jpg",
      "https://cdn.toptex.com/pictures/IB400-3_2026.jpg",
      "https://cdn.toptex.com/pictures/IB400-4_2026.jpg",
    ],
    price: "Prix sur demande",
  },
  {
    ref: "NS443",
    name: "Sweat-shirt ecoresponsable a col rond unisexe",
    brand: "Native Spirit",
    category: "Sweats col rond",
    description:
      "Sweat col rond en coton bio peigne, surface lisse ideale pour le flocage. Molleton LSF 3 fils, lave aux enzymes.",
    material: "85% coton bio / 15% polyester recycle",
    grammage: "280 g/m²",
    cut: "Droite, col rond cotes 1x1",
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"],
    colors: [
      { name: "White", slug: "WHITE" },
      { name: "Black", slug: "BLACK" },
      { name: "Ivory", slug: "IVORY" },
      { name: "Moon Grey Heather", slug: "MOONGREYHEATHER" },
      { name: "Navy Blue", slug: "NAVYBLUE" },
    ],
    certifications: ["GOTS", "OEKO-TEX", "VEGAN"],
    defaultImages: [
      "https://cdn.toptex.com/pictures/NS443-3_2026.jpg",
      "https://cdn.toptex.com/packshots/PS_NS443_BLACK.png",
      "https://cdn.toptex.com/packshots/PS_NS443_IVORY.png",
    ],
    price: "Prix sur demande",
  },
  {
    ref: "NS407",
    name: "Sweat-shirt ecoresponsable a col rond oversize unisexe",
    brand: "Native Spirit",
    category: "Sweats col rond",
    description:
      "Sweat col rond oversize en coton bio, toucher doux. Epaules tombantes, molleton gratte 3 fils, no label.",
    material: "85% coton bio / 15% polyester recycle",
    grammage: "300 g/m²",
    cut: "Oversize, epaules tombantes",
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL"],
    colors: [
      { name: "White", slug: "WHITE" },
      { name: "Black", slug: "BLACK" },
      { name: "Adriatic Blue", slug: "ADRIATICBLUE" },
      { name: "Aquamarine", slug: "AQUAMARINE" },
      { name: "Brook Green", slug: "BROOKGREEN" },
      { name: "Burnt Brick", slug: "BURNTBRICK" },
      { name: "Driftwood", slug: "DRIFTWOOD" },
      { name: "Iron Grey", slug: "IRONGREY" },
      { name: "Ivory", slug: "IVORY" },
      { name: "Jade Green", slug: "JADEGREEN" },
      { name: "Navy Blue", slug: "NAVYBLUE" },
      { name: "Organic Khaki", slug: "ORGANICKHAKI" },
      { name: "Peacock Green", slug: "PEACOCKGREEN" },
      { name: "Raw Natural", slug: "RAWNATURAL" },
      { name: "Toffee", slug: "TOFFEE" },
    ],
    certifications: ["GOTS", "OEKO-TEX", "VEGAN"],
    defaultImages: [
      "https://cdn.toptex.com/pictures/NS407-1_2025.jpg",
      "https://cdn.toptex.com/pictures/NS407-2_2025.jpg",
      "https://cdn.toptex.com/pictures/NS407-3_2025.jpg",
    ],
    price: "Prix sur demande",
  },
];

export function getPackshotImages(ref: string, colorSlug: string): string[] {
  return [
    `https://cdn.toptex.com/packshots/PS_${ref}_${colorSlug}.png`,
    `https://cdn.toptex.com/packshots/PS_${ref}-B_${colorSlug}.png`,
    `https://cdn.toptex.com/packshots/PS_${ref}-S_${colorSlug}.png`,
  ];
}
