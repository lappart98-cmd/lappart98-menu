import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EDITEUR, HEBERGEUR, DONNEES } from "@/data/mentions";

export const metadata: Metadata = {
  title: "Mentions légales | L'Appart 98",
  description:
    "Éditeur, hébergeur et traitement des données personnelles du site de l'atelier L'Appart 98, à Gentilly.",
  // Page de conformite, sans interet pour la recherche : elle capterait des
  // requetes au detriment des pages qui font le travail.
  robots: { index: false, follow: true },
};

function Section({
  titre,
  children,
}: {
  titre: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-heading text-lg sm:text-xl font-bold uppercase text-[#C5FF00] mb-3">
        {titre}
      </h2>
      <div className="font-body text-sm text-white/60 leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}

export default function Mentions() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] py-16 sm:py-24 px-5 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-wider text-white/40 hover:text-[#C5FF00] transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          Retour au site
        </Link>

        <h1 className="font-heading text-4xl sm:text-5xl font-black uppercase text-white leading-[1.05] mt-6">
          Mentions <span className="text-[#C5FF00]">légales</span>
        </h1>
        <p className="font-body text-sm text-white/40 mt-2">
          Et traitement des données personnelles.
        </p>

        <Section titre="Éditeur du site">
          <p>
            <strong className="text-white/80">{EDITEUR.denomination}</strong>{" "}
            — {EDITEUR.formeJuridique}
            <br />
            Représentée par {EDITEUR.representant}
            <br />
            Siège social : {EDITEUR.siege}
            <br />
            Atelier : {EDITEUR.atelier}
            <br />
            SIRET : {EDITEUR.siret}
            <br />
            Code APE : {EDITEUR.ape}
            <br />
            {EDITEUR.tva}
            <br />
            Téléphone : {EDITEUR.telephone} — Courriel :{" "}
            <a
              href={`mailto:${EDITEUR.email}`}
              className="text-[#C5FF00] hover:underline"
            >
              {EDITEUR.email}
            </a>
            <br />
            Directeur de la publication : {EDITEUR.directeurPublication}
          </p>
          <p className="text-white/40">
            L&apos;atelier de Gentilly est le lieu de production et de retrait.
            Le siège social parisien est l&apos;adresse administrative : ne
            t&apos;y présente pas pour récupérer une commande.
          </p>
        </Section>

        <Section titre="Hébergement">
          <p>
            {HEBERGEUR.nom} — {HEBERGEUR.adresse} — {HEBERGEUR.site}
          </p>
        </Section>

        <Section titre="Nature du site">
          <p>
            Ce site présente les prestations de l&apos;atelier et permet de
            demander un devis. Aucune vente n&apos;y est conclue et aucun
            paiement n&apos;y est encaissé : les prix affichés sont des
            estimations indicatives, hors taxes, confirmées par un devis
            nominatif avant toute commande.
          </p>
        </Section>

        <Section titre="Données personnelles">
          <p>
            Le formulaire de devis collecte : {DONNEES.champs.join(", ")}. Ces
            informations servent uniquement à {DONNEES.finalite}. La base légale
            du traitement est {DONNEES.base}.
          </p>
          <p>
            Le site ne possède ni base de données ni espace de stockage : ta
            demande, visuel compris, part directement dans la messagerie de
            l&apos;atelier. Destinataire : {DONNEES.destinataire}. Conservation :{" "}
            {DONNEES.conservation}.
          </p>
          <p>
            Conformément au RGPD et à la loi Informatique et Libertés, tu
            disposes d&apos;un droit d&apos;accès, de rectification,
            d&apos;effacement, de limitation et d&apos;opposition. Il
            s&apos;exerce par simple message à{" "}
            <a
              href={`mailto:${EDITEUR.email}`}
              className="text-[#C5FF00] hover:underline"
            >
              {EDITEUR.email}
            </a>
            . En cas de désaccord, tu peux saisir la CNIL (
            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C5FF00] hover:underline"
            >
              cnil.fr
            </a>
            ).
          </p>
        </Section>

        <Section titre="Cookies">
          <p>
            Le site ne dépose aucun cookie de mesure d&apos;audience ni de
            publicité, et ne demande donc pas de consentement. Le fil Instagram
            et les avis affichés en page d&apos;accueil sont chargés depuis des
            services tiers, susceptibles de déposer leurs propres traceurs :
            leur usage relève de leurs politiques respectives.
          </p>
        </Section>

        <Section titre="Propriété intellectuelle">
          <p>
            Les textes, visuels et photographies du site appartiennent à
            L&apos;Appart 98, à l&apos;exception des packshots fournis par les
            fabricants de textile, qui restent la propriété de leurs marques.
          </p>
          <p>
            Les visuels que tu déposes restent les tiens. Tu garantis en
            détenir les droits d&apos;usage : l&apos;atelier reproduit ce que tu
            lui confies sans en vérifier la titularité, et ne pourra pas être
            tenu responsable d&apos;une contrefaçon commise par ce biais.
          </p>
        </Section>

        <Section titre="Aperçu et rendu final">
          <p>
            L&apos;aperçu généré par le configurateur est une simulation
            destinée à situer un visuel sur un vêtement. Les couleurs affichées
            à l&apos;écran, les dimensions et le rendu de la matière ne sont pas
            contractuels : seul le BAT validé avant lancement engage
            l&apos;atelier.
          </p>
        </Section>
      </div>
    </main>
  );
}
