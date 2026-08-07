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

/** Le lien « Email » des boutons d'appel : sujet et corps deja remplis. */
export const LIEN_MAIL_DEVIS =
  `mailto:${ATELIER.email}` +
  "?subject=Demande%20de%20devis" +
  "&body=Salut%20!%20Je%20voudrais%20un%20devis%20pour%20du%20textile%20personnalis%C3%A9.%0AMerci%20!";
