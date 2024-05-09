---
title: "Me revoilà sur les rails..."
permalink: "fr/posts/me-revoila-sur-les-rail.html"
date: "2024-03-17T1410"
slug: me-revoila-sur-les-rails
layout: post
lang: fr
author: haclong

media:
  path: /img/teaser/bart-ros-RG2-rUfjR-0-unsplash.jpg
  credit: "Bart Ros - Unsplash"
  url: https://unsplash.com/@bartros

tags:
  - next
  - resolutions
  - eleventy
  - jamstack

sites:
  - "Haclong projects"

summary: "Après plusieurs loooongues années d'absence, Haclong fait son retour sur la toile... et parle à la troisième personne..."
---

Me revoilà.

Un peu intimidée par le nouveau blog... Non, vous n'y voyez rien, j'ai gardé les mêmes couleurs, le même thème, par paresse principalement et puis parce qu'il me plaisait bien.

Exit donc Drupal et sa base de données. Trop gros, trop lourd pour mon modeste petit blog. Je suis repartie sur une base neuve, avec <a href="https://www.11ty.dev/" target="_blank">11ty</a>

Il a fallu donc

## Préparer un bon vieux thème old school en html, css et javascript.

Ca fait des années que je n'ai écrit ni de html, ni de css et encore moins du javascript... J'ai BIEN galéré et je ne suis pas prête de changer de thème là maintenant tout de suite...

## Extraire le contenu de Drupal

Installer le module Json:API sur Drupal

Grâce à ce module, il est possible d'extraire le contenu (les nodes) de Drupal à cette adresse ```http://{mon_domaine.ext}/jsonapi/node/{content_type_name}``` pour les 50 premiers nodes et ```http://{mon_domaine.ext}/jsonapi/node/{content_type_name}?page%5Boffset%5D=50&page%5Blimit%5D=50```

Vous récupérez à chaque fois 50 nodes au format json avec les dépendances et les références de chaque node Drupal (l'auteur, les dates, la référence aux fichiers média, les tags etc...). Bref, raisonnablement ce que je cherchais à obtenir.

## Créer un script python

Comme 11ty fonctionne avec des fichiers markdown, il faut que je puisse transformer mes fichiers json extraits de Drupal, qui contiennent chacun 50 de mes articles de blog en 50 fichiers markdown distincts. Un fichier markdown par article de blog. 

Il est également crucial de préparer les entêtes frontmatter qui vont servir à générer correctement les fichiers html statiques.

Je ne vous cache pas qu'il a fallu plusieurs essais. Il est donc crucial de ne pas saboter ses fichiers json qui sont finalement mon précieux contenu.

## Vérifier les fichiers html

De la base de données Drupal, j'ai extrait le contenu en fichier json.

Des fichiers json, j'ai extrait le contenu en fichiers markdown.

Le générateur de fichiers statiques 11ty transforme ces fichiers markdown en fichier html.

Je vérifie que le contenu est correct. Il y a un GROS travail de réécriture et de nettoyage parce que les modules wysiwyg de Drupal ont laissé pas mal de balises html un peu pourries... De plus, même si Markdown a ses propres balises pour les liens hypertexte, il ne permet pas de faire des liens externes vers un nouvelle fenêtre. Je dois donc faire les liens hypertextes en bonne balise <A HREF>. Et il y a les liens vers les media à remettre en place. Je ne vous parle même pas de la coloration syntaxique qui, à ce jour, n'est toujours pas rétablie. 

## Tentative pour les commentaires

Evidemment, avec le passage du blog en fichiers statiques, je perds délibéremment la possibilité de mon audience de commenter et d'interargir avec mes posts. 

Pourtant, sans trop y croire, je trouve une application qui fonctionne avec github, <a href="https://utteranc.es" target="_blank">Utterance</a>. 

Je ne sais pas encore si ça marche, en même temps, mon blog étant en pause depuis si longtemps, je ne pense pas que qui que soit ait l'idée de commenter quoi que ce soit.

## Pipelines

Le déploiement s'est donc passé sans souci. Drag & Drop de mes fichiers HTML sur le serveur de prod, on ne peut pas dire que ce soit la chose la plus compliquée à faire. Il y a longtemps - TRES LONGTEMPS - que je n'ai déployé un site seulement en déplaçant les fichiers html sur le serveur. 

Mais j'ai finalement deux repositories. Un premier repository, celui avec les fichiers d'eleventy et mes fichiers markdown. Et le second repository, obligatoire, comportant uniquement la version déployée du site (donc les fichiers html) pour que ça fonctionne avec Utterance. 

Pour publier un post, il faut maintenant que je fasse

les fichiers mardown : 

1. écrire mon article en markdown
2. éventuellement préparer l'image qui va illustrer mon article
3. commiter le fichier markdown
4. lancer eleventy pour que le moteur génère la page html

les fichiers html :

1. commiter le fichier html
2. copier le fichier html sur le serveur de prod

J'ai donc mis en place deux pipelines.

Le premier va pousser le fichier markdown sur mon premier repository, le second va pousser sur le second repository et copier les fichiers html sur le serveur de prod.

Et ceci est mon tout premier blog avec Eleventy.

*** EDIT ***
ok... j'ai un peu complexifié les choses avec mes deux dépôts. En fait, l'application Utterance ne fonctionne pas avec cette architecture. Je ne peux pas séparer les pages sources (.md) dans un dépôt et les pages finales (.hml) dans un second dépôt. Utterance ne retrouve pas ses petits... Je vais donc remettre tous les projets dans un seul dépôt - obligatoirement github. 

J'avoue que je procrastine un peu