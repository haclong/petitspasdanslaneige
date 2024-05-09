---
title: Eleventy, la suite
permalink: fr/posts/eleventy-la-suite.html
date: 2024-05-08T11:09
slug: eleventy-la-suite
layout: post
lang: fr
author: haclong

tags:
  - jamstack
  - eleventy
  - blog

sites:
  - Développement
  - Haclong projects

summary: Précédemment, je vous ai annoncé que j'ai mis en production mon nouveau blog. Voici les premières conclusions
---
## Précédemment, dans Petits Pas dans la Neige
Je vous la fais rapidos.

Petits Pas dans la Neige était précedemment construit sur  <a href="https://www.drupal.org" target="_blank">Drupal</a>. 

Un CMS bien connu, efficace et performant avec une grosse communauté qui anime et enrichit l'application.

Mais Drupal était trop lourd, trop gros, trop complexe. La base de données, les nombreux modules nécessaires, les mises à jour à effectuer. Je me suis demandée si ce n'était pas un peu trop pour un blog.

Il fallait changer.

J'ai choisi <a href="https://www.11ty.dev/" target="_blank">Eleventy</a>, une application <a href="https://jamstack.org/" target="_blank">Jamstack</a> avec la promesse d'une solution plus légère, plus basique et qui correspond mieux pour un simple blog.

### Le déploiement en prod
Pour l'idée générale de la migration de Drupal vers Eleventy, voir <a href="/fr/posts/me-revoila-sur-les-rails.html" target="_blank">mon post précédent</a>

En tout cas, Jamstack oblige, le déploiement est assez simple : transfert des fichiers html via un client SFTP et voilà.

Et dis comme ça, ça semble _TELLEMENT_ plus simple... et pourtant.

## Les améliorations à apporter
### Le mic mac des repositories
Bon, dans mon post précédent, j'expliquais comment j'avais très soigneusement créé deux dépôts de source distincts :

- Un premier dépôt (privé) pour gérer les fichiers de Eleventy (les templates, les fichiers de configuration, les quelques scripts et évidemment, les fichiers Markdown d'origine.)
- Un second dépôt github public pour gérer les fichiers HTML et les fichiers images et javascript et css.

Ca peut fonctionner, mais l'une des contraintes, c'était l'utilisation de l'application Utterance sur github. Il était donc important d'héberger le dépôt sur github. Mais je n'avais pas compris qu'il fallait aussi héberger les fichiers d'Eleventy et les fichiers Markdown. En fait, je n'ai aucune idée comment fonctionne Utterance mais clairement, le dépôt avec les pages HTML seulement ne suffit pas.

Pour corriger ça, il va falloir
- que je rapatrie tous les fichiers (Eleventy + HTML) sur un même dépôt (Github)
- afin d'héberger les fichiers HTML dans le répertoire public de mon hébergeur, il faut que je change la structure des fichiers du projet...

Ca veut dire
- supprimer les deux dépôts existant
- supprimer les remote sur ma version locale
- changer le fichier d'export de Eleventy (ne plus générer les fichiers HTML sur le répertoire _site mais plutôt sur un répertoire htdocs correspondant à la structure de l'hébergeur).
- créer un dépôt (re) sur github auquel il faut attacher l'application Utterance
- ajouter un remote sur la version locale avec le nouveau dépôt

### Un éditeur dédié
Pour effectuer la migration de Drupal vers Eleventy, j'ai utilisé mon IDE favori (<a href="https://code.visualstudio.com/" target="_blank">VS Code</a>). Pour générer les fichiers statiques, il y a un container Docker avec NodeJS pour faire tourner le moteur de Eleventy.

Suite à ça, je ne me suis pas posée la question pour la rédaction + la publication des futurs articles. 

Le choix pour une solution Jamstack a été motivée notamment par la possibilité de rédiger les articles en markdown depuis n'importe quel éditeur (en opposition à la rédaction des articles sur Drupal, où il est obligatoire d'utiliser l'interface administrateur de Drupal)

Mais une fois ce fait établi, il faut prendre certains points en considération :

- de préférence, ne pas utiliser VS Code parce que l'IDE peut être en cours d'utilisation avec un autre projet et il est fastidieux de refermer tous les fichiers du projet en cours pour écrire un nouvel article de blog. Il faut donc trouver un éditeur dédié (en tout cas, sur mon ordinateur principal) - je tente <a href="https://obsidian.md/" target="_blank">Obsidian</a>.
- s'assurer que les fichiers statiques vont être générés : 
	- soit il faut que le container Docker fonctionne en permanence, 
	- soit il faut finalement installer un serveur NodeJS qui tournerait en tâche de fond sur l'ordinateur
	- soit il faut installer un pipeline avec <a href="https://www.gocd.org/" target="_blank">GoCD</a> qui lancerait (lui) le container Docker uniquement quand les fichiers sont modifiés et mis à jour. (_je vais tenter cette option_)

## De Drupal à Eleventy
Pour conclure, je voulais
- alléger le blog : ok
- supprimer la contrainte de la base de données : ok
- faciliter la rédaction des articles en utilisant plusieurs éditeurs : ok

Les changements que je n'avais pas prévu
- avec Drupal, la publication des articles était pris en charge. Il suffisait de rédiger un article sur l'éditeur de Drupal et la publication (et les conditions de publication) était intégralement gérée par Drupal. Avec Eleventy, il faut, pour chacun des éditeurs que j'aurais choisi (et depuis chacun des appareils), mettre en place une stratégie pour rédiger un article, commiter le fichier markdown, générer le fichier html avec le moteur de Eleventy.
- avec son moteur, Drupal pouvait redimensionner et retailler une image à la dimension des bandeaux d'illustration de mes posts. Avec Eleventy, il faut que je redimensionne les images manuellement, ce qui permet d'ajuster le cadrage.

All in all, toutefois, je pense qu'il faut poursuivre. La mise en place est un peu plus contraignante - mais je pense honnêtement que ça me prend le même temps que ce qui m'a pris pour l'exploration et la mise en place des modules de Drupal à l'époque. Je vous tiens au courant

