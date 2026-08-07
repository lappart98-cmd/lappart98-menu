/**
 * Les coordonnees de l'atelier, en un seul endroit.
 *
 * Elles etaient recopiees a la main dans le Hero, la Navbar, la section
 * Contact et les deux generateurs de PDF. L'adresse mail y a diverge sans que
 * personne le voie : le site invitait a ecrire a un domaine parque, pendant que
 * la vraie boite tournait ailleurs. Un seul fichier, une seule verite.
 */

export const ATELIER = {
  adresse: "65 rue Charles Frérot, 94250 Gentilly",
  telephone: "06 75 00 86 33",
  telephoneInternational: "+33675008633",
  whatsapp: "https://wa.me/33675008633",
  instagram: "https://instagram.com/lappart_98",
  instagramPseudo: "@lappart_98",
  email: "contact@lappart98.com",
  site: "https://www.lappart98.com",
  siteAffiche: "www.lappart98.com",
} as const;

/**
 * Les horaires, sous deux formes.
 *
 * `affichage` est ce que lit un visiteur ; `machine` est ce que Google avale
 * dans la fiche LocalBusiness. Les deux vivent cote a cote pour qu'un
 * changement d'horaire ne puisse pas n'en corriger qu'une seule.
 *
 * Les jours feries ne s'expriment pas en JSON-LD sans lister chaque date : ils
 * ne figurent donc que dans le texte visible.
 */
export const HORAIRES = {
  affichage: {
    jours: "Du lundi au samedi",
    heures: "9h – 17h",
    fermeture: "Fermé le dimanche et les jours fériés",
  },
  machine: {
    jours: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    ouverture: "09:00",
    fermeture: "17:00",
  },
} as const;

/** Le lien « Email » des boutons d'appel : sujet et corps deja remplis. */
export const LIEN_MAIL_DEVIS =
  `mailto:${ATELIER.email}` +
  "?subject=Demande%20de%20devis" +
  "&body=Salut%20!%20Je%20voudrais%20un%20devis%20pour%20du%20textile%20personnalis%C3%A9.%0AMerci%20!";
