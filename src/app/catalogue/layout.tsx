import type { Metadata } from "next";

/**
 * La page catalogue est un composant client — elle lit les parametres d'URL
 * pour filtrer par categorie — et ne peut donc pas exporter de `metadata`.
 * Ce layout le fait a sa place : sans lui, la page heritait du titre de
 * l'accueil et se presentait aux moteurs comme un doublon.
 */
export const metadata: Metadata = {
  title: "Catalogue textile | L'Appart 98",
  description:
    "T-shirts, sweats, hoodies, polos, casquettes et tote bags personnalisables à Gentilly. 19 références, coloris et grammages détaillés.",
  openGraph: {
    title: "Catalogue textile | L'Appart 98",
    description:
      "19 références personnalisables : t-shirts, sweats, hoodies, polos, casquettes, tote bags.",
    type: "website",
  },
  alternates: { canonical: "/catalogue" },
};

export default function CatalogueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
