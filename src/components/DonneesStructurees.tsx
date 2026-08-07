import { ATELIER, HORAIRES } from "@/data/contact";

/**
 * La fiche que Google lit pour comprendre qu'on est un atelier physique.
 *
 * Sans elle, le site n'est qu'une page parmi d'autres : rien ne dit qu'il y a
 * une adresse, un telephone, des horaires et une zone desservie. C'est ce qui
 * fait la difference entre apparaitre dans une recherche « flocage textile
 * Gentilly » et ne pas exister pour elle.
 *
 * L'adresse declaree ici est celle de l'atelier, pas du siege : c'est la
 * qu'on accueille, et c'est ce que Google doit pointer sur une carte.
 */
export default function DonneesStructurees() {
  const fiche = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${ATELIER.site}/#atelier`,
    name: "L'Appart 98",
    description:
      "Atelier textile à Gentilly : DTF, broderie, flocage et stickers UV sur t-shirts, sweats, polos, casquettes et tote bags.",
    url: ATELIER.site,
    telephone: ATELIER.telephoneInternational,
    email: ATELIER.email,
    image: `${ATELIER.site}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "65 rue Charles Frérot",
      postalCode: "94250",
      addressLocality: "Gentilly",
      addressRegion: "Île-de-France",
      addressCountry: "FR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [...HORAIRES.machine.jours],
        opens: HORAIRES.machine.ouverture,
        closes: HORAIRES.machine.fermeture,
      },
    ],
    areaServed: [
      { "@type": "City", name: "Gentilly" },
      { "@type": "City", name: "Paris" },
      { "@type": "AdministrativeArea", name: "Val-de-Marne" },
      { "@type": "AdministrativeArea", name: "Île-de-France" },
    ],
    sameAs: [ATELIER.instagram],
    // Fourchette indicative : le premier prix du menu, sans engagement.
    priceRange: "€€",
    currenciesAccepted: "EUR",
  };

  return (
    <script
      type="application/ld+json"
      // Les valeurs viennent d'un module local, pas d'une saisie : rien a
      // echapper au-dela de ce que JSON.stringify fait deja.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(fiche) }}
    />
  );
}
