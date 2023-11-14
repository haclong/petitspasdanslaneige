---
title: "Les tests unitaires, un grand ouf de soulagement"
permalink: "fr/books/les-tests-unitaires-un-grand-ouf-de-soulagement.html"
date: "2016-12-12T15:37"
slug: les-tests-unitaires-un-grand-ouf-de-soulagement
layout: post
drupal_uuid: 1f610593-5abd-47f6-be3f-0e642f158cd4
drupal_nid: 168
lang: fr
author: haclong
draft: true

media:
  path: /img/teaser/2048x1536-fit_illustration-laboratoire-antidopage.jpg

sites:
  - "Développement"
  - "Haclong projects"

---

J'ai déjà parlé des tests unitaires. J'ai testé. J'en ai fait quelques uns. Sans grande conviction. Persuadée cependant que c'est LE truc à faire. Quand même. Si seulement j'avais le temps, bien sûr, je m'y consacrerais sérieusement.

J'ai fait, puis j'ai pas fait.

Et j'ai refait.

Personnellement, je finis par opter pour les tests parce que, comme j'ai un rythme sinusoidal, quand je reviens sur un de mes codes, je ne sais plus ce qui fonctionne et ce qui ne fonctionne pas encore et je suis obligée de me refarcir tous les tests, y compris rentrer dans les fichiers et remettre des `var_dump()` dans tous les coins... Faites ça plusieurs fois de suite, ajoutez y les doutes de la mémoire défaillante et vous finirez peut être comme moi à vous dire : bon, on va écrire tout ça au propre... au moins, je saurais où j'en suis.

Le plus difficile au début, c'est de savoir quoi tester. Quand on n'est pas habitué, on a vite fait de confondre, de vouloir tester de trop. Pourtant, les recommandations sont claires : le test unitaire doit être précis. Son objectif est de tester notre application de manière atomique, fonction par fonction, ligne par ligne. Ainsi, lorsqu'il échoue, il ne peut y avoir qu'une et une seule raison pour laquelle il a échoué. (Plus vite dit que fait !)

On peut être tenté d'écrire des tests dans tous les sens, histoire d'être sûr. Or, trop de tests seraient contre productifs parce qu'ils seraient redondants (plusieurs tests testent la même chose. Or, lorsqu'on a démontré une fois que ça fonctionnait, inutile de le démontrer une seconde fois) et obligeraient le développeur à maintenir trop de tests lorsque le code est modifié (impact de la modification dans plusieurs tests).

Je ne vais pas essayer de vous convaincre de faire des tests unitaires. Je ne vais pas vous expliquer en quoi c'est utile et important et moderne de le faire. Non. Parce que j'ai eu moi même beaucoup de mal à les écrire moi même, à les développer, à les réussir, je vais plutôt vous dire comment j'ai fait.

Ce ne doit pas toujours être la meilleure façon. Il y a sûrement mieux. Mais au moins, ça marche. Et ça aide pour les débutants.

Tenez vous prêts. Une série est en préparation. Cela va concerner les tests unitaires. Uniquement les tests unitaires. Pour commencer, sur **PHPUnit** mais il n'est pas exclu que je me trouve un autre projet pour faire mes tests avec **Codeception**.
