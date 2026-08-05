// Relais des packshots fournisseurs.
//
// Les CDN de Toptex et Velilla ne renvoient pas d'en-tete CORS. Un canvas qui
// dessine une de leurs images devient « teinte » : le navigateur interdit
// alors toDataURL() et toBlob(), donc plus d'export ni de piece jointe.
//
// Servir la meme image depuis notre domaine leve la restriction. La liste
// d'hotes autorises evite d'en faire un relais ouvert, qui permettrait de
// faire emettre a notre serveur des requetes vers n'importe quelle adresse.

const HOTES_AUTORISES = new Set([
  "cdn.toptex.com",
  "stospweb0pro01a237.blob.core.windows.net",
]);

/** Les packshots ne changent jamais : un an de cache, revalidation en fond. */
const CACHE = "public, max-age=3600, s-maxage=31536000, stale-while-revalidate=86400";

export async function GET(request: Request) {
  const cible = new URL(request.url).searchParams.get("url");
  if (!cible) return new Response("Parametre url manquant", { status: 400 });

  let source: URL;
  try {
    source = new URL(cible);
  } catch {
    return new Response("URL invalide", { status: 400 });
  }

  if (source.protocol !== "https:" || !HOTES_AUTORISES.has(source.hostname)) {
    return new Response("Hote non autorise", { status: 403 });
  }

  let amont: Response;
  try {
    amont = await fetch(source, {
      signal: AbortSignal.timeout(15_000),
      next: { revalidate: 31536000 },
    });
  } catch {
    return new Response("Fournisseur injoignable", { status: 502 });
  }

  if (!amont.ok) return new Response("Visuel absent", { status: 404 });

  const type = amont.headers.get("content-type") ?? "";
  if (!type.startsWith("image/")) {
    return new Response("Ce n'est pas une image", { status: 415 });
  }

  return new Response(amont.body, {
    headers: { "content-type": type, "cache-control": CACHE },
  });
}
