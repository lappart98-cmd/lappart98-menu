"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, Paperclip, Send, X } from "lucide-react";
import { envoyerDevis, type DevisState } from "@/app/actions/devis";

const initialState: DevisState = { status: "idle", message: "" };

const MAX_FILE_BYTES = 4 * 1024 * 1024;

const inputClass =
  "w-full bg-[#1a1a1a] border rounded-lg px-3 py-2.5 font-body text-sm text-white placeholder:text-white/25 outline-none transition-colors duration-200 focus:border-[#C5FF00]";

const selectClass =
  "w-full bg-[#1a1a1a] border rounded-lg px-3 py-2.5 font-body text-sm text-white outline-none transition-colors duration-200 focus:border-[#C5FF00] appearance-none cursor-pointer bg-[length:14px] bg-[right_0.75rem_center] bg-no-repeat [background-image:url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='%23888'%20stroke-width='2'%3E%3Cpath%20d='M6%209l6%206%206-6'/%3E%3C/svg%3E\")]";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-heading text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1.5">
        {label}
      </span>
      {children}
      {error && (
        <span className="font-body text-xs text-red-400 mt-1 block">
          {error}
        </span>
      )}
    </label>
  );
}

// Isole dans son propre composant : le <form> parent est remonte via sa `key`
// a chaque tentative, donc cet etat se reinitialise en meme temps que l'input
// natif que React vide. Pas d'effet de synchronisation a maintenir.
function LogoPicker({
  serverError,
  detacheNotice,
}: {
  serverError?: string;
  detacheNotice: boolean;
}) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const notice = detacheNotice
    ? "Ton fichier a été détaché, re-joins-le avant de renvoyer."
    : undefined;

  return (
    <Field
      label="Ton visuel / logo"
      error={fileError ?? serverError ?? notice}
    >
      <input
        ref={fileInputRef}
        type="file"
        name="logo"
        accept=".png,.jpg,.jpeg,.webp,.svg,.heic,.pdf,.ai,.eps,.psd,image/*"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f && f.size > MAX_FILE_BYTES) {
            setFileError("Fichier trop lourd (4 Mo max)");
            setFileName(null);
            e.target.value = "";
            return;
          }
          setFileError(null);
          setFileName(f?.name ?? null);
        }}
        className="hidden"
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] hover:border-[#C5FF00]/50 rounded-lg px-3 py-2.5 font-body text-sm text-white/70 transition-colors duration-200 cursor-pointer"
        >
          <Paperclip className="w-4 h-4" />
          {fileName ? "Changer" : "Choisir un fichier"}
        </button>
        {fileName && (
          <span className="flex items-center gap-1.5 min-w-0 font-body text-xs text-[#C5FF00]">
            <span className="truncate">{fileName}</span>
            <button
              type="button"
              onClick={() => {
                setFileName(null);
                setFileError(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              aria-label="Retirer le fichier"
              className="shrink-0 text-white/40 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        )}
      </div>
      <span className="font-body text-[11px] text-white/30 mt-1.5 block">
        PNG, JPG, PDF, SVG, AI &mdash; 4 Mo max. Fichier plus lourd ? Envoie-le
        sur WhatsApp.
      </span>
    </Field>
  );
}

export default function DevisForm({
  recap,
  formule,
}: {
  recap: string;
  formule: string;
}) {
  const [state, formAction, pending] = useActionState(
    envoyerDevis,
    initialState
  );

  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};

  // Remonte une conversion "Prospect" (event Lead) a Meta quand le devis part.
  useEffect(() => {
    if (state.status !== "success" || typeof window === "undefined") return;
    const w = window as { fbq?: (...args: unknown[]) => void };
    if (typeof w.fbq === "function") w.fbq("track", "Lead");
  }, [state.status]);

  const borderFor = (key: string) =>
    errors[key] ? "border-red-500/60" : "border-[#333]";

  if (state.status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#C5FF00]/10 border border-[#C5FF00]/30 rounded-xl p-6 text-center"
      >
        <div className="w-12 h-12 rounded-full bg-[#C5FF00] flex items-center justify-center mx-auto mb-3">
          <Check className="w-6 h-6 text-[#0A0A0A]" strokeWidth={3} />
        </div>
        <p className="font-heading text-lg font-black uppercase text-[#C5FF00]">
          C&apos;est parti !
        </p>
        <p className="font-body text-sm text-white/60 mt-1">{state.message}</p>
      </motion.div>
    );
  }

  return (
    <form
      key={state.attempt ?? 0}
      action={formAction}
      className="flex flex-col gap-4"
    >
      <input type="hidden" name="recap" value={recap} />
      <input type="hidden" name="formule" value={formule} />

      {/* Piege a bots : invisible pour un humain, rempli par les robots. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute w-px h-px -left-full opacity-0 pointer-events-none"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nom *" error={errors.nom}>
          <input
            name="nom"
            required
            defaultValue={values.nom}
            autoComplete="name"
            placeholder="Ton nom"
            className={`${inputClass} ${borderFor("nom")}`}
          />
        </Field>
        <Field label="Structure / asso" error={errors.structure}>
          <input
            name="structure"
            defaultValue={values.structure}
            autoComplete="organization"
            placeholder="Optionnel"
            className={`${inputClass} ${borderFor("structure")}`}
          />
        </Field>
        <Field label="Email *" error={errors.email}>
          <input
            name="email"
            type="email"
            required
            defaultValue={values.email}
            autoComplete="email"
            inputMode="email"
            placeholder="ton@email.fr"
            className={`${inputClass} ${borderFor("email")}`}
          />
        </Field>
        <Field label="Téléphone *" error={errors.telephone}>
          <input
            name="telephone"
            type="tel"
            required
            defaultValue={values.telephone}
            autoComplete="tel"
            inputMode="tel"
            placeholder="06 12 34 56 78"
            className={`${inputClass} ${borderFor("telephone")}`}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Type de demande *" error={errors.typeDemande}>
          <select
            name="typeDemande"
            required
            defaultValue={values.typeDemande ?? ""}
            className={`${selectClass} ${borderFor("typeDemande")}`}
          >
            <option value="" disabled>
              Choisis…
            </option>
            <option value="Particulier">Particulier</option>
            <option value="Entreprise">Entreprise</option>
            <option value="Association / club">Association / club</option>
            <option value="Événement (EVJF, anniv…)">
              Événement (EVJF, anniv…)
            </option>
          </select>
        </Field>
        <Field label="Quantité estimée *" error={errors.quantite}>
          <input
            name="quantite"
            required
            defaultValue={values.quantite}
            inputMode="numeric"
            placeholder="ex : 30 pièces"
            className={`${inputClass} ${borderFor("quantite")}`}
          />
        </Field>
      </div>

      <Field label="Date / délai souhaité *" error={errors.delai}>
        <input
          name="delai"
          required
          defaultValue={values.delai}
          placeholder="ex : avant le 15/12, ou « pas pressé »"
          className={`${inputClass} ${borderFor("delai")}`}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Technique souhaitée" error={errors.technique}>
          <select
            name="technique"
            defaultValue={values.technique ?? ""}
            className={`${selectClass} ${borderFor("technique")}`}
          >
            <option value="">Je ne sais pas, conseillez-moi</option>
            <option value="DTF">DTF (impression)</option>
            <option value="Flocage">Flocage</option>
            <option value="Broderie">Broderie</option>
          </select>
        </Field>
        <Field label="État de ton visuel" error={errors.etatVisuel}>
          <select
            name="etatVisuel"
            defaultValue={values.etatVisuel ?? ""}
            className={`${selectClass} ${borderFor("etatVisuel")}`}
          >
            <option value="">À préciser</option>
            <option value="Fichier prêt">J&apos;ai un fichier prêt</option>
            <option value="À retravailler">À retravailler</option>
            <option value="À créer">À créer (je n&apos;ai rien)</option>
          </select>
        </Field>
      </div>

      <Field label="Répartition des tailles" error={errors.tailles}>
        <input
          name="tailles"
          defaultValue={values.tailles}
          placeholder="ex : 5 M, 8 L, 2 XL"
          className={`${inputClass} ${borderFor("tailles")}`}
        />
      </Field>

      <LogoPicker
        serverError={errors.logo}
        detacheNotice={state.status === "error" && state.hadFile === true}
      />

      <Field label="Precisions" error={errors.message}>
        <textarea
          name="message"
          rows={3}
          defaultValue={values.message}
          placeholder="Couleurs, détails du visuel, contraintes..."
          className={`${inputClass} ${borderFor("message")} resize-none`}
        />
      </Field>

      <Field label="Comment nous as-tu connus ?" error={errors.source}>
        <select
          name="source"
          defaultValue={values.source ?? ""}
          className={`${selectClass} ${borderFor("source")}`}
        >
          <option value="">Optionnel</option>
          <option value="Instagram">Instagram</option>
          <option value="Google">Google / recherche</option>
          <option value="Bouche-à-oreille">Bouche-à-oreille</option>
          <option value="Publicité">Une publicité</option>
          <option value="Autre">Autre</option>
        </select>
      </Field>

      <Field label="Je préfère être recontacté par">
        <div className="flex gap-2">
          {["Email", "WhatsApp"].map((opt) => (
            <label key={opt} className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="preferenceContact"
                value={opt}
                defaultChecked={(values.preferenceContact || "Email") === opt}
                className="peer sr-only"
              />
              <span className="block text-center font-heading text-xs font-bold uppercase tracking-wider rounded-lg border border-[#333] bg-[#1a1a1a] text-white/50 py-2.5 transition-colors duration-200 peer-checked:border-[#C5FF00] peer-checked:bg-[#C5FF00]/[0.06] peer-checked:text-[#C5FF00]">
                {opt}
              </span>
            </label>
          ))}
        </div>
      </Field>

      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          name="consentement"
          value="oui"
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#C5FF00] cursor-pointer"
        />
        <span className="font-body text-xs text-white/50 leading-relaxed">
          J&apos;accepte d&apos;être recontacté par L&apos;Appart 98 au sujet de
          ma demande. Mes informations ne servent qu&apos;à traiter ce devis. *
        </span>
      </label>
      {errors.consentement && (
        <span className="font-body text-xs text-red-400 -mt-2 block">
          {errors.consentement}
        </span>
      )}

      {state.status === "error" && (
        <p className="font-body text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex items-center justify-center gap-2 bg-[#C5FF00] text-[#0A0A0A] px-4 py-3.5 rounded-lg font-heading text-sm font-bold uppercase tracking-wider hover:bg-[#9ECC00] disabled:opacity-60 disabled:cursor-wait transition-colors duration-200 cursor-pointer"
      >
        {pending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />
            Envoi...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" strokeWidth={2.5} />
            Envoyer ma demande
          </>
        )}
      </button>
    </form>
  );
}
