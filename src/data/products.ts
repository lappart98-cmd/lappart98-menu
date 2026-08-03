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
] as const;

export type Category = (typeof categories)[number];

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
];

export function getPackshotImages(ref: string, colorSlug: string): string[] {
  return [
    `https://cdn.toptex.com/packshots/PS_${ref}_${colorSlug}.png`,
    `https://cdn.toptex.com/packshots/PS_${ref}-B_${colorSlug}.png`,
    `https://cdn.toptex.com/packshots/PS_${ref}-S_${colorSlug}.png`,
  ];
}
