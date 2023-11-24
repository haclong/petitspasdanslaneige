---
title: "Gérer les dépendances"
permalink: "fr/posts/gerer-les-dependances.html"
date: "2014-12-04T20:46"
slug: gerer-les-dependances
layout: post
drupal_uuid: 99a0513a-993c-4916-88e7-2e8792d78cb4
drupal_nid: 102
lang: fr
author: haclong

book:
  book: gerer-les-dependances-avec-zend-framework-2
  rank: 3,
  top: 
    url: /fr/books/gerer-les-dependances-avec-zend-framework-2.html
    title: Gérer les dépendances avec Zend Framework 2
  previous:
    url: /fr/posts/gerer-les-dependances-utiliser-linjection-dans-le-controleur.html
    title: Gérer les dépendances - Utiliser l'injection dans le controleur

media:
  path: /img/teaser/jeu_de_contruction.jpg

tags:
  - "dépendances"
  - "dependency injection"
  - "code"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Pour ce que j'ai compris et même si je doute d'avoir les capacités pour vous convaincre, je réalise que les modèles/entités/classes ne devraient pas développer de dépendance les unes aux autres. Moins elles sont dépendantes, mieux est le code."
---

Pour ce que j'ai compris et même si je doute d'avoir les capacités pour vous convaincre, je réalise que les modèles/entités/classes ne devraient pas développer de dépendance les unes aux autres. Moins elles sont dépendantes, mieux est le code.

Grosso modo, on peut également résumer cela par :

**Interdiction formelle d'utiliser le mot clé `new` dans n'importe laquelle de vos classes.**

Une autre façon de vérifier si votre classe est dépendante (voire fortement dépendante) : vérifier le mot clé `use` : si votre classe use beaucoup (trop) d'objets différents, et pire, d'objets de différents modules/différentes librairies/différents concepts, alors on peut commencer à se dire que quelquechose est pourri dans votre code...

Mais alors, COMMENT utiliser les autres classes si on net peut pas créer de nouveaux objets ?

On instancie les objets d'abord, et ensuite, on les INJECTE dans nos classes.

### Injecter les dépedances ?

Il y a plusieurs stratégies :

Vous pouvez utiliser le **constructeur** : créer un constructeur avec autant d'arguments qu'il y a de dépendances et pour chaque argument, l'assigner à une propriété de la classe. De l'extérieur de la classe, vous créer tous les objets dont vous avez besoin et vous les passez à la classe par le constructeur. Avec cette stratégie, vous contrôlez que les dépendances obligatoires sont bien présentes et assignées.

Vous pouvez utiliser les **manipulateurs** (**setter methods**), comme pour n'importe quel autre propriété. Avec cette stratégie en revanche, vous ne pouvez vous assurez de la présence obligatoire d'une dépendance. Il faudra songer à gérer les cas par défaut s'il manque une dépendance.

Vous pouvez utiliser les **interfaces**, mais comme je n'ai pas bien compris comment cela fonctionnait, je n'en parlerais pas ici.

A l'intérieur de la classe, la dépendance sera une propriété comme une autre et nous la manipulerons et la retournerons (si besoin) et pratiquement, nous n'accorderons que peu d'intérêt à savoir si la dépendance est une instance d'une classe A ou d'une classe B. Tout ce que notre classe aura besoin de savoir sera juste COMMENT utiliser la dépendance.

Pour assurer le bon fonctionnement du code toutefois, nous n'oublierons pas d'implémenter les interfaces afin de nous assurer que la classe A et la classe B ont les mêmes méthodes...

Je dois toutefois noter des exceptions :

Une classe **Factory** DOIT utiliser le mot clé `new`. Parce que ce sont des factories. Elles sont faites pour retourner un nouvel objet...

Pour ma part, je n'injecte pas `ArrayObject` non plus. Je considère que c'est plus un type plutôt qu'une dépendance... Mais c'est un point de vue personnel et je suis toujours en train de me demander si c'est une bonne ou une mauvaise idée.

### Instancier les objects

Oui oui, je sais... J'ai dit : *On instancie les objets d'abord, et ensuite, on les INJECTE dans nos classes*. J'ai rapidement expliqué comment on faisait pour injecter les dépendances mais maintenant, il reste la partie instanciation d'objets... MAIS OU instancier les objets, puisque aucune classe n'est autorisée à utiliser le mot clé `new`…

Nous allons utiliser un objet à un niveau supérieur. Dans cette objet, nous instancierons TOUS nos objets : les dépendances ainsi que tous les autres objets et nous gèrerons les injections à ce moment là.

Zend Framework 2 a ce type de composant très utile : le **Service Manager**. Il est certain que les autres frameworks ont des composants similaires mais comme je n'ai pas encore travaillé avec, je ne sais pas comment le Service Manager s'appelle chez Symfony ou chez Laravel... Il faudra juste l'identifier et voir comment l'utiliser.

Le **Service Manager** est comme un index où on déclare chacune de nos classes. Il est le seul composant de notre module où on pourra utiliser le mot clé `new` et c'est le seul endroit où on instanciera chaque objet une fois. C'est là et nul part ailleurs.

### Utiliser les objects

Tous les objets de notre modèle (entités, mappers, factories, formulaires) ont été instanciés à l'intérieur du **Service Manager** ainsi que leurs dépendances. Ainsi, techniquement, on n'aura plus à accéder au **Service Manager** de l'intérieur des objets de notre modèle.

Dans le cas particuler des tableaux d'objets, l'ancienne façon de faire est de faire une boucle `foreach` et d'instancier un `new` objet à chaque itération. Mais voilà que notre objet a été injecté, une seule fois. Il faudra alors utiliser le mot clé `clone`. Faire la boucle `foreach` et `clone` l'objet qui a été injecté plutôt que de l'instancier de nulle part et ruiner nos beaux efforts pour conserver un code indépendant et propret...

Reste les **Views** : Les objets qui sont utilisés par un template de view devrait être transmis via le **Controller**. Il restera les **plugins**… Je traiterais ce point quand j'aurais travaillé un peu plus intensivement avec eux.

Puis les **Controllers** : Les Contrôleurs dans Zend Framework implémentent l'interface **ServiceLocatorAware** qui permet au contrôleur d'accéder au **Service Manager**.

Quand j'ai commencé à travailler avec ZF2, je cherchais partout comment accéder au **Service Manager**. Mais en réalité, vous n'avez pas besoin de savoir ça. Vous ne devriez pas avoir besoin d'accéder à cette information.

Je trouve des bénéfices à instancier tous mes objets dans le **Service Manager** : s'il me vient l'envie (ou le besoin) de faire un refactoring de mon code, réarranger l(es) espace(s) de nom ou couper un module en deux modules différents, c'est super simple. Il suffit juste de modifier les liens dans le **Service Manager** et le reste du code reste intouché. Cela me surprend toujours que le module fonctionne toujours alors que j'ai massivement déplacé tous mes éléments sans égards...

Je sais que les développeurs débutants vont opter pour un développement from scratch, à partir de rien (par Développeur débutant, je pense surtout à ceux qui vont apprendre sur le tas, difficilement, avec les tutoriaux trouvés sur le web). Parce qu'ils auront le sentiment de maîtriser ce qu'ils font (il n'y a rien de pire que de faire un bout de code et d'avoir une erreur qui référence la ligne 438 d'une classe d'une librairie que vous ne connaissez pas...) et qu'ils penseront qu'ils restent ainsi indépendants de librairies exterieures. Indépendant des librairies extérieure = peu de contraintes de dépendance. Ils se trompent. Les contraintes de dépendances ne concernent pas uniquement les liens entre vos classes et les classes d'autres librairies, mais elles concernent SURTOUT les liens qui attachent une de vos classes à une autre de vos classes...

La gestion des dépendances est une réflexion saine qui permet de rendre votre site plus modulaire, plus souple, et plus facile à faire évoluer.
