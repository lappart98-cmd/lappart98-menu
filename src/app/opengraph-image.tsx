import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * L'image qui s'affiche quand on partage le lien du site.
 *
 * Elle montre le produit au lieu de le decrire : un vetement qui porte la
 * marque, ce qui est exactement ce qu'on vend. Le compositing est fait en
 * amont par scripts/build-og-vetement.py — un crawler qui recupere une
 * preview n'attend pas qu'on telecharge un packshot pour le detourer.
 *
 * Fond lime et logo noir, comme le favicon.
 */

export const alt =
  "L'Appart 98 — un t-shirt floqué à l'atelier de Gentilly : DTF, broderie, stickers UV";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LIME = "#C5FF00";
const NOIR = "#0A0A0A";

export default async function Image() {
  // process.cwd() est la racine du projet pendant le rendu.
  const [oswald, logo, vetement] = await Promise.all([
    readFile(join(process.cwd(), "assets/Oswald-Bold.ttf")),
    readFile(join(process.cwd(), "public/logo-lappart98.png")),
    readFile(join(process.cwd(), "assets/og-vetement.png")),
  ]);
  const b64 = (b: Buffer) => `data:image/png;base64,${b.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: LIME,
          display: "flex",
          position: "relative",
          fontFamily: "Oswald",
        }}
      >
        {/* Le vetement deborde volontairement en bas : cadre serre, on lit
            un objet plutot qu'un packshot pose au milieu du vide. */}
        <img
          src={b64(vetement)}
          alt=""
          height={700}
          style={{ position: "absolute", right: 44, top: 52 }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 0 60px 72px",
            width: 700,
          }}
        >
          {/* Pas de next/image : satori rend le JSX hors du navigateur et ne
              connait que la balise brute. */}
          <img src={b64(logo)} alt="" width={430} height={64} />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 78,
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
                fontSize: 78,
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
              flexDirection: "column",
              borderTop: `3px solid ${NOIR}`,
              paddingTop: 22,
              fontSize: 25,
              color: NOIR,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            <div style={{ display: "flex" }}>DTF · Broderie · Stickers UV</div>
            <div style={{ display: "flex", opacity: 0.6, marginTop: 6 }}>
              Atelier textile — Gentilly (94)
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Oswald", data: oswald, style: "normal", weight: 700 }],
    }
  );
}
