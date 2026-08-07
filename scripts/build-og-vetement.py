#!/usr/bin/env python3
"""Compose le logo sur un t-shirt, pour l'image de partage.

    python3 scripts/build-og-vetement.py

L'image Open Graph montrait le service en mots. Elle le montre desormais en
objet : le vetement porte la marque, ce qui est exactement ce qu'on vend.

Le rendu est fige dans assets/ plutot que calcule a chaque partage. Un
crawler qui recupere une preview n'attend pas : il ne doit pas declencher un
telechargement de packshot et un compositing.

Trois etapes :
  - le packshot Toptex arrive sur fond blanc. On le detoure par propagation
    depuis les bords, pas par simple seuil : un seuil mangerait les reflets
    clairs a l'interieur du vetement.
  - le logo est teinte, puis pose dans la zone poitrine, aux memes
    proportions que le configurateur.
  - le tout est recadre au vetement et enregistre avec sa transparence, pour
    pouvoir etre pose sur n'importe quel fond.
"""

from collections import deque
from pathlib import Path
from urllib.request import urlopen

import numpy as np
from PIL import Image

RACINE = Path(__file__).resolve().parent.parent
CACHE = RACINE / "node_modules" / ".cache" / "og"
SORTIE = RACINE / "assets" / "og-vetement.png"

# Le NS332 noir : la reference mise en avant sur le site, et un fond noir
# laisse le logo lime s'exprimer.
PACKSHOT = "https://cdn.toptex.com/packshots/PS_NS332_BLACK.png"

LIME = (197, 255, 0)

# Zone poitrine, dans l'esprit du configurateur : le visuel occupe 52 % de la
# largeur du vetement, pose a 21 % de sa hauteur. Un peu plus genereux que le
# rendu du configurateur, parce qu'une preview de partage se lit en vignette.
LARGEUR = 0.52
HAUT = 0.21

# Toptex renvoie un placeholder de 1900x2848 quand une vue n'existe pas. Il
# repond 200, donc seule la dimension le trahit.
PLACEHOLDER = (1900, 2848)


def packshot() -> Image.Image:
    CACHE.mkdir(parents=True, exist_ok=True)
    fichier = CACHE / "ns332-black.png"
    if not fichier.exists():
        print(f"  telechargement {PACKSHOT}")
        with urlopen(PACKSHOT, timeout=60) as r:
            fichier.write_bytes(r.read())

    im = Image.open(fichier).convert("RGBA")
    if im.size == PLACEHOLDER:
        raise SystemExit("Toptex a renvoye son placeholder : vue indisponible")
    return im


def detoure(im: Image.Image, seuil: int = 232) -> Image.Image:
    """Rend transparent le blanc qui touche les bords.

    Une propagation depuis le cadre, et non un seuil global : les reflets du
    tissu sont clairs eux aussi, mais enfermes dans le vetement.
    """
    a = np.array(im)
    clair = (a[..., :3] > seuil).all(axis=2)
    h, w = clair.shape

    vu = np.zeros((h, w), bool)
    file = deque()
    for x in range(w):
        for y in (0, h - 1):
            if clair[y, x] and not vu[y, x]:
                vu[y, x] = True
                file.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if clair[y, x] and not vu[y, x]:
                vu[y, x] = True
                file.append((y, x))

    while file:
        y, x = file.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and clair[ny, nx] and not vu[ny, nx]:
                vu[ny, nx] = True
                file.append((ny, nx))

    a[..., 3] = np.where(vu, 0, a[..., 3])
    return Image.fromarray(a)


def recadre(im: Image.Image) -> Image.Image:
    a = np.array(im)
    ys, xs = np.where(a[..., 3] > 8)
    return im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


def teinte(im: Image.Image, couleur) -> Image.Image:
    a = np.array(im.convert("RGBA"))
    # Le logo est un trace noir sur transparence : l'alpha porte la forme,
    # la couleur d'origine ne sert a rien.
    t = np.zeros_like(a)
    t[..., 0], t[..., 1], t[..., 2] = couleur
    t[..., 3] = a[..., 3]
    return Image.fromarray(t)


def main() -> None:
    vetement = recadre(detoure(packshot()))
    print(f"  vetement detoure : {vetement.width}x{vetement.height}")

    logo = teinte(Image.open(RACINE / "public" / "logo-lappart98.png"), LIME)
    largeur = round(vetement.width * LARGEUR)
    logo = logo.resize(
        (largeur, max(1, round(logo.height * largeur / logo.width))),
        Image.LANCZOS,
    )

    x = (vetement.width - logo.width) // 2
    y = round(vetement.height * HAUT)
    vetement.alpha_composite(logo, (x, y))

    SORTIE.parent.mkdir(exist_ok=True)
    # 900 px de haut : l'image de partage rend le vetement a 700 px,
    # au-dela on alourdirait le depot pour des pixels jamais vus.
    ratio = 900 / vetement.height
    vetement.resize(
        (round(vetement.width * ratio), 900), Image.LANCZOS
    ).save(SORTIE, optimize=True)
    print(f"  ecrit : {SORTIE} ({SORTIE.stat().st_size // 1024} Ko)")


if __name__ == "__main__":
    main()
