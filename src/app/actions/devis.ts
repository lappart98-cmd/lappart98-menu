"use server";

import nodemailer from "nodemailer";

export interface DevisState {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string>;
  // React vide le formulaire apres chaque action. On renvoie la saisie pour
  // la reinjecter en defaultValue, et `attempt` sert de key pour forcer le
  // remontage avec les bonnes valeurs.
  values?: Record<string, string>;
  attempt?: number;
  // Le fichier joint ne survit pas au reset : sert a prevenir l'utilisateur.
  hadFile?: boolean;
}

const MAX_FILE_BYTES = 4 * 1024 * 1024;

const ALLOWED_MIME = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "image/heic",
  "application/pdf",
  "application/postscript",
  "application/illustrator",
  "application/octet-stream",
];

const ALLOWED_EXT = [
  "png",
  "jpg",
  "jpeg",
  "webp",
  "svg",
  "heic",
  "pdf",
  "ai",
  "eps",
  "psd",
];

function clean(value: FormDataEntryValue | null, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

// `nom`, `email` et `structure` finissent dans les en-tetes Subject et Reply-To.
// Un CR/LF dans un en-tete mail permet d'en injecter d'autres (Bcc, etc.), donc
// on retire les caracteres de controle et les guillemets qui cassent l'adresse.
function headerSafe(value: string): string {
  return value
    .replace(/[\x00-\x1F\x7F]/g, " ") // CR, LF et autres caracteres de controle
    .replace(/["<>]/g, " ") // cassent la syntaxe "Nom" <adresse>
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function envoyerDevis(
  prev: DevisState,
  formData: FormData
): Promise<DevisState> {
  const attempt = (prev.attempt ?? 0) + 1;

  // Piege a bots : ce champ est cache en CSS, un humain ne le remplit jamais.
  if (clean(formData.get("website"), 100) !== "") {
    return { status: "success", message: "Demande envoyee." };
  }

  const nom = clean(formData.get("nom"), 120);
  const email = clean(formData.get("email"), 160);
  const telephone = clean(formData.get("telephone"), 40);
  const structure = clean(formData.get("structure"), 120);
  const tailles = clean(formData.get("tailles"), 600);
  const message = clean(formData.get("message"), 2000);
  const recap = clean(formData.get("recap"), 4000);
  const formule = clean(formData.get("formule"), 80);

  const values = { nom, email, telephone, structure, tailles, message };

  const fieldErrors: Record<string, string> = {};
  if (nom.length < 2) fieldErrors.nom = "Indique ton nom";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    fieldErrors.email = "Email invalide";
  if (telephone.replace(/\D/g, "").length < 9)
    fieldErrors.telephone = "Numero invalide";

  const file = formData.get("logo");
  const hasFile = file instanceof File && file.size > 0;

  if (hasFile) {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (file.size > MAX_FILE_BYTES) {
      fieldErrors.logo = "Fichier trop lourd (4 Mo max)";
    } else if (!ALLOWED_MIME.includes(file.type) && !ALLOWED_EXT.includes(ext)) {
      fieldErrors.logo = "Format non supporte";
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Verifie les champs en rouge.",
      fieldErrors,
      values,
      attempt,
      hadFile: hasFile,
    };
  }

  // Les valeurs collees dans un panneau d'hebergeur trainent souvent un espace
  // ou un retour a la ligne invisible, que le serveur SMTP refuse ensuite.
  const env = (k: string) => process.env[k]?.trim() || undefined;
  const SMTP_HOST = env("SMTP_HOST");
  const SMTP_PORT = env("SMTP_PORT");
  const SMTP_USER = env("SMTP_USER");
  const SMTP_PASS = env("SMTP_PASS");
  const SMTP_FROM = env("SMTP_FROM");
  const DEVIS_TO = env("DEVIS_TO");

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error("[devis] SMTP non configure - demande perdue", {
      nom,
      email,
      telephone,
    });
    return {
      status: "error",
      message:
        "L'envoi est momentanement indisponible. Passe par WhatsApp, on te repond tout de suite.",
      values,
      attempt,
      hadFile: hasFile,
    };
  }

  const port = Number(SMTP_PORT ?? 587);

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const lignes: Array<[string, string]> = [
    ["Nom", nom],
    ["Email", email],
    ["Telephone", telephone],
    ["Structure", structure || "-"],
    ["Formule", formule || "-"],
    ["Tailles", tailles || "Non precise"],
    ["Message", message || "-"],
  ];

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:640px">
      <h2 style="margin:0 0 4px">Nouvelle demande de devis</h2>
      <p style="color:#666;margin:0 0 20px">${escapeHtml(formule || "Formule non precisee")}</p>
      <table cellpadding="6" style="border-collapse:collapse;width:100%">
        ${lignes
          .map(
            ([k, v]) =>
              `<tr><td style="background:#f4f4f4;font-weight:600;width:120px;vertical-align:top">${k}</td><td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`
          )
          .join("")}
      </table>
      <h3 style="margin:24px 0 8px">Recapitulatif de la commande</h3>
      <pre style="background:#f9f9f9;padding:14px;border-radius:6px;white-space:pre-wrap;font-size:13px">${escapeHtml(recap)}</pre>
      <p style="color:#888;font-size:12px">${
        hasFile
          ? "Le visuel du client est en piece jointe."
          : "Aucun visuel joint par le client."
      }</p>
    </div>
  `;

  const text = [
    ...lignes.map(([k, v]) => `${k} : ${v}`),
    "",
    "--- Recapitulatif ---",
    recap,
  ].join("\n");

  try {
    await transporter.sendMail({
      from: SMTP_FROM || `"Site L'Appart 98" <${SMTP_USER}>`,
      to: DEVIS_TO || SMTP_USER,
      replyTo: `"${headerSafe(nom)}" <${headerSafe(email)}>`,
      subject: headerSafe(
        `Devis ${formule || "site"} - ${nom}${structure ? ` (${structure})` : ""}`
      ),
      text,
      html,
      attachments:
        hasFile && file instanceof File
          ? [
              {
                filename: file.name,
                content: Buffer.from(await file.arrayBuffer()),
                contentType: file.type || "application/octet-stream",
              },
            ]
          : [],
    });
  } catch (error) {
    console.error(
      `[devis] echec envoi SMTP | hote=${SMTP_HOST} port=${port} secure=${port === 465}` +
        ` utilisateur=${SMTP_USER} longueurMotDePasse=${SMTP_PASS?.length ?? 0}`,
      error
    );
    return {
      status: "error",
      message:
        "L'envoi a echoue. Reessaie, ou passe par WhatsApp si ca persiste.",
      values,
      attempt,
      hadFile: hasFile,
    };
  }

  return {
    status: "success",
    message: "Demande envoyee ! On te repond sous 2h.",
    attempt,
  };
}
