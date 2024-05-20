---
title: "Introduction à la résolution du cube"
permalink: "fr/posts/introduction-la-resolution-du-cube.html"
date: "2014-10-31T10:10"
slug: introduction-la-resolution-du-cube
layout: post
drupal_uuid: 8bf9debc-c998-459e-9e44-73129b41d3ab
drupal_nid: 96
lang: fr
author: haclong

media:
  path: /img/teaser/rubiks-cube-5.jpg

tags:
  - "rubik's cube"

sites:
  - "Haclong projects"

summary: "Lorsque je résous le cube, il y a toujours quelqu’un qui fait son intéressant et qui explique que résoudre le cube, c’est pas difficile, il suffit d’aller sur YouTube et il y a pléthore de vidéos qui vont vous expliquer comment faire… Mais tout à fait. Comme j’ai dit, c’est comme faire un produit en croix, calculer le volume d’une sphère ou le barycentre d’un triangle. Si vous savez le faire, vous savez le faire… On ne vous demande pas non plus d’être Pythagore ou Euclide… Je ne sais pas ce qu’attendent les gens de quelqu’un qui s’amuse avec un cube. "
---

Lorsque je résous le cube, il y a toujours quelqu’un qui fait son intéressant (il serait judicieux de voir si ce sont des personnes qui ne supportent pas que l’attention du groupe est détournée d’eux) et qui explique que résoudre le cube, c’est pas difficile, il suffit d’aller sur YouTube et il y a pléthore de vidéos qui vont vous expliquer comment faire… Mais tout à fait. Comme j’ai dit, c’est comme faire un produit en croix, calculer le volume d’une sphère ou le barycentre d’un triangle. Si vous savez le faire, vous savez le faire… On ne vous demande pas non plus d’être Pythagore ou Euclide… Je ne sais pas ce qu’attendent les gens de quelqu’un qui s’amuse avec un cube.

Pour résoudre un cube, il faut être familier avec deux notions importantes liées au cube : l’**orientation** et la **permutation**. Mais commençons par le début.

### Les pièces sont uniques

Le cube est composé de 26 petites pièces (des petits cubes en fait). Chacune de ces pièces est unique. Il est important de comprendre que même si, lorsque vous regardez la face blanche, vous avez l’impression de voir 9 petits carrés blancs, vous avez en fait 9 petites pièces TOUTES DIFFERENTES. Vous avez les 4 coins, différents les uns des autres : vous avez une pièce blanc-bleu-rouge, blanc-orange-bleu, blanc-vert-orange et enfin blanc-rouge-vert. Vous avez ensuite 4 milieux, ici aussi, tous différents : une pièce blanc-vert, blanc-rouge, blanc-bleu et blanc-orange. Vous aurez beau mélanger et tourner votre cube dans tous les sens, la pièce blanc-bleu-rouge restera toujours blanc-bleu-rouge. Tournez encore un peu le cube si vous n’êtes pas convaincu.

### Les faces sont figées

De même, vous aurez beau tourner le cube dans tous les sens, l’ordre des faces est immuable. La face jaune fait toujours face à la face blanche. Entre la face jaune et la face blanche, il y a les faces rouge, bleue, orange et verte dans cet ordre (soit par la droite, soit par la gauche en fonction de la couleur de la face du dessus (jaune ou blanc)) - il existe une seconde version du cube avec les 6 faces placées différemment, mais la règle s’applique aussi à cet autre cube.

Pour vous en convaincre, mélangez votre cube mais ne regardez que les pièces centrales. Mélangez encore. Les centres n’ont pas bougés (les uns par rapport aux autres).

### Placement et permutation

Nous avons vu que chaque face est composée de 9 pièces uniques. Prenons encore notre coin blanc-bleu-rouge. Pour résoudre le cube, il faudra que cette pièce blanc-bleu-rouge se trouve placée au coin des faces blanche, bleue et rouge. Comme elle concerne ces trois couleurs, il est normal qu’elle se place à l’intersection de ces trois faces. Déplacer les pièces afin qu’elles se positionnent correctement à leur place, c’est la permutation.

Cette notion est** TRES IMPORTANTE** : il faut savoir identifier quand une pièce est bien placée, même si elle n’est pas bien orientée. L’impression qu’on a, c’est que la pièce n’est pas bien placée parce que les couleurs ne correspondent pas parce qu’inconsciemment, on cherche à bien placer la pièce ET à bien l’orienter en même temps. Habituez vous à reconnaître quand une pièce est à sa place par rapport aux centres des faces autour.

### Orientation

En plus d’être bien placée, une pièce doit être bien orientée. Il est important de comprendre ce point : vous pouvez bien positionner votre pièce blanc-bleu-rouge mais il est possible qu’elle ne soit pas bien orientée. Ainsi, alors que la pièce est bien placée, la pastille blanche pourra être orientée vers la face rouge, la pastille bleue orientée vers la place blanche et la pastille rouge sur la face bleue. On dit alors que le coin est bien placé mais mal orienté. Tourner le coin pour que les pastilles correspondent enfin à leurs faces respectives, c’est l’orientation.

Un exercice normalement simple à la portée de tous : résolvez une face du cube. Juste une face. Choisissez une couleur et faite la face. La face est résolue parce que les 9 pastilles affichent toute la même couleur. On dit que les pièces (qui composent la face) sont bien orientées. Toutefois, si vous penchez votre cube et que vous commencez à regarder les faces latérales, les couleurs sont toutes mélangées et ne correspondent pas aux centres des faces latérales parce que les pièces ne sont pas bien placées. On dit alors, pour chacune des pièces, qu’elle est bien orientée et bien placée (quand l’autre couleur correspond aux centres des autres faces) ou mal placée (quand l’autre couleur ne correspond pas aux centres des autres faces).

**Résoudre le cube sera de bien placer toutes les pièces et bien les orienter.**

Certaines formules (ou algorithmes) vous feront placer vos pièces, fi de l’orientation. Certaines formules vous feront orienter les pièces, fi du placement. Certaines encore placeront les pièces en veillant à ne pas déranger leur orientation et d’autres les orienteront sans les déplacer… C’est la combinaison de toutes ces formules, utilisées successivement, qui vous mèneront à la victoire.

### Les différentes méthodes

Je classe les méthodes par famille, le cube pouvant se résoudre :

- soit par couches successives,
- soit en commençant par tous les milieux avant de résoudre les coins
- soit en commençant par tous les coins avant de résoudre les milieux
- ou enfin, il existe également des méthodes hors normes.

### Méthodes par couches successives

Ceci est la façon la plus répandue pour résoudre son cube.

#### Résolution des deux premières couronnes

(1ere face et second étage) :

- 1ere face : **Placer et orienter** les **milieux** (4) et les **coins** (4)
- 2nde couronne : **Placer et orienter** les milieux (4)

Selon les méthodes, des variantes existent : La méthode du coin manquant :

- 1ere face : **Placer et orienter** les **milieux** (4)
- 2nde couronne : **Placer et orienter** 3 milieux - laissez intentionnellement un milieu non placé

- Complétion :
- **Placer et orienter** les 3 coins de la 1ere face en utilisant le milieu libre de la 2nde couronne
- **Placer et orienter** le 4me milieu de la 2nde couronne + le 4eme coin de la 1ere face en une fois

#### Résolution de la dernière face

Les mêmes étapes, dans des ordres différents peuvent servir ici :

- **Orienter les milieux** de la dernière face
- **Placer les coins** de la dernières face
- **Orienter les coins** de la dernière face
- **Placer les milieux** de la dernière face

Ou encore :

- **Orienter les milieux** de la dernière face
- **Placer les milieux** de la dernière face
- **Placer les coins** de la dernière face
- **Orienter les coins** de la dernière face

**<a href="http://en.wikipedia.org/wiki/Jessica_Fridrich" target="_blank">Jessica Fridrich</a>** va concevoir une méthode plus aboutie pour battre des records à partir de cette méthode. C'est la méthode FCOP (Cross, First 2 Layers, Orient Last Layer, Permute Last Layer)

- Cross : **Placer et orienter les milieux** (4) de la 1ere face
- First 2 Layers : **Placer et orienter les coins** de la 1ere face **avec les milieux de la 2nde couronne par paire**
- Orient Last Layer : **Orienter les milieux** (4) **et les coins** (4) de la dernière face (formules OLL)
- Permute Last Layer : **Placer les milieux** (4) **et les coins** (4) de la dernière face (formules PLL)

Les deux dernières étapes demandent un grand effort de mémoire parce qu’il faudra restituer une formule différente en fonction de l’orientation des pièces de la dernière face (57 au total) et une autre formule, différente en fonction de la position de chaque pièce de la dernière face (21 au total).

Personnellement, je combine : je résous les deux premières couronnes avec les formules de Fridrich et je finis la dernière face en gérant les coins et les milieux séparément.

### Méthodes des milieux en premier

Si vous avez une très mauvaise mémoire mais une bonne représentation mentale d’un objet en 3D, c’est la méthode qu’il faut utiliser. Avec ses variantes, elle n’est pas réputée (à ma connaissance) pour du speedcubing. Toutefois, ce sont des méthodes plutôt… relaxantes, avec peu de formule à retenir. Peu de formules = résolution plus longue.

Le principe est de

- **Placer tous les milieux** du cube entier (12)
- **Orienter tous les milieux** du cube (12)
- **Placer tous les coins** du cube (8)
- **Orienter tous les coins** du cube (8)

La variante qu’on trouve parfois sous le nom de méthode universelle ne compte que 4 formules à retenir. C’est, pour ma part, la méthode complète avec le moins de formules à retenir.

Si vous êtes familiarisés avec le cube, le **placement** et l’**orientation** des **12 milieux du cube** peuvent se faire intuitivement : pas de formule à apprendre mais solide maîtrise du cube (à mon avis). Il ne restera donc plus que 2 formules à apprendre : l’une pour le placement des coins et l’autre pour leur orientation. Si vous avez testé avec les formules par couches successives, il est fort à parier que vous connaissez déjà les deux dernières formules à apprendre...

### Méthodes des coins en premier (Ortega)

Dernière méthode acquise à ce jour, je n’en connais pas de variantes. Très populaire dans les années 80, certaines personnes ont remportés des compétitions (*Minh Thai* en 82) avec cette méthode. Le fait de commencer par les coins et de finir par les milieux après coup la rend totalement différente à mes yeux. Je suis complètement désorientée lorsque je l’exécute mais ça va finir par rentrer.

- 1ere face : **Placer et orienter** **les coins**
- 1ere face : **Placer et orienter** **les milieux** sauf un
- Dernière face : **Placer les coins**
- Dernière face : **Orienter les coins**
- Dernière face : **Placer et orienter les milieux**
- 1ere face : **Placer et orienter le dernier milieu**
- 2nde couronne : **Placer les milieux**
- 2nde couronne : **Orienter les milieux** 

Dans cette méthode, vous placez les 4 premiers coins de manières intuitives. Il y a des formules pour placer les 4 derniers coins et pour les orienter. Si vous êtes un cubeur expérimenté, vous pouvez également utiliser les formules que vous connaissez déjà pour placer et orienter les derniers coins. A ce moment là de la résolution, vous n’avez pas grand chose à casser non plus. Le placement des milieux des faces du dessus et du bas sont somme toute des formules intuitives, du moment qu’on a compris comment elles fonctionnent. Reste une formule pour placer les milieux de la couronne centrale et une autre formule pour orienter les milieux de la couronne centrale.

### Hors compétition :

#### Méthode de Lars Petrus

**<a href="http://lar5.com/cube/index.html">Lars Petrus</a>** est également un célèbre speedcuber. Zieuter cette vidéo de lui... je suis fan de sa fluidité... tout en douceur...

<a href="https://www.youtube.com/watch?v=W9HS8dQyekA">https://www.youtube.com/watch?v=W9HS8dQyekA</a>

Cette méthode vous permet d’avancer largement dans la résolution du cube de manière intuitive. Il ne reste que les dernières étapes qui nécessitent l’apprentissage de formules.

- Etape 1 : Résoudre un petit **bloc de 2x2x2** dans un coin du cube
- Etape 2 : En faire un **bloc de 2x2x3**.

Arrivé là, il ne reste plus que 2 faces que vous pouvez manipuler sans avoir à déplacer les blocs déjà placés. Les étapes 3 et 4 sont à résoudre en manipulant uniquement que les deux faces qui sont restées mobiles. Cela fait partie du "jeu" de cette méthode.

- Etape 3 : **Orienter les milieux** des deux faces mobiles
- Etape 4 : **Compléter les deux couronnes**

En principe, vous pouvez arriver jusqu’ici sans avoir recours à aucune formule (même si l’obtention des deux dernières croix m’a pris beaucoup de temps avant que je sache exactement ce que j’avais fait pour parvenir au résultat attendu). Il ne reste que les derniers coins à placer et à orienter et les milieux à placer (ils sont déjà orientés). Normalement, vous pouvez finir le cube avec les formules apprises lors des méthodes par couches successives puisque finalement, vous vous retrouvez avec un cube résolu au deux couronnes, les milieux bien orientés mais mal placés.

- Etape 5 : **Placer les coins**
- Etape 6 : **Orienter les coins**
- Etape 7 : **Placer les milieux**

Lars Petrus toutefois a une collection de formules pour **placer ET orienter** les coins en une seule formule, en fonction de la situation qui se présente.

#### La méthode de Gilles Roux

J’ai trouvé un tutorial sur la méthode de **Gilles Roux** mais je n’ai pas bien compris comment cela fonctionne… Je vais continuer de creuser dans cette direction.

### A part ça...

Hormis les méthodes à vue, il existe également au moins une méthode à l’aveugle. Ne maîtrisant pas encore la première, je ne saurais dire s’il y en a d’autres.

D’une manière générale, certaines formules vous permettront de franchir une étape avec une et une seule formule et d’autres formules qui vous feront décomposer l’étape en petits objectifs à résoudre individuellement jusqu’à compléter l’étape. Par ex, pour orienter tous les coins de la dernière face, vous avez soit une formule pour faire les 4 coins en une fois et une formule qui va vous faire orienter les coins deux à deux.

Pour ma part, j’ai une préférence pour les formules qui me permettent d’obtenir sans faillir une position du cube donnée. Je sais qu’à partir de la position initiale de mon cube, je pourrais atteindre la position que j’attends avec elles. Invariablement.

Il existe toutefois des méthodes qui utilisent des formules qu’il faut exécuter autant de fois que nécessaires jusqu’à obtenir la position du cube recherché… Je ne trouve pas cela très efficace. Vous pouvez appliquer la méthode telle qu’expliquée. Parfois, c’est pratique parce que ça limite le nombre de formules à apprendre. Mais sachez qu’il existe toujours une formule qui répondra à un besoin précis. J’ai vu assez de formules pour vous dire qu’il y a toujours une formule pour votre besoin. 

Encore une fois, manipulez-le cube, faites le tourner, apprivoisez-le. Résoudre le cube, c’est comme jouer aux échecs. Il y a les gens normaux, qui avancent leurs pions au coup par coup avec une anticipation médiocre. Et il y a les champions, qui savent déjà que lorsqu’ils auront placé ce coin, ils auront du même coup préparé les éléments de la dernière face… L’avantage par rapport aux échecs, c’est que votre adversaire, vous pouvez le démonter..

**Quelques liens :**

- La <a href="http://www.ws.binghamton.edu/fridrich/system.html" target="_blank">méthode de Jessica Fridrich</a> par Jessica Fridrich
- La <a href="http://lar5.com/cube/">méthode de Lars Petrus</a> par lui même
- La <a href="http://www.alchemistmatt.com/cube/rubik.html" target="_blank">méthode par les coins en premier</a>
- Le <a href="http://www.rubiks.com/" target="_blank">site officiel de Rubik's</a>
- Le <a href="https://www.speedsolving.com/wiki/index.php/Main_Page">wiki </a>

Et pêle mêle des sites sur lesquels j'ai trouvé des méthodes et des astuces diverses : <a href="http://www.francocube.com/" target="_blank">Franco cube</a>, <a href="http://trucsmaths.free.fr/rubik.htm" target="_blank">Trucs maths</a>, <a href="http://rubikubik.pagesperso-orange.fr/index_news.html" target="_blank">Rubik Ubik</a>, <a href="http://playnetcube.fr/solution-rubiks-cube-3x3.html">Playnet Cube</a> et <a href="http://www.cube20.org/" target="_blank">Cube 20</a>

Enjoy !
