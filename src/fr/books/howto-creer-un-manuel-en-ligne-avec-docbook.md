---
title: "HOWTO - Créer un manuel en ligne avec DocBook"
permalink: "fr/books/howto-creer-un-manuel-en-ligne-avec-docbook.html"
date: "2012-07-30T16:54"
slug: howto-creer-un-manuel-en-ligne-avec-docbook
layout: book
drupal_uuid: 1ab1324a-46c4-4138-88d6-7822ea775346
drupal_nid: 16
lang: fr
author: haclong

book: 
  key: howto-creer-un-manuel-en-ligne-avec-docbook
  next:
    url: /fr/posts/howto-creer-une-documentation-en-ligne-avec-docbook-preparations.html
    title: HOWTO - Créer une documentation en ligne avec DocBook  - Préparations

media:
  path: /img/teaser/old-books.jpg

sites:
  - "Développement"

summary: "DocBook est un schéma XML utilisé pour créer toutes sortes de documentation. Son premier objectif était axé sur la documentation technique mais dans la mesure où son format est extrêmement riche avec une panoplie complète de balises sémantiques correspondant à tous types de livres, il peut désormais être utilisé pour écrire d'autres livres tels que les essais ou les romans par exemple."

---

DocBook est un schéma XML utilisé pour créer toutes sortes de documentation. Son premier objectif était axé sur la documentation technique mais dans la mesure où son format est extrêmement riche avec une panoplie complète de balises sémantiques correspondant à tous types de livres, il peut désormais être utilisé pour écrire d'autres livres tels que les essais ou les romans par exemple.

DocBook prétends qu'il est utilisable "out of the box". A l'entendre, il semble vraiment facile à appréhender. Nous sommes heureux de constater qu'il est effectivement facile à prendre en main. Il suffit, très rapidement, de manipuler quelques balises pour mettre en place la structure de votre prochain livre : un **book** (livre) se divise en **chapter**s (chapîtres) et chaque **chapter** (chapitre) est constitué de plusieurs **para**graphes... Si vous prévoyez d'utiliser (et vous le ferez) la libraire (ou package) de feuilles de style DocBook XSL correspondante, vous n'aurez même pas à vous soucier de la numérotation des chapîtres ou de la mise en place d'un sommaire. Toutes ces options vont se générer au moment de la publication. Cependant, dès qu'il s'agit d'aborder des fonctionnalités plus pointues, il vous faudra lire la documentation plus attentivement : cela inclut le <a href="http://www.docbook.org/tdg5/en/html/docbook.html" target="_blank">Guide Définitive de DocBook (DocBook Definitive Guide)</a>, le <a href="http://www.sagehill.net/docbookxsl/index.html" target="_blank">Guide Complet des feuilles de styles DocBook XSL (DocBook XSL Stylesheets Complete Guide)</a> et le <a href="http://docbook.sourceforge.net/release/xsl/current/doc/" target="_blank">Manuel de Références des feuilles de styles DocBook XSL (DocBook XSL Stylesheets Reference Documentation)</a>.

L'objectif de ce tutoriel sera de créer un manuel en ligne pour une API. Nous incluerons quelques options sympathiques pour personnaliser le rendu de notre livre.
