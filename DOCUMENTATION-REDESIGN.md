# Documentation Probo — refonte du 22 octobre 2026

Version locale de la documentation, basée sur `getprobo/probo.com`, branche `v2`, commit `0f61da075174072cc0f4d4d96d6eca5b4458f950`. Le site public n'a pas été modifié.

## Ce qui change

- Quatre entrées : **Get started**, **Use Probo**, **Developers**, **Deploy Probo**. Les URL existantes restent en place.
- Navigation par groupes repliables, position courante visible, sommaire adapté à la largeur, menu mobile et navigation au clavier.
- Style aligné sur le site : Geist, surfaces sobres, colonne de lecture limitée, liens explicites, tableaux et blocs de code lisibles, thèmes clair et sombre.
- Accueils orientés vers les tâches. 23 articles existants revus ; deux guides ajoutés : premiers pas Cloud et premier risque. Les références techniques complètes sont conservées.
- Recherche Pagefind : contexte de rubrique, priorité aux titres, états vide/erreur, pagination. La politique CSP permet le WebAssembly nécessaire uniquement dans les docs et leur worker de recherche ; l'évaluation JavaScript reste interdite.
- Titres, descriptions, canonicals, JSON-LD, sitemap, Markdown et index LLM conservés. Les dates proviennent de l'historique Git complet, jamais de la date de compilation.

## Prévisualiser

Node.js 24 est requis par le projet.

```sh
npm ci
npm run build
npm run preview:cloudflare
```

Ouvrir `http://127.0.0.1:4330/docs`. Ce serveur local reproduit aussi les en-têtes et le routage Markdown Cloudflare. L'aperçu Astro seul ne reproduit pas les Functions qui servent les URL `.md`.

## Vérifier la conservation

```sh
npm run check:docs
node tools/check-docs-preservation.mjs \
  --base 0f61da075174072cc0f4d4d96d6eca5b4458f950 \
  --dist dist --report documentation-preservation.txt
```

Le contrôle compare les sources et les fichiers compilés : présence des 283 fichiers originaux, 1 618 ancres, 20 assets référencés, accessibilité des 273 pages par la navigation, liens internes, exports Markdown, canonicals, JSON-LD et sitemap. Les changements de métadonnées sont signalés pour relecture ; ils ne représentent pas une perte de contenu.

## Périmètre éditorial et validation

Les parcours Cloud, premier programme, risque et accès au portail ont été renforcés. Les synthèses métier et références existantes restent disponibles ; aucune procédure UI non vérifiée ni capture fictive n'a été inventée. La clarification de l'accès NDA a été recoupée avec le code public du produit (`getprobo/probo`, commit `700c31057d1598bfe2646906fc932337c0406924`, `pkg/server/api/complianceportal/v1/nda.go`).

Les vérifications de navigateur portent sur l'accueil, les guides, les références techniques, la recherche, les thèmes, le menu, le sommaire et la copie. Elles ne constituent pas une recette de toutes les opérations dans une organisation Probo authentifiée. Les données Search Console et Plain restent à examiner avec l'équipe ; aucun résultat SEO/GEO n'est promis.

La revue avec Julien puis Probo, le push et le déploiement restent des étapes séparées. Aucun envoi ni déploiement n'a été effectué.

## Passe Impeccable — 22 octobre 2026

La palette documentaire utilise désormais le jaune Probo `#E6FF03` pour les repères et sélections, des surfaces neutres et du texte contrasté. L'accent décoratif, la couleur de texte et le focus clavier ont des tokens distincts. Les blocs de code et diagrammes sont neutralisés ; les couleurs sémantiques d'alerte restent disponibles. Les sélections, boutons de copie, recherches, glossaire et états actifs suivent le même système.

Le titre est légèrement moins serré, l'entrée dans les parcours plus compacte, et les contrôles mobiles plus faciles à viser. Le thème mobile est accessible dans le menu pour garder une barre supérieure lisible à 320 px. Le glossaire revient à la ligne sans largeur minimale sur téléphone.

Deux lectures indépendantes et un contrôle Impeccable ont été utilisés. Le détecteur ne conserve qu'un avertissement de police courante : Geist est volontairement maintenue pour respecter les pages produit et le blog. Les ratios des principales paires texte/fond sont vérifiés (minimum 5,23:1). Le contrôle visuel utilise les captures de la version précédente ; l'accès navigateur à la nouvelle version a été bloqué pendant cette passe. Ne pas présenter cela comme une validation visuelle live du nouveau rendu.
