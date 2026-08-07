import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import { ATELIER } from "@/data/contact";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  // Sans metadataBase, l'image de partage sort en chemin relatif : Facebook,
  // WhatsApp et consorts n'en font rien et le lien s'affiche nu.
  metadataBase: new URL(ATELIER.site),
  title: "L'Appart 98 | Le Menu de l'Atelier",
  description:
    "Atelier textile DTF, flocage & stickers UV à Gentilly. Compose ton textile personnalisé comme au comptoir.",
  openGraph: {
    title: "L'Appart 98 | Le Menu de l'Atelier",
    description:
      "DTF, flocage, stickers UV. Compose ton textile perso comme au comptoir.",
    type: "website",
    locale: "fr_FR",
    siteName: "L'Appart 98",
    url: ATELIER.site,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${oswald.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
