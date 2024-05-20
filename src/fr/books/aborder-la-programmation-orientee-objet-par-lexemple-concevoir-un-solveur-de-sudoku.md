---
title: "Aborder la programmation orientée objet par l'exemple. Concevoir un solveur de sudoku."
permalink: "fr/books/aborder-la-programmation-orientee-objet-par-lexemple-concevoir-un-solveur-de-sudoku.html"
date: "2014-03-09T14:50"
slug: aborder-la-programmation-orientee-objet-par-lexemple-concevoir-un-solveur-de-sudoku
layout: book
drupal_uuid: 8884ba0b-d4c3-4101-90a7-a56a74aa45aa
drupal_nid: 53
lang: fr
author: haclong

book: 
  key: aborder-la-programmation-orientee-objet-par-lexemple-concevoir-un-solveur-de-sudoku
  next:
    url: /fr/posts/le-solveur-de-sudoku-preparer-le-projet.html
    title: Le solveur de sudoku - Préparer le projet

media:
  path: /img/teaser/Sudoku_Board_Game.jpg

sites:
  - "Développement"

summary: "Avec le prétexte de développer un solveur de sudoku, nous allons aborder plusieurs aspects de la programmation orientée objet. \n

Durant ce tutorial en plusieurs épisodes, nous allons voir comment \n
- concevoir le modèle objet de notre sudoku en nous attardant sur les options possibles\n
- créer les tests unitaires sur notre modèle"
---

Avec le prétexte de développer un solveur de sudoku, nous allons aborder plusieurs aspects de la programmation orientée objet.

Durant ce tutorial en plusieurs épisodes, nous allons voir comment

- concevoir le modèle objet de notre sudoku en nous attardant sur les options possibles
- créer les tests unitaires sur notre modèle

L'architecture MVC et le traitement du formulaire va être confiée au framework Zend Framework. On va assumer que vous maîtrisez un minimum le mécanisme qui lie le contrôleur à la vue. Ce point sera à peine abordé.

Mon environnement :

- Ubuntu 13.04
- Netbeans 7.0.1
- Xdebug 2.2.1
- PhpUnit 3.7.27
- Apache 2.2.22
- PHP 5.4.9
- Zend Framework 2.2
