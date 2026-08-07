import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * L'image qui s'affiche quand on partage le lien du site.
 *
 * Sans elle, un lien envoye sur WhatsApp ou en story sort nu : un titre, une
 * ligne de texte, rien a regarder. Pour un atelier qui vend de l'image, c'est
 * le pire endroit ou economiser.
 *
 * Fond lime et logo noir, comme le favicon : le logo est un trace noir sur
 * transparence, il se pose donc directement sur la couleur de la marque sans
 * retouche.
 */

export const alt =
  "L'Appart 98 — atelier textile à Gentilly : DTF, broderie, stickers UV";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LIME = "#C5FF00";
const NOIR = "#0A0A0A";

export default async function Image() {
  // process.cwd() est la racine du projet pendant le rendu.
  const [oswald, logo] = await Promise.all([
    readFile(join(process.cwd(), "assets/Oswald-Bold.ttf")),
    readFile(join(process.cwd(), "public/logo-lappart98.png")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: LIME,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px 76px",
          fontFamily: "Oswald",
        }}
      >
        {/* Pas de next/image ici : satori rend le JSX hors du navigateur et
            ne connait que la balise brute. */}
        <img src={logoSrc} alt="" width={520} height={77} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 86,
              lineHeight: 1,
              color: NOIR,
              textTransform: "uppercase",
              letterSpacing: -1,
            }}
          >
            Vois ton logo
          </div>
          <div
            style={{
              fontSize: 86,
              lineHeight: 1.05,
              color: NOIR,
              textTransform: "uppercase",
              letterSpacing: -1,
              opacity: 0.55,
            }}
          >
            avant de commander
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `3px solid ${NOIR}`,
            paddingTop: 26,
            fontSize: 27,
            color: NOIR,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          <div style={{ display: "flex" }}>
            DTF · Broderie · Stickers UV
          </div>
          <div style={{ display: "flex", opacity: 0.6 }}>Gentilly (94)</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Oswald", data: oswald, style: "normal", weight: 700 }],
    }
  );
}
