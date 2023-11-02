---
title: "Le solveur de sudoku - Concevoir les objets"
permalink: "fr/posts/le-solveur-de-sudoku-concevoir-les-objets.html"
date: "2014-03-16T18:23"
slug: le-solveur-de-sudoku-concevoir-les-objets
layout: post
drupal_uuid: 08ce834e-a280-4244-b762-fb8967d5c727
drupal_nid: 55
lang: fr
author: haclong

media:
  path: /img/teaser/Sudoku_Board_Game.jpg

tags:
  - "POO"

sites:
  - "Développement"

summary: "Le projet est créé dans Netbeans. L'environnement de tests unitaires est installé également. Prenons le temps de réfléchir sur ce que va faire notre application - Travaillons sur la conception de nos objets.
"
---

### Programmation orientée objet

Le projet est créé dans Netbeans. L'environnement de tests unitaires est installé également. Prenons le temps de réfléchir sur ce que va faire notre application - Travaillons sur la conception de nos objets.

De mon point de vue, lorsqu'on en vient à concevoir nos objets, on peut - dans les grandes lignes - distinguer deux types d'objets : les objets "**statiques**" et les objets "**utilitaires**"... Le plus simple est de commencer à créer notre modèle en commençant par modéliser les objets statiques.

Les objets *statiques* sont principalement définis par leurs propriétés. Les objets statiques sont plus faciles à "imaginer" parce qu'on peut plus facilement dire d'eux : ils ont telle propriété, telle autre... Et la plupart du temps, ils correspondent _VRAIMENT_ à des objets "réels". Ces objets ont des méthodes qui vont servir soit à initialiser les propriétés de l'objet, soit à retourner la valeur de ces propriétés.

Les objets *utilitaires* quant à eux, utilisent les objets statiques et, à terme, les combinent pour obtenir les résultats qu'on cherche à obtenir.

### La grille de sudoku

Une grille de sudoku classique est composée d'un nombre de cases fini (9x9), chaque case est strictement définie par sa position et chaque case a un chiffre définitif.

Si on pousse le raisonnement un peu plus loin, et si vous avez déjà essayé de résoudre des grilles de sudoku un peu hardues, vous avez sûrement fini par inscrire dans chacune des cases toutest les options possibles et éliminer chaque option les unes après les autres jusqu'à ce que vous arriviez à identifier le bon chiffre. En extrapolant, on peut même dire que pour les grilles très simples, on effectue le même raisonnement mais en observant les autres chiffres déjà placés dans la grille, l'élimination des options se fait quasiment instantanément. On peut donc considérer que pour chaque chiffre, il y a 9 options possibles.

Si on essaie d'adapter ces caractéristiques à la programmation, on devra ajouter les informations suivantes :

Les règles du sudoku précisent qu'un chiffre ne peut pas apparaître deux fois sur une même ligne, sur une même colonne ou dans une même région. Afin d'identifier si un chiffre n'apparaît pas deux fois sur une même ligne, sur une même colonne ou dans une même région, il est donc nécessaire de savoir dans quelle ligne, dans quelle région et dans quelle colonne se situe la case.

Pour chacune des options pour un chiffre, il faut pouvoir représenter le raisonnement que l'on applique en définissant si l'option est une possibilité, ou si l'option est éliminée ou si enfin l'option est devenue un chiffre validé.

En terme de programmation, on peut d'ores et déjà considérer qu'on va manipuler au moins 3 objets "statiques" :

**le chiffre**

Propriétés du chiffre :

- le chiffre a une collection de possibilités (de numéros possibles)
- chaque possibilité a un statut

**la case**

Propriétés de la case :

- la case a un numéro de ligne
- la case a un numéro de colonne
- la case a un numéro de région
- la case a un chiffre

**la grille**

Propriétés de la grille :

- la grille a une collection de cases

Une fois que vous entrevoyez votre modèle, essayez d'anticiper sur ce que vous pourrez faire avec :

- le chiffre peut parcourir toutes ses possibilités et pour chaque possibilité, on peut connaître son statut
- en fonction des statuts de chacune des possibilités, on pourra également savoir si un chiffre a été confirmé ou pas
- on peut identifier une case grâce à ses coordonnées ligne / colonne
- la grille peut parcourir son tableau de cases
- la grille peut vérifier si les règles du sudoku ont été respectées
- toutes les cases d'une même ligne portent le même numéro de ligne : il sera alors possible de comparer tous les chiffres d'une même ligne pour contrôler les règles de sudoku. Le même raisonnement s'applique pour la colonne et la région.
- en fonction des chiffres trouvés ou pas, on pourra savoir si la grille a été ou résolue ou non

J'ai hésité entre le modèle présenté plus haut, et d'autres modèles assez semblables :

- un chiffre
- le chiffre est un des numéros possibles
- le chiffre a un statut

- une case
- la case a un numéro de ligne
- la case a un numéro de colonne
- la case a un numéro de région
- la case a un tableau de chiffres

- une grille
- un tableau de cases

Ou encore

- un chiffre
- le chiffre a un numéro de ligne
- le chiffre a un numéro de colonne
- le chiffre a un numéro de région
- le chiffre a un tableau de numéros possibles avec un statut par numéro

- une grille
- un tableau de chiffres

Globalement, ce sont les mêmes propriétés, répartis différemment dans des objets différents.

### Stratégies pour résoudre une grille de sudoku

Si vous êtes joueur de sudoku, vous avez vos propres méthodes pour résoudre une grille. Pour ma part, je distingue les stratégies suivantes :

**Stratégie 1 :**

En fonction des numéros qui sont déjà placés sur la grille, les possibilités s'éliminent et s'il ne reste qu'une seule option possible par chiffre, alors l'option est validée

**Stratégie 2 :**

En fonction des numéros qui sont déjà placés sur la grille, s'il ne reste qu'une seule option possible sur une même ligne, une même colonne ou une même région, alors l'option est validée

**Stratégie 3 :**

On peut exprimer une hypothèse pour une case. Une hypothèse consiste à valider une option pour une case. Si l'hypothèse génère une grille qui ne respecte pas les règles du sudoku, alors l'option à l'origine de l'hypothèse est éliminée. A contrario, une hypothèse qui ne génère aucune violation des règles du sudoku ne veut pas nécessairement dire que l'option à l'origine de l'hypothèse est validée. Dans ce cas là, il n'est pas possible de déduire si l'hypothèse est bonne ou pas. La meilleure option restera d'ignorer cette hypothèse et d'en formuler une autre.

Les stratégies de résolution peuvent être développées comme méthodes dans l'objet Grille, ou bien on peut créer un objet de type utilitaire, l'objet Solver, qui ne comporterait que les méthodes utiles à la résolution d'une grille de sudoku.

Il ne restera plus qu'à appliquer ces méthodes au programme.

Allez ! Trève de bavardages, passons aux choses sérieuses.
