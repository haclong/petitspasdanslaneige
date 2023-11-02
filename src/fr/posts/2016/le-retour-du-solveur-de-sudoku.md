---
title: "Le retour du solveur de sudoku"
permalink: "fr/posts/le-retour-du-solveur-de-sudoku.html"
date: "2016-12-07T09:20"
slug: le-retour-du-solveur-de-sudoku
layout: post
drupal_uuid: 65ec3ef3-340a-4940-ad82-a0ffa957d549
drupal_nid: 162
lang: fr
author: haclong

media:
  path: /img/teaser/Sudoku_Board_Game.jpg

tags:
  - "symfony"
  - "TDD"
  - "CQRS"
  - "ES"
  - "programmation événementielle"

sites:
  - "Haclong projects"

summary: "Il y a quelques temps, j'ai développé un solveur de sudoku. C'était un premier jet qui comporte quelques erreurs de misconceptions. Comme ça m'empêchait de dormir en rond, j'ai finalement décidé de le refaire. Mais l'affaire ne s'arrête pas là..."
---

Dans la première version de mon solveur de sudoku, l'algorithme de résolution de la grille de sudoku était beaucoup trop massif, mal optimisé. Avec le recul, lorsque je le relis, je m'aperçois que les objets sont très très mal conçus, que les responsabilités, quoique clairement définies au début finissent avec des frontières floues. Mais il y avait de l'idée. Peut mieux faire.

L'algorithme d'alors était systématique, sans grande intelligence. Il faisait plus vite ce que je faisais moi même devant une grille de sudoku. Il itérait sur chacune des lignes, chacune des colonnes, chacune des régions pour essayer de voir si on avait éliminé suffisamment de chiffres possibles dans chaque case pour déduire le chiffre définitif de la case. Le solveur lisait toutes les cases sans distinction, et revérifiait systématiquement chaque case, en dépit des chances de trouver le bon chiffre vu le trop grand nombre de chiffres possibles dans la case, ou dans le cas contraire, quand le chiffre avait déjà été trouvé. C'était redondant, sans saveur et manquait cruellement d'élégance.

Avec les bidouillages sur l'application Coffee Bar, j'avais été introduite au pattern CQRS. Cela me semblait pas mal convenir pour optimiser l'algorithme de résolution d'une grille de sudoku.

J'ai décidé de refaire mon solveur en basant l'algorithme sur un développement événementiel. Mettre un chiffre dans une case déclenche un événement. Les autres cases écoutent cet événement. Les cases se mettent à jour instantanément au fur et à mesure de l'avancée de la grille.

Mais voilà.

Développer une application avec une architecture basée sur les événements n'est pas une sinécure pour un développeur habitué à faire du séquentiel. Je m'aperçois qu'on ne peut plus penser en terme d'instructions successivement ordonnées.

En séquentiel, avant de vous lancer dans un développement, vous avez dressé la liste des éléments à développer. C'est une liste séquentielle de tâches à accomplir pour atteindre l'object de la fonctionnalité que vous êtes en train de coder. Il y a une liste par fonctionnalité. Ainsi, quand vous avez fini de développer une fonctionnalité, toutes les tâches de votre TODO List sont résolues et on n'en parle plus.

En événementiel, avant de vous lancer dans un développement, vous avez également dressé la liste des éléments à développer. Mais cette fois ci, au lieu d'une liste de tâches ordonnées, vous avez plusieurs listes d'action et de réaction. Selon votre préférence, soit une liste par événement identifié dans l'application, soit une liste par objet. Par événement, identifier ce que chaque objet de votre application doit faire en réaction à cet événement. Par objet, identifier le comportement de votre objet pour chacun des événements de l'application.

Même si cela semble dire la même chose, je me suis aperçue que je ne me le représentais pas du tout de la même façon dans mon esprit. Du coup, choisir de travailler soit en séquentiel, soit en événementiel requiert beaucoup plus d'investissement que je ne l'aurais soupçonné. Et je ne parle pas d'adhésion à la méthode. Je parle de logique et d'architecture. Et de méthode.

Evidemment, pour ceux qui sont rompu à l'exercice, ils auront peut être oublié comment étaient leurs débuts. Cependant, la démarche cognitive est très intéressante et stimulante, j'ai adoré même si je me suis fait des noeuds au cerveau plus d'une fois et que j'ai du faire des schéma récapitulatifs pour bien vérifier que j'avais bien branché tous mes objets aux bons événements. J'ai passé mon temps à me demander qui devait faire quoi et à quel moment. Finalement, avec une gestion événementielle, on se demande surtout "A quel moment" alors qu'en séquentiel, on se demande "Dans quel ordre"... C'est un honteux raccourci mais c'est mon impression générale.

Finalement, d'événements en événements, petit à petit, mon solveur prend forme.

J'ai ajouté une couche AJAX pour que la grille se remplisse au fur et à mesure. Dans la première version, il y avait une première requête, le solveur résolvait la grille et retournait le grille résolue en réponse. Désormais, la grille se remplie sous nos yeux ébahis.

J'ai également ajouté le niveau "tests unitaires" qui s'est révélé un exercice tout aussi fun et grâce à eux, j'ai pu refactorer mon code plusieurs fois durant les étapes de développement, au fur et à mesure de mes tâtonnements.

Toutefois, pendant le développement, je me suis aperçue de défauts dans la conception :

- A chaque fois qu'un événement était modifié, l'ensemble de mes écouteurs étaient lourdement impactés. La modification d'un événement ne devrait pas avoir autant d'impact sur une application aussi simple qu'un solveur de sudoku.
- Dans le but d'éviter des dépendances croisées, certaines informations étaient dupliquées d'un objet à l'autre.
- Mais au final, il a quand même fallu faire intervenir tous les objets SYSTEMATIQUEMENT à chaque action.

Et en même temps, je me suis intéressée à de la documentation sur l'Event Sourcing et le CQRS. En fait, CQRS/ES de son petit nom. Et là, PATATRAS !!! V'la que je découvre que, même si je pars sur une bonne intention, j'ai finalement bricolé une architecture bâtarde plus tellement OOP, pas tout à fait DDD pour mon solveur de sudoku qui rend l'application BEAUCOUP TROP complexe avec des répétitions et des objets sans cohérence. A la lecture des différentes documentations sur CQRS/ES, je m'aperçois qu'il me manquait des concepts de base qui m'auraient permis de faire un travail efficace :

**Le Bounded Context**

Mon incapacité à modéliser convenablement un bounded context a réparti les responsabilités sur plusieurs objets nommés aggregate mais qui finalement n'en sont pas, ce qui a généré des dépendances croisées entre les objets qui compensent du coup avec des infos dupliquées.

**Les commandes vs les événements**

Je n'ai pas fait de distinction entre commandes et événements ce qui porte préjudice à la structure du code et à l'architecture logicielle.

Globalement, en CQRS, les commandes valident l'action et l'exécutent (on vérifie qu'on peut mettre le chiffre dans la case et on le met) alors que les événements ne servent qu'à enregistrer le statut. Dans le cas particulier du solveur de sudoku, cela signifie que je dois stocker l'état de la grille à chaque événement.

Reste à déterminer ce que signifie l'état de la grille.

J'ai d'abord pensé (à tort) stocker uniquement l'ordre des chiffres à mettre dans chaque grille -> FAUX : cela signifierait que je serais en train de stocker les commandes et non pas les événements.

Ou encore stocker uniquement l'état de la grille résolue -> FAUX : il faut également que je stocke les données annexes tel que le tableau de tous les chiffres possibles qui n'ont pas encore été écartés de ma grille de sudoku. Si je ne stocke pas ce tableau, je serais obligée de le recalculer à chaque fois. Or, si je ne stocke pas les commandes, je ne pourrais pas recalculer ledit tableau.

Finalement, l'absence de normalisation des messages et des formats de données a complexifié inutilement une application déjà confuse.

Ah je vous jure, je n'étais pas fière. Tellement que j'ai eu du mal à finir le solveur. L'idée de finaliser un produit ni fait ni à faire porte un coup au moral et alors que j'apportais les dernières touches à l'application, je suis déjà en train de planifier la 3me version en tentative d'application des concepts DDD / CQRS / ES.

Enfin, si vous voulez voir le résultat de cette débâcle, c'est sur mon <a href="https://github.com/haclong/sudokusolver2" target="_blank">**github**</a>.
