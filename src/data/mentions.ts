/**
 * Informations legales de l'atelier.
 *
 * L'article 6-III de la LCEN impose ces mentions a tout site professionnel,
 * qu'il vende en ligne ou non. Le site ne vend pas : il fait des devis. Il n'y
 * a donc pas de CGV ici, mais le formulaire collecte des donnees personnelles,
 * ce qui rend la section RGPD obligatoire.
 *
 * Les coordonnees viennent de contact.ts : une seule source pour tout le site.
 */

import { ATELIER } from "./contact";

export const EDITEUR = {
  denomination: "L'Appart 98",
  formeJuridique: "Entreprise individuelle (micro-entrepreneur)",
  // Depuis mai 2022, l'entrepreneur individuel fait figurer « EI » avec son
  // nom sur ses documents commerciaux (art. R526-27 du code de commerce).
  representant: "Romain Lemaire (EI)",
  directeurPublication: "Romain Lemaire",
  siret: "799 666 326 00027",
  // Franchise en base : pas de TVA facturee, la mention de l'article est
  // obligatoire sur les documents commerciaux.
  tva: "TVA non applicable, article 293 B du CGI",
  ape: "74.10Z — Activités spécialisées de design",
  siege: "98 rue des Dames, 75017 Paris",
  atelier: ATELIER.adresse,
  telephone: ATELIER.telephone,
  email: ATELIER.email,
};

export const HEBERGEUR = {
  nom: "Vercel Inc.",
  adresse: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
  site: "vercel.com",
};

/**
 * Ce que le formulaire de devis collecte, et ce qu'il en fait.
 *
 * Aucune base de donnees, aucun stockage : la demande part directement dans
 * la boite mail de l'atelier, piece jointe comprise. La duree de conservation
 * est donc celle de la messagerie, pas celle d'un serveur.
 */
export const DONNEES = {
  champs: [
    "nom",
    "adresse électronique",
    "téléphone",
    "structure (facultatif)",
    "détail de la demande et visuel joint",
  ],
  finalite: "répondre à ta demande de devis et préparer ta commande",
  base: "ton consentement, matérialisé par l'envoi du formulaire",
  destinataire: "l'atelier seul — aucune donnée n'est vendue ni cédée",
  conservation: "trois ans après le dernier échange, puis suppression",
};
