export interface ProductColor {
  name: string;
  slug: string;
  // Par defaut les visuels sont deduits de la reference chez Toptex. Les
  // produits d'autres fournisseurs (Velilla...) portent leurs propres URLs.
  swatch?: string;
  images?: string[];
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
  // Prix de vente HT par palier de quantite, calcules a partir du prix
  // d'achat reel (cf. scripts/pricing.config.json et compute-prices.mjs).
  prices: { solo: number; team: number; bestof: number };
  // Origine des visuels par coloris quand le coloris n'en porte pas lui-meme.
  // "toptex" (defaut) : deduits de la reference. "none" : le fournisseur n'en
  // publie pas, on reste sur les visuels par defaut.
  packshotSource?: "toptex" | "none";
}

export const categories = [
  "Tous",
  "T-shirts Oversize",
  "T-shirts Urbains",
  "T-shirts Techniques",
  "Polos",
  "Sweats à capuche",
  "Sweats col rond",
  "Casquettes",
  "Sacs",
] as const;

export type Category = (typeof categories)[number];

// Le grammage est stocke en texte ("280 g/m²") pour l'affichage. Cette fonction
// en extrait la valeur numerique pour permettre le tri du catalogue. Renvoie
// null quand le fournisseur ne le publie pas : ces produits sont alors classes
// en fin de liste plutot que traites comme un grammage nul.
export function grammageValue(product: Product): number | null {
  const match = product.grammage.match(/\d+/);
  return match ? Number(match[0]) : null;
}

export const products: Product[] = [
  {
    ref: "NS332",
    name: "T-shirt écoresponsable oversize homme",
    brand: "Native Spirit",
    category: "T-shirts Oversize",
    description:
      "Coton biologique, coupe oversize avec épaules tombantes. No label : 100 % personnalisable à votre projet.",
    material: "100 % coton biologique",
    grammage: "220 g/m²",
    cut: "Oversize, épaules tombantes",
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
    price: "À partir de 15 €/pièce",
    prices: { solo: 20, team: 17, bestof: 15 },
  },
  {
    ref: "BY102",
    name: "T-shirt oversize lourd",
    brand: "Build Your Brand",
    category: "T-shirts Oversize",
    description:
      "Jersey épais 240 g, coupe oversize large. Épaules tombantes, double surpiqûre col/manches/bas. No label.",
    material: "100 % coton",
    grammage: "240 g/m²",
    cut: "Oversize large, épaules tombantes",
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    colors: [
      { name: "White", slug: "WHITE" },
      { name: "Black", slug: "BLACK" },
      { name: "Baltic Blue", slug: "BALTICBLUE" },
      {
        name: "Bark",
        slug: "BARK",
        // Toptex renvoie son pictogramme « image absente » sur la vue de face
        // de ce coloris (PS_BY102_BARK). Seule la vue de dos existe.
        images: ["https://cdn.toptex.com/packshots/PS_BY102-B_BARK.png"],
      },
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
    price: "À partir de 14 €/pièce",
    prices: { solo: 18, team: 16, bestof: 14 },
  },
  {
    ref: "NS330",
    name: "T-shirt épaules tombantes unisexe",
    brand: "Native Spirit",
    category: "T-shirts Oversize",
    description:
      "Coton bio peigné 200 g, coupe standard à épaules tombantes. Lavé aux enzymes, renfort épaules. No label.",
    material: "100 % coton biologique",
    grammage: "200 g/m²",
    cut: "Standard, épaules tombantes",
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
    price: "À partir de 14 €/pièce",
    prices: { solo: 18, team: 16, bestof: 14 },
  },
  {
    ref: "BY163",
    name: "T-shirt urbain lourd",
    brand: "Build Your Brand",
    category: "T-shirts Urbains",
    description:
      "Jersey épais 300 g, coupe oversize large. Épaules tombantes, coutures latérales. No label.",
    material: "100 % coton",
    grammage: "300 g/m²",
    cut: "Oversize large, jersey épais",
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
    price: "À partir de 14 €/pièce",
    prices: { solo: 19, team: 16, bestof: 14 },
  },
  {
    ref: "IB402",
    name: "Sweat-shirt à capuche unisexe",
    brand: "iDeal Basic Brand",
    category: "Sweats à capuche",
    description:
      "Hoodie 50/50 avec poche kangourou et intérieur gratté. Coupe droite, capuche doublée jersey, étiquette détachable.",
    material: "50 % coton / 50 % polyester",
    grammage: "260 g/m²",
    cut: "Droite, manches montées",
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
    price: "À partir de 22 €/pièce",
    prices: { solo: 26, team: 24, bestof: 22 },
  },
  {
    ref: "K4018",
    name: "Sweatshirt à capuche molleton oversize unisexe",
    brand: "Kariban",
    category: "Sweats à capuche",
    description:
      "Hoodie oversize en molleton gratté, épaules tombantes, esprit streetwear. No label, poche zippée dissimulée sur le côté droit.",
    material: "80 % coton / 20 % polyester",
    grammage: "280 g/m²",
    cut: "Oversize, épaules tombantes",
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
    price: "À partir de 30 €/pièce",
    prices: { solo: 37, team: 33, bestof: 30 },
  },
  {
    ref: "NS444",
    name: "Sweat-shirt écoresponsable à capuche unisexe",
    brand: "Native Spirit",
    category: "Sweats à capuche",
    description:
      "Hoodie en coton bio peigné, surface lisse idéale pour le flocage. Molleton LSF 3 fils, stable au lavage.",
    material: "85 % coton bio / 15 % polyester recyclé",
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
    price: "À partir de 27 €/pièce",
    prices: { solo: 32, team: 29, bestof: 27 },
  },
  {
    ref: "NS408",
    name: "Sweat-shirt écoresponsable à capuche oversize unisexe",
    brand: "Native Spirit",
    category: "Sweats à capuche",
    description:
      "Hoodie oversize en coton bio, épaules tombantes et capuche doublée. Molleton traité anti-rétrécissement, lavé aux enzymes.",
    material: "85 % coton bio / 15 % polyester recyclé",
    grammage: "300 g/m²",
    cut: "Oversize, épaules tombantes",
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
    price: "À partir de 34 €/pièce",
    prices: { solo: 42, team: 37, bestof: 34 },
  },
  {
    ref: "BY284",
    name: "Sweat capuche au toucher doux",
    brand: "Build Your Brand",
    category: "Sweats à capuche",
    description:
      "Hoodie oversize au toucher doux, intérieur gratté. Épaules tombantes, poche kangourou, côtes larges aux poignets et à la taille.",
    material: "70 % coton / 30 % polyester",
    grammage: "330 g/m²",
    cut: "Oversize, épaules tombantes",
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
    price: "À partir de 30 €/pièce",
    prices: { solo: 37, team: 33, bestof: 30 },
  },
  {
    ref: "BY268",
    name: "Sweat à capuche oversize",
    brand: "Build Your Brand",
    category: "Sweats à capuche",
    description:
      "Le plus épais du catalogue : molleton gratté 500 g, coupe oversize. Capuche large sans cordon, poche kangourou, côtes larges.",
    material: "80 % coton / 20 % polyester",
    grammage: "500 g/m²",
    cut: "Oversize, épaules tombantes",
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    colors: [{ name: "Black", slug: "BLACK" }],
    certifications: [],
    defaultImages: [
      "https://cdn.toptex.com/pictures/BY268-2_2027.jpg",
      "https://cdn.toptex.com/pictures/BY268-3_2027.jpg",
      "https://cdn.toptex.com/pictures/BY268-4_2027.jpg",
    ],
    price: "À partir de 43 €/pièce",
    prices: { solo: 53, team: 46, bestof: 43 },
  },
  {
    ref: "IB400",
    name: "Sweat-shirt col rond unisexe",
    brand: "iDeal Basic Brand",
    category: "Sweats col rond",
    description:
      "Sweat col rond 50/50 à l'intérieur gratté. Coupe droite, côtes 1x1 au col, aux poignets et à la base avec surpiqûre double.",
    material: "50 % coton / 50 % polyester",
    grammage: "260 g/m²",
    cut: "Droite, manches montées",
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
    price: "À partir de 21 €/pièce",
    prices: { solo: 25, team: 23, bestof: 21 },
  },
  {
    ref: "NS443",
    name: "Sweat-shirt écoresponsable à col rond unisexe",
    brand: "Native Spirit",
    category: "Sweats col rond",
    description:
      "Sweat col rond en coton bio peigné, surface lisse idéale pour le flocage. Molleton LSF 3 fils, lavé aux enzymes.",
    material: "85 % coton bio / 15 % polyester recyclé",
    grammage: "280 g/m²",
    cut: "Droite, col rond côtes 1x1",
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
    price: "À partir de 28 €/pièce",
    prices: { solo: 34, team: 30, bestof: 28 },
  },
  {
    ref: "NS407",
    name: "Sweat-shirt écoresponsable à col rond oversize unisexe",
    brand: "Native Spirit",
    category: "Sweats col rond",
    description:
      "Sweat col rond oversize en coton bio, toucher doux. Épaules tombantes, molleton gratté 3 fils, no label.",
    material: "85 % coton bio / 15 % polyester recyclé",
    grammage: "300 g/m²",
    cut: "Oversize, épaules tombantes",
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
    price: "À partir de 27 €/pièce",
    prices: { solo: 33, team: 29, bestof: 27 },
  },
  {
    // Le fournisseur scinde ce modele en deux references : MK023CV pour les
    // coloris, MK023WV pour le blanc. Regroupes ici sur une seule fiche.
    ref: "MK023CV",
    name: "PALM - T-shirt manches courtes 190",
    packshotSource: "none",
    brand: "Mukua",
    category: "T-shirts Urbains",
    description:
      "T-shirt unisexe en 100 % coton RingSpun, single jersey 190 g. Col rond bord-côte 1x1 avec élasthanne, bande de renfort épaule à épaule, tissu tubulaire, coupe regular.",
    material: "100 % coton RingSpun (Heather Grey : 85 % coton / 15 % viscose)",
    grammage: "190 g/m²",
    cut: "Regular, col rond bord-côte 1x1",
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
    colors: [
      {
        // Le blanc est vendu sous une reference distincte (MK023WV) avec sa
        // propre convention d'images : une seule vue, chemin different.
        name: "White",
        slug: "100",
        swatch:
          "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/100_100.jpg",
        images: [
          "https://stospweb0pro01a237.blob.core.windows.net/media/product/media/thumbnails/MK023WV_SERIE_01_1000.jpg",
        ],
      },
      {
        name: "Black",
        slug: "200",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/200_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_200_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_200_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_200_3_1000.webp",
        ],
      },
      {
        name: "Dark Grey",
        slug: "201",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/201_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_201_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_201_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_201_3_1000.webp",
        ],
      },
      {
        name: "Heather Grey",
        slug: "202",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/202_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_202_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_202_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_202_3_1000.webp",
        ],
      },
      {
        name: "Sand",
        slug: "103",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/103_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_103_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_103_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_103_3_1000.webp",
        ],
      },
      {
        name: "Brown",
        slug: "104",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/104_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_104_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_104_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_104_3_1000.webp",
        ],
      },
      {
        name: "Yellow",
        slug: "300",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/300_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_300_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_300_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_300_3_1000.webp",
        ],
      },
      {
        name: "Gold",
        slug: "305",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/305_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_305_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_305_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_305_3_1000.webp",
        ],
      },
      {
        name: "Orange",
        slug: "301",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/301_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_301_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_301_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_301_3_1000.webp",
        ],
      },
      {
        name: "Peach",
        slug: "313",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/313_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_313_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_313_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_313_3_1000.webp",
        ],
      },
      {
        name: "Fresh Coral",
        slug: "414",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/414_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_414_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_414_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_414_3_1000.webp",
        ],
      },
      {
        name: "Red",
        slug: "400",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/400_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_400_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_400_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_400_3_1000.webp",
        ],
      },
      {
        name: "Wine",
        slug: "403",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/403_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_403_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_403_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_403_3_1000.webp",
        ],
      },
      {
        name: "Fuchsia",
        slug: "406",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/406_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_406_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_406_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_406_3_1000.webp",
        ],
      },
      {
        name: "Pale Rose",
        slug: "410",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/410_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_410_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_410_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_410_3_1000.webp",
        ],
      },
      {
        name: "Lilac",
        slug: "530",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/530_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_530_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_530_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_530_3_1000.webp",
        ],
      },
      {
        name: "Purple",
        slug: "511",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/511_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_511_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_511_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_511_3_1000.webp",
        ],
      },
      {
        name: "Navy",
        slug: "500",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/500_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_500_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_500_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_500_3_1000.webp",
        ],
      },
      {
        name: "Deep Navy",
        slug: "512",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/512_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_512_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_512_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_512_3_1000.webp",
        ],
      },
      {
        name: "Royal Blue",
        slug: "502",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/502_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_502_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_502_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_502_3_1000.webp",
        ],
      },
      {
        name: "Denim Blue",
        slug: "510",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/510_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_510_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_510_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_510_3_1000.webp",
        ],
      },
      {
        name: "Blue Fog",
        slug: "509",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/509_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_509_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_509_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_509_3_1000.webp",
        ],
      },
      {
        name: "Sky Blue",
        slug: "501",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/501_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_501_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_501_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_501_3_1000.webp",
        ],
      },
      {
        name: "Atoll",
        slug: "505",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/505_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_505_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_505_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_505_3_1000.webp",
        ],
      },
      {
        name: "Rich Turquoise",
        slug: "515",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/515_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_515_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_515_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_515_3_1000.webp",
        ],
      },
      {
        name: "Kelly Green",
        slug: "600",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/600_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_600_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_600_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_600_3_1000.webp",
        ],
      },
      {
        name: "Khaki Green",
        slug: "601",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/601_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_601_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_601_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_601_3_1000.webp",
        ],
      },
      {
        name: "Bottle Green",
        slug: "602",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/602_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_602_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_602_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_602_3_1000.webp",
        ],
      },
      {
        name: "Sage",
        slug: "613",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/613_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_613_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_613_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_613_3_1000.webp",
        ],
      },
      {
        name: "Lime",
        slug: "604",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/604_100.jpg",
        images: [
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_604_1_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_604_2_1000.webp",
        "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_604_3_1000.webp",
        ],
      },
    ],
    certifications: [],
    defaultImages: [
      "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_200_1_1000.webp",
      "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_200_2_1000.webp",
      "https://stospweb0pro01a237.blob.core.windows.net/media/product/thumbnails/MK023CV_200_3_1000.webp",
    ],
    price: "À partir de 7 €/pièce",
    prices: { solo: 10, team: 8, bestof: 7 },
  },
  {
    ref: "MK520V",
    name: "TECH - T-shirt technique MC",
    brand: "Mukua",
    category: "T-shirts Techniques",
    description:
      "T-shirt technique unisexe en maille Bird Eye 100 % polyester. Manches raglan, tissu respirant à séchage rapide, forte résistance au boulochage, coutures décoratives sur la demi-manche.",
    material: "100 % polyester (maille Bird Eye)",
    grammage: "130 g/m²",
    cut: "Droite, manches raglan, col rond",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    // Le fournisseur ne publie pas de packshot par coloris. Les visuels
    // ci-dessous sont ceux de l'atelier, herberges avec le site.
    packshotSource: "none",
    colors: [
      {
        name: "White",
        slug: "100",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/100_100.jpg",
        images: [
          "/textiles/mk520v/100-face.jpg",
          "/textiles/mk520v/100-dos.jpg",
          "/textiles/mk520v/100-profil.jpg",
        ],
      },
      {
        name: "Black",
        slug: "200",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/200_100.jpg",
        images: [
          "/textiles/mk520v/200-face.jpg",
          "/textiles/mk520v/200-dos.jpg",
          "/textiles/mk520v/200-profil.jpg",
        ],
      },
      {
        name: "Navy",
        slug: "500",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/500_100.jpg",
        images: [
          "/textiles/mk520v/500-face.jpg",
          "/textiles/mk520v/500-dos.jpg",
          "/textiles/mk520v/500-profil.jpg",
        ],
      },
      {
        name: "Royal Blue",
        slug: "502",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/502_100.jpg",
        images: [
          "/textiles/mk520v/502-face.jpg",
          "/textiles/mk520v/502-dos.jpg",
          "/textiles/mk520v/502-profil.jpg",
        ],
      },
      {
        name: "Atoll",
        slug: "505",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/505_100.jpg",
        images: [
          "/textiles/mk520v/505-face.jpg",
          "/textiles/mk520v/505-dos.jpg",
          "/textiles/mk520v/505-profil.jpg",
        ],
      },
      {
        name: "Red",
        slug: "400",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/400_100.jpg",
        images: [
          "/textiles/mk520v/400-face.jpg",
          "/textiles/mk520v/400-dos.jpg",
          "/textiles/mk520v/400-profil.jpg",
        ],
      },
      {
        name: "Fluor Orange",
        slug: "303",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/303_100.jpg",
        images: [
          "/textiles/mk520v/303-face.jpg",
          "/textiles/mk520v/303-dos.jpg",
          "/textiles/mk520v/303-profil.jpg",
        ],
      },
      {
        name: "Fluor Yellow",
        slug: "304",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/304_100.jpg",
        images: [
          "/textiles/mk520v/304-face.jpg",
          "/textiles/mk520v/304-dos.jpg",
          "/textiles/mk520v/304-profil.jpg",
        ],
      },
      {
        name: "Fluor Lime",
        slug: "610",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/610_100.jpg",
      },
      {
        name: "Fluor Pink",
        slug: "408",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/408_100.jpg",
        images: [
          "/textiles/mk520v/408-face.jpg",
          "/textiles/mk520v/408-dos.jpg",
          "/textiles/mk520v/408-profil.jpg",
        ],
      },
    ],
    certifications: [],
    defaultImages: [
      "https://stospweb0pro01a237.blob.core.windows.net/media/product/media/thumbnails/MK520V_SERIE_01_1000.jpg",
    ],
    price: "À partir de 7 €/pièce",
    prices: { solo: 10, team: 8, bestof: 7 },
  },
  {
    // Comme le PALM, le fournisseur scinde le modele : MK215CV pour les
    // coloris, MK215WV pour le blanc. Regroupes sur une seule fiche.
    ref: "MK215CV",
    name: "GIBSON - Polo manches courtes 210",
    brand: "Mukua",
    category: "Polos",
    description:
      "Polo unisexe en tissu piqué 35 % coton RingSpun / 65 % polyester, 210 g. Patte 3 boutons, bande de propreté renforcée au col, col et manches côtes 1x1, fentes latérales, coupe regular.",
    material: "35 % coton RingSpun / 65 % polyester (Heather Grey : 85 % coton / 15 % viscose)",
    grammage: "210 g/m²",
    cut: "Regular, patte 3 boutons, fentes latérales",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
    // Aucun packshot par coloris publie : seules les pastilles existent.
    packshotSource: "none",
    colors: [
      {
        // Blanc vendu sous la reference MK215WV, avec son propre visuel.
        name: "White",
        slug: "100",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/100_100.jpg",
        images: [
          "https://stospweb0pro01a237.blob.core.windows.net/media/product/media/thumbnails/MK215WV_SERIE_01_1000.jpg",
        ],
      },
      {
        name: "Black",
        slug: "200",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/200_100.jpg",
      },
      {
        name: "Dark Grey",
        slug: "201",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/201_100.jpg",
      },
      {
        name: "Heather Grey",
        slug: "202",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/202_100.jpg",
      },
      {
        name: "Sand",
        slug: "103",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/103_100.jpg",
      },
      {
        name: "Brown",
        slug: "104",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/104_100.jpg",
      },
      {
        name: "Gold",
        slug: "305",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/305_100.jpg",
      },
      {
        name: "Orange",
        slug: "301",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/301_100.jpg",
      },
      {
        name: "Red",
        slug: "400",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/400_100.jpg",
      },
      {
        name: "Wine",
        slug: "403",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/403_100.jpg",
      },
      {
        name: "Navy",
        slug: "500",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/500_100.jpg",
      },
      {
        name: "Royal Blue",
        slug: "502",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/502_100.jpg",
      },
      {
        name: "Sky Blue",
        slug: "501",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/501_100.jpg",
      },
      {
        name: "Atoll",
        slug: "505",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/505_100.jpg",
      },
      {
        name: "Kelly Green",
        slug: "600",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/600_100.jpg",
      },
      {
        name: "Real Green",
        slug: "605",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/605_100.jpg",
      },
      {
        name: "Khaki Green",
        slug: "601",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/601_100.jpg",
      },
      {
        name: "Bottle Green",
        slug: "602",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/602_100.jpg",
      },
      {
        name: "Sage",
        slug: "613",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/613_100.jpg",
      },
      {
        name: "Lime",
        slug: "604",
        swatch: "https://stospweb0pro01a237.blob.core.windows.net/media/colors/media/thumbnails/604_100.jpg",
      },
    ],
    certifications: [],
    defaultImages: [
      "https://stospweb0pro01a237.blob.core.windows.net/media/product/media/thumbnails/MK215CV_SERIE_01_1000.jpg",
    ],
    price: "À partir de 11 €/pièce",
    prices: { solo: 14, team: 12, bestof: 11 },
  },
  {
    ref: "KP912",
    name: "Casquette trucker rétro 6 panneaux",
    brand: "K-Up",
    category: "Casquettes",
    description:
      "Casquette trucker rétro 6 panneaux en polycoton. Visière mi-profil, panneaux avant rigidifiés du même coloris, filet arrière et languette de réglage plastique. Existe aussi en Rouge et en quatre bicolores — Black/White, Navy/White, Forest Green/Light Grey, Rustic Orange/Beige — sur demande : le fournisseur ne les photographie pas.",
    material: "60 % coton / 40 % polyester",
    grammage: "210 g/m²",
    cut: "6 panneaux, visière mi-profil, réglage plastique",
    sizes: ["U"],
    colors: [
      { name: "Black", slug: "BLACK" },
      { name: "Navy", slug: "NAVY" },
      { name: "White", slug: "WHITE" },
    ],
    certifications: [],
    defaultImages: getPackshotImages("KP912", "BLACK"),
    // Achat 5,53 EUR HT : positionne comme le polo MK215CV (4,35 EUR HT),
    // la reference la plus proche en prix de revient.
    price: "À partir de 11 €/pièce",
    prices: { solo: 14, team: 12, bestof: 11 },
  },
  {
    ref: "KP162",
    name: "Casquette coton épais 5 panneaux",
    brand: "K-Up",
    category: "Casquettes",
    description:
      "Casquette 5 panneaux en coton brossé épais, souple au toucher et au tissage résistant. Fermeture arrière réglable par bande auto-agrippante.",
    material: "100 % coton brossé",
    grammage: "260 g/m²",
    cut: "5 panneaux, réglage auto-agrippant",
    sizes: ["U"],
    colors: [
      { name: "White", slug: "WHITE" },
      { name: "Black", slug: "BLACK" },
      { name: "Beige", slug: "BEIGE" },
      { name: "Dark Grey", slug: "DARKGREY" },
      {
        name: "Light Grey",
        slug: "LIGHTGREY",
        // Toptex ne publie que la vue de face pour ce coloris : les vues de
        // dos et de profil renvoient son pictogramme « image absente ».
        images: ["https://cdn.toptex.com/packshots/PS_KP162_LIGHTGREY.png"],
      },
      { name: "Slate Grey", slug: "SLATEGREY" },
      { name: "Navy", slug: "NAVY" },
      { name: "Royal Blue", slug: "ROYALBLUE" },
      { name: "Forest Green", slug: "FORESTGREEN" },
      { name: "Kelly Green", slug: "KELLYGREEN" },
      { name: "Khaki", slug: "KHAKI" },
      { name: "Lime", slug: "LIME" },
      { name: "Yellow", slug: "YELLOW" },
      { name: "Orange", slug: "ORANGE" },
      { name: "Red", slug: "RED" },
    ],
    certifications: [],
    defaultImages: getPackshotImages("KP162", "BLACK"),
    // Achat 1,67 EUR HT, moins cher que l'ancienne casquette a 2,73 : prix
    // inchange pour le client, marge amelioree d'autant.
    price: "À partir de 8 €/pièce",
    prices: { solo: 11, team: 9, bestof: 8 },
  },
  {
    ref: "KI3223",
    name: "Sac shopping avec longues anses",
    brand: "Kimood",
    category: "Sacs",
    description:
      "Tote bag 100 % coton avec anses longues de 70 cm dans la même matière. Contenance 13 L, format 38 x 42 cm.",
    material: "100 % coton",
    grammage: "130 g/m²",
    cut: "38 x 42 cm, anses 70 cm, 13 L",
    sizes: ["U"],
    colors: [
      { name: "White", slug: "WHITE" },
      { name: "Black", slug: "BLACK" },
      { name: "Natural", slug: "NATURAL" },
      { name: "Navy", slug: "NAVY" },
    ],
    certifications: ["OEKO-TEX", "VEGAN"],
    defaultImages: [
      "https://cdn.toptex.com/pictures/KI3223-2_2026.jpg",
      "https://cdn.toptex.com/pictures/KI3223-3_2026.jpg",
      "https://cdn.toptex.com/packshots/PS_KI3223_NATURAL.png",
    ],
    price: "À partir de 5 €/pièce",
    prices: { solo: 7, team: 6, bestof: 5 },
  },
];

export function getPackshotImages(ref: string, colorSlug: string): string[] {
  return [
    `https://cdn.toptex.com/packshots/PS_${ref}_${colorSlug}.png`,
    `https://cdn.toptex.com/packshots/PS_${ref}-B_${colorSlug}.png`,
    `https://cdn.toptex.com/packshots/PS_${ref}-S_${colorSlug}.png`,
  ];
}

// Visuels d'un coloris : ceux portes par le coloris s'il en a (fournisseur hors
// Toptex), sinon selon la convention declaree par le produit.
/**
 * Le fournisseur publie-t-il un visuel propre a ce coloris ?
 *
 * Faux pour les references dont on ne connait qu'une photo de groupe (Velilla
 * et Mukua, hors MK023CV) : cliquer une pastille ne peut alors pas changer
 * l'image. L'interface le signale plutot que de laisser croire a une panne.
 */
export function hasColorPhoto(product: Product, color: ProductColor): boolean {
  if (color.images) return true;
  return product.packshotSource !== "none";
}

export function getColorImages(
  product: Product,
  color: ProductColor
): string[] {
  if (color.images) return color.images;
  if (product.packshotSource === "none") return product.defaultImages;
  return getPackshotImages(product.ref, color.slug);
}

export function getColorSwatch(ref: string, color: ProductColor): string {
  return (
    color.swatch ??
    `https://cdn.toptex.com/stickers/PAST_${ref}_${color.slug}.jpg?w=48`
  );
}
