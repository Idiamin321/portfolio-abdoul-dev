# Portfolio — Abdoul dev

Site statique (HTML/CSS/JS, aucun langage serveur) publié sur
`portfolio.abdoul.e-webcode.fr` via GitHub Pages.

Le contenu n'est plus écrit en dur dans `index.html` : il vient de deux fichiers JSON,
lus à la fois par le site, par l'application Android et modifiés par l'application admin.

```
index.html          structure de la page
style.css           design
content.js          lit les JSON et génère le contenu
script.js           animations (chargé après le contenu)
data/profil.json    nom, bio, photo, expertise, contact
data/projets.json   réalisations
img/projets/        images des réalisations (WebP, 1600 px max)
```

## Ajouter une réalisation

Ajouter un objet dans `data/projets.json` (l'ordre du tableau = l'ordre d'affichage)
et son image dans `img/projets/`. Exemple :

```json
{
  "id": "mon-projet",
  "titre": "Mon projet",
  "image": "img/projets/mon-projet.webp",
  "description": [
    "**Mon projet** est une boutique en ligne…",
    "J'ai réalisé…"
  ],
  "liste": { "titre": "Réalisations", "elements": ["Module A", "Module B"] },
  "fonctionnalites": ["Fonction 1", "Fonction 2"],
  "technologies": ["WordPress", "PHP"],
  "lien": { "libelle": "Voir le site", "url": "https://exemple.com/" },
  "image_a_droite": false,
  "visible": true
}
```

| Champ | Obligatoire | Rôle |
|---|---|---|
| `id` | oui | identifiant unique (minuscules, tirets) |
| `titre` | oui | titre affiché |
| `image` | oui | chemin relatif de l'image |
| `description` | oui | paragraphes ; `**gras**` et `*italique*` acceptés |
| `liste` | non | liste à puces avec un intitulé |
| `fonctionnalites` | non | ligne « Fonctionnalités : a - b - c » |
| `technologies` | non | ligne « Technologies : a - b - c » |
| `lien` | non | bouton ; `url` peut être `https://…`, `mailto:…` ou `#` |
| `image_a_droite` | non | image à droite sur ordinateur (défaut : gauche) |
| `visible` | non | `false` pour masquer sans supprimer |

## Tester en local

Les JSON sont chargés avec `fetch()`, donc ouvrir `index.html` en double-clic ne marche pas.
Lancer un petit serveur dans le dossier :

```
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000.
