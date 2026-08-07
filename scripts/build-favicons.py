#!/usr/bin/env python3
"""Fabrique les icones des deux sites a partir du logo.

    python3 scripts/build-favicons.py

Le logo est un bandeau de 6,7:1 : reduit a seize pixels, il ne reste rien.
On n'en garde donc que le monogramme, la ligature "98" placee a gauche du
mot. Deux difficultes, resolues ici une fois pour toutes :

  - le monogramme est ligature au L d'APPART, sans colonne vide entre les
    deux. On le detoure en coupant a la hampe du L, reperee comme la
    premiere colonne encree sur plus de 90 % de la hauteur.
  - dans le logo, le "98" est couche. Redresse, il se lit ; laisse tel
    quel, il ressemble a une tache. La rotation n'est donc pas cosmetique.

L'atelier prend le monogramme noir sur fond lime, la boutique l'inverse :
meme identite, deux onglets distinguables quand ils sont ouverts cote a
cote.
"""

from pathlib import Path

import numpy as np
from PIL import Image

RACINE = Path(__file__).resolve().parent.parent
SHOP = RACINE.parent / "leshop-lappart98"

LIME = (197, 255, 0)
NOIR = (10, 10, 10)

# Ce que Next.js reconnait tout seul dans app/ (cf. app-icons.md) :
# favicon.ico pour les onglets, icon.png pour les navigateurs modernes,
# apple-icon.png pour l'ecran d'accueil iOS.
TAILLES_ICO = [16, 32, 48, 64]
TAILLE_ICON = 512
TAILLE_APPLE = 180


def monogramme(logo: Path) -> Image.Image:
    """Detoure le "98" du logo et le redresse."""
    src = Image.open(logo).convert("RGBA")
    a = np.array(src)
    encre = (a[..., 3] > 40) & (a[..., :3].mean(axis=2) < 128)

    # La hampe du L est la premiere colonne pleine sur toute la hauteur.
    pleines = [x for x in range(src.width) if encre[:, x].sum() > src.height * 0.9]
    if not pleines:
        raise SystemExit("hampe du L introuvable : le logo a change de forme")
    mark = src.crop((0, 0, pleines[0], src.height))

    mark = mark.rotate(-90, expand=True, resample=Image.BICUBIC)
    return recadre(mark)


def recadre(im: Image.Image) -> Image.Image:
    a = np.array(im)
    ys, xs = np.where(a[..., 3] > 8)
    return im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


def carre(mark: Image.Image, fond, encre, taille: int, marge: float) -> Image.Image:
    """Pose le monogramme, recolore, centre sur un carre plein."""
    fond_plein = Image.new("RGBA", (taille, taille), fond + (255,))
    dispo = int(taille * (1 - 2 * marge))
    ratio = min(dispo / mark.width, dispo / mark.height)
    m = mark.resize(
        (max(1, round(mark.width * ratio)), max(1, round(mark.height * ratio))),
        Image.LANCZOS,
    )

    a = np.array(m)
    teinte = np.zeros_like(a)
    teinte[..., 0], teinte[..., 1], teinte[..., 2] = encre
    teinte[..., 3] = a[..., 3]
    m = Image.fromarray(teinte)

    fond_plein.paste(m, ((taille - m.width) // 2, (taille - m.height) // 2), m)
    return fond_plein


def ecrire(app: Path, mark: Image.Image, fond, encre, nom: str) -> None:
    if not app.is_dir():
        raise SystemExit(f"repertoire introuvable : {app}")

    # L'ico embarque plusieurs tailles : le navigateur choisit la sienne.
    # Chacune est rendue a sa taille propre plutot que reduite depuis une
    # seule, sinon les petits formats bavent.
    plans = [carre(mark, fond, encre, t, 0.12) for t in TAILLES_ICO]
    plans[-1].save(
        app / "favicon.ico",
        format="ICO",
        sizes=[(t, t) for t in TAILLES_ICO],
        append_images=plans[:-1],
    )

    carre(mark, fond, encre, TAILLE_ICON, 0.14).convert("RGB").save(
        app / "icon.png", optimize=True
    )
    # iOS rogne les angles : on respire un peu plus pour ne rien perdre.
    carre(mark, fond, encre, TAILLE_APPLE, 0.18).convert("RGB").save(
        app / "apple-icon.png", optimize=True
    )
    print(f"  {nom:8s} favicon.ico + icon.png + apple-icon.png -> {app}")


def main() -> None:
    mark = monogramme(RACINE / "public" / "logo-lappart98.png")
    print(f"  monogramme redresse : {mark.width}x{mark.height}")

    ecrire(RACINE / "src" / "app", mark, LIME, NOIR, "atelier")
    ecrire(SHOP / "src" / "app", mark, NOIR, LIME, "shop")


if __name__ == "__main__":
    main()
