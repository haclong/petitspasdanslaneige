---
title: "Tests unitaires - Installer PHPUnit"
permalink: "fr/posts/tests-unitaires-installer-phpunit.html"
date: "2016-12-07T17:59"
slug: tests-unitaires-installer-phpunit
layout: post
drupal_uuid: 581327ac-9cc0-4c82-a94a-9bb7b6a60c30
drupal_nid: 165
lang: fr
author: haclong

media:
  path: /img/teaser/2048x1536-fit_illustration-laboratoire-antidopage.jpg



summary: "Complètement superflu mais il fallait quand même en passer par là, quelques notes rapides sur l'installation de la librairie de tests PHPUnit."
---

Nous allons utiliser la librairie de tests PHP la plus utilisée à ce jour : <a href="https://phpunit.de/" target="_blank">**PHPUnit**</a>.

Malheureusement, pour ma part, j'ai **PHPUnit** qui fonctionne sur mon poste de développement depuis longtemps, en fait depuis mes multiples tentatives de TDD. Du coup, je ne saurais plus trop vous orienter sur un step-by-step. Toutefois, vous trouverez la <a href="https://phpunit.de/manual/current/en/installation.html" target="_blank">documentation</a> nécessaire sur le site officiel de **PHPUnit**. De souvenir, il me semble qu'il n'y avait pas de piège à l'installation.

D'un autre côté, si vous installez le package <a href="https://github.com/zendframework/ZendSkeletonApplication" target="_blank">Zend Framework Skeleton Application,</a> il suffira d'installer (avec **Composer**) le package **zend-test**

```sh
composer require --dev zendframework/zend-test
```

Sur un projet Symfony, la librairie **PHPUnit** fait partie intégrante des dépendances du projet. (En principe), elle s'installe au moment où vous allez installer votre projet Symfony.

Pour lancer les premiers tests, un petit coup d'oeil sur la documentation officielle <a href="https://phpunit.de/manual/4.8/en/writing-tests-for-phpunit.html">https://phpunit.de/manual/4.8/en/writing-tests-for-phpunit.html</a> et un nombre non négligeable de posts sur Internet vous y aideront. En règle générale, il suffit de se rendre à la racine de votre projet (tip : au même niveau que votre fichier `phpunit.xml.dist` et de lancer la commande

```phpunit```

Vous pouvez affiner l'exécution de vos tests avec des arguments dans la ligne de commande. Les différentes options sont documentées ici : <a href="https://phpunit.de/manual/current/en/textui.html">https://phpunit.de/manual/current/en/textui.html</a>
`
Le fichier `phpunit.xml.dist est le fichier de paramétrage de **PHPUnit** pour votre projet. S'il y a des paramétrages à faire, c'est dans ce fichier qu'il faut le faire. Voici la documentation : <a href="https://phpunit.de/manual/current/en/appendixes.configuration.html">https://phpunit.de/manual/current/en/appendixes.configuration.html</a>

Comme toutes les autres librairies de tests, **PHPUnit** est conçu avec tout un ensemble d'assertions qui vont nous aider à rédiger nos tests : <a href="https://phpunit.de/manual/current/en/appendixes.assertions.html">https://phpunit.de/manual/current/en/appendixes.assertions.html</a>. Vous pouvez jeter un rapide coup d'oeil sur la liste des assertions. Il y en a vraiment pour tous les goûts mais ce qu'on peut retenir :

Les assertions les plus utilisées seront très probablement : `assertEquals`, `assertFalse`, `assertTrue`, `assertInstanceOf`.

Mais vous pourrez les découvrir au fur et mesure. Par ex, je viens de découvrir qu'il existe `assertCount` que je peux faire en utilisant `assertEquals` au lieu d'`assertCount`.

Il y a des assertions sur les contenus des tableaux et des chaînes de caractères, sur les format XML et Json, sur le système de fichier... Si vous avez besoin de faire des assertions un peu plus complexe, penchez vous tout particulièrement sur l'assertion `assertThat` qui permet de faire des assertions conditionnelles. <a href="https://phpunit.de/manual/current/en/appendixes.assertions.html#appendixes.assertions.assertThat">https://phpunit.de/manual/current/en/appendixes.assertions.html#appendi…</a>. Nous aborderons probablement ce point si j'ai un exemple sous la main mais il est probable qu'on ait également la solution pour le faire autrement.
