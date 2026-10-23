import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import Script from "next/script";
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

const FB_PIXEL_ID = "5082749315285086";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${oswald.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${FB_PIXEL_ID}');fbq('track','PageView');`}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
