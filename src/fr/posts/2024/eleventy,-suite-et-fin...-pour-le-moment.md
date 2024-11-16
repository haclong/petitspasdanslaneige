---
title: Eleventy, suite et fin... pour le moment
permalink: fr/posts/eleventy-suite-et-fin-pour-le-moment.html
date: 2024-11-06T21:51+0100
slug: eleventy-suite-et-fin-pour-le-moment
layout: post
lang: fr
author: haclong
tags:
  - jamstack
  - blog
  - eleventy
sites:
  - Développement
  - Haclong projects
summary: Suite à mon post précédent sur la migration vers Eleventy, j'ai automatisé un peu plus la publication de mes posts.
media:
  path: /img/teaser/free-nomad-NrE-c_ba_ew-unsplash_cropped.png
  credit: free nomad
  url: https://unsplash.com/@passimage
  name: Henningsvær
---
## Résumé des épisodes précédents
Si on se souvient dans [[eleventy-episode-iii|mon post précédent]], il me restait trois quatre petites choses à régler :
- la gestion des metadata automatisée (en tout cas, facilitée)
- la génération des pages html automatisée (ici aussi, au moins fluidifiée)
- la gestion (redimensionnement et lien) des images de bandeau de mes posts

## Gestion des metadata
Pour ce blog et pour que Eleventy puisse générer les pages HTML convenablement selon mes propres exigences, chaque post en markdown embarque un nombre certain de métadonnées dans l'entête Frontmatter. 

> Pour rappel, Frontmatter, ce sont des informations clé-valeur en yaml si je ne me trompe pas, cachées dans l'entête d'un fichier Markdown et que la majorité des interpréteurs Markdown savent décoder. 

Parmi mes métadonnées, on retrouvera
- le Titre du post, avec ponctuation, accentuation et tout le toutim
- le Slug du post, qui est le titre du post cette fois, sans les caractères spéciaux (caractères accentués, ponctuation et espace). Ce slug va servir pour créer le nom du fichier html.
- le chemin du fichier html généré (nécessaire (il me semble) à Eleventy pour déposer le fichier au bon endroit du serveur)
- la date de rédaction
- les tags
- le layout (nécessaire à Eleventy pour générer le html)

Si certaines métadonnées sont répétitives de post en post 
- l'auteur ou 
- le layout par ex, 
d'autres sont spécifiques au post en cours
- la date de rédaction
- le titre du post

Concernant le titre, il est à la source de 4 informations :
- le titre à proprement parlé, que je veux retrouver en métadonnée
- le chemin complet du fichier html généré, avec des caractères valides pour un serveur web (je joue la sécurité, pas de fioritures, pas d'accents, pas de ponctuation...)
- le slug soit le titre du post sans accents, fioritures ou ponctuation, les espaces remplacés par des tirets. *très honnêtement, je ne sais pas encore quoi faire mais je préfère ne pas avoir à me retaper tous mes posts plus tard*
- le nom du fichier markdown, ici aussi, avec des caractères valides pour un serveur web.

Il est donc appréciable de faciliter leur insertion, ne serait-ce que pour éviter de me retaper le titre plusieurs fois de suite... Et même en copier coller, ça gave.

#### Obsidian à la rescousse !
Pour cela, j'ai trouvé un plugin **[[https://silentvoid13.github.io/Templater/|Templater]]** fourni par la communauté. 

**Pour l'installer**
- Dans l'écran **Paramètres** de Obsidian, aller dans le menu **Community plugins**
- Chercher et installer le plugin **Templater**
- Définir dans la configuration du plugin le **Template folder location**

C'est l'utilisation de base pour le moment, je ne suis pas allée plus loin.

Mon **Template folder location** se trouve dans le même projet que le blog. Je n'ai pas cherché à savoir si je pouvais mettre mes templates ailleurs. En même temps, pour quoi faire ? je n'ai qu'un seul site en Jamstack.

Templater permet de modifier les layouts que j'avais préparé pour Eleventy en incluant des paramètres dynamiques.

Notez que dans le ruban à gauche (ribbon), une nouvelle icône est apparue. C'est le plugin Templater qui l'a ajouté. 

**Pour l'utiliser**
Avec Obsidian, je crée un nouveau fichier (futur post). 

Obsidian va me demander automatiquement le titre de mon post. 

*Si je laisse Obsidian faire, il va me sauvegarder mon fichier Markdown avec le titre du post comme nom de fichier. -> ça ne me va PAS DU TOUT, le Titre, brut de décoffrage, contient des accents, des ponctuations diverses et variées et des espaces blancs, bien sûr.*

Avec Templater, no soucy. Je titre mon post d'abord et seulement après, je choisis le template à appliquer à mon post (en utilisant l'icône du plugin dans le ruban à gauche)

Tadaaaa

y compris le renommage du fichier markdown avec des caractères autorisés.

Il reste à changer deux trois petites choses dans les métadonnées : le résumé et la liste des tags mais globalement, la génération de la date et la gestion des multiples copies du titre dans les métadonnées me facilitent déjà pas mal la vie !!

## Génération des fichiers html
La génération des fichiers html, c'est tout Eleventy en action.

J'avais déjà précédemment réussi à créer mon pipeline avec le serveur **GoCD** de Thoughtworks.

Le pipeline installe Eleventy, récupère mes fichiers markdown, génère les fichiers html et il me semble qu'il les envoie sur le serveur directement. Et hop !

Ce qu'il manque, c'est l'événement qui va déclencher mon pipeline. Le commit.

Pour éviter de passer par un terminal pour faire le commit en ligne de commande et/ou d'ouvrir un client git en dehors de Obsidian pour faire mon commit, j'ai trouvé un plugin Obsidian qui fait le job. Installez le Community plugin **[[https://github.com/Vinzent03/obsidian-git|Git]]** de Vinzent. Le plugin a beaucoup d'options de paramétrage et je n'ai pas tout exploré. Pour le moment, je n'ai que cherché un outil pour faire le git commit. 

Le plugin ajoute une icône dans le ribbon et une autre icône dans le menu contextuel à droite. Après, pour le fonctionnement, c'est du git classique.

Vous avez les documents qui ont été modifiés depuis le dernier commit qui apparaissent dans "Changes", il faut cliquer sur le + pour les empiler dans "Staged Changes", mettre un message de commit (bonnes pratiques) et cliquer sur la coche pour Commit.

Inutile de pusher / puller ou commit-and-sync, c'est le problème de mon pipeline. Le commit va déclencher le pipeline comme prévu et hop !

## What's next ?
D'abord, maintenant que j'ai résolu pas mal de freins à la création de contenu, il va falloir que je m'y remette... plus régulièrement.

Ensuite, j'ai encore un problème pour gérer l'insertion du bandeau (la photo) qui illustre mon post. 

Il faut
1. redimensionner l'image sélectionnée facilement (ça veut dire se souvenir des dimensions exigées)
2. ajouter l'image au post (avec des metadonnées mais si je pouvais éviter de faire ça à la main :D)
3. déployer l'image sur le serveur.
4. je n'ai toujours pas la coloration syntaxique... il va falloir que je commence à chercher
5. je ne sais plus où j'en suis pour l'insertion d'image DANS le corps du post... mais je pense que je vais avoir globalement les mêmes soucis que pour le bandeau : redimensionnement, lien et déploiement...

Concernant le point 3., effectivement, l'image ne fait pas partie du contenu sauvegardé dans le dépôt git. Du coup, l'image ne passe pas dans le pipeline et lorsque le pipeline déploie les fichiers vers le serveur, l'image n'est pas copiée vers le serveur...

Je chercherais quand j'aurais le temps. En attendant, le redimensionnement, le lien par métadonnées et le déploiement se fait encore manuellement...




