---
title: "Application, module et composant"
permalink: "fr/posts/application-module-et-composant.html"
date: "2015-04-03T17:50"
slug: application-module-et-composant
layout: post
drupal_uuid: 7bb0c84e-a4f6-4a2f-befa-d0bcdd54fa64
drupal_nid: 131
lang: fr
author: haclong

media:
  path: /img/teaser/apprets-3-perles-poupee-russe-matriochka-e-332162-p1160248-d3e57_big.jpg

tags:
  - "architecture"
  - "code"

sites:
  - "Développement"
  - "Haclong projects"

summary: "J'ai toujours trouvé les poupées russes amusantes. On ouvre la première et il y en a une autre à l'intérieur. On sort la seconde, on referme la première et nous voilà avec deux poupées qu'on pourrait séparer... nul ne saurait dire qu'il en manque une. Mais voilà qu'à l'intérieur de l'une des deux, une autre poupée est cachée. Et on se retrouve avec trois poupées distinctes... Mais en continuant d'ouvrir les poupées les unes après les autres, on ne sait pas non plus jusqu'où il faut aller, à quelle profondeur on doit s'enfoncer pour arriver à la fin de nos poupées...

Parfois, je trouve que le code, c'est pareil."
---

Quand il s'agit de monter l'architecture de votre application, vous avez plusieurs modèles qui s'offrent à votre imagination. Je pense que le choix se fait en fonction de vos préférences, de la façon dont vous vous projetez dans votre projet, de la taille et/ou de la complexité de votre projet.

Avec le temps, on tente tous, chacun à notre façon, de rationaliser et/ou d'optimiser notre façon d'écrire du code. Certains défendent la programmation orientée objet et d'autres lui préfèreront le procédural. Certains préfèrent tout coder depuis le début et d'autres optent pour des frameworks éprouvés. Quelle que soit votre préférence, vous pouvez structurer votre code et donner des responsabilités à différents composants de votre application.

### Responsabiliser les composants

Quand je parle de responsabilité d'un composant, je pense forcément aux principes SOLID de la programmation orientée objet. Toutefois, même si vous faite de la programmation en procédural, vous pouvez trouver le concept intéressant. Le principe est d'assigner une tâche limitée pour chaque type de fichiers de votre application (des objets pour ceux qui programment en objet, des fichiers .php pour ceux qui programment en procédural).

Il y a les fichiers (ou les objets) dédiés pour l'affichage à l'écran : typiquement, vous vous limiterez à utiliser les balises HTML (y compris Javascript et CSS) que dans ces fichiers. Vous utiliserez des fonctions d'affichage (echo, printf etc...) dans ces fichiers et nulle part ailleurs.

A l'opposé, vous pouvez décider d'avoir des fichiers (ou des objets) dédiés pour extraire les données à partir des couches de stockage. Les couches de stockage sont la base de données, des fichiers XML, des fichiers csv, des données de web services. En procédural, ces fichiers vont

- accéder à la source de vos données (le répertoire de fichiers, le serveur FTP, la base de données),
- récupérer les données à partir de la source,
- préparer une (ou plusieurs) variable(s) pour utiliser ces données.

En objet, on retrouve le même principe : accéder aux données, récupérer les données dans des objets, utiliser ces objets.

Une fois que vous avez regroupé les fichiers (ou objets) en ensembles avec des responsabilités similaires : les fichiers qui affichent les données, les fichiers qui extraient les données, les fichiers qui traitent les données, les fichiers qui stockent les données, sans nécessairement appliquer à la lettre des modèles d'architecture définis, vous pouvez remonter vos ensembles à un niveau supérieur : les modules.

### Concevoir des modules

Bundle chez Symfony, Module chez Zend Framework, le module est un ensemble de fichiers (ou d'objets) qui sont sensés couvrir une fonctionnalité de votre application... Là encore, il reste LA question qui taraude... fonctionnalité... quand commence-t-elle, quand finit-elle...

Vous commencez à couper votre application en modules. Vous êtes maître en ce domaine. A vous de décider s'il est plus raisonnable / logique de découper l'application en trois, quatre, quinze ou vingt modules. L'enjeu (ou la règle) est que les modules interagissent les uns avec les autres mais qu'ils ne soient pas trop liés (afin de pouvoir les débrancher facilement). Le point déterminant, c'est que vous devez pouvoir remplacer un module par un autre sans avoir à réécrire les modules existants (qui ne sont pas changés). Bon, plus facile à dire qu'à faire, je vous l'accorde. Mais vous devez garder cet objectif en tête.

Chaque module couvre une fonctionnalité. Une fonctionnalité évolue, vous faites évoluer un et un seul module. Pas d'impact pour les voisins (dans le meilleur des mondes).

Chaque module est développé avec le découpage par composants responsabilisés mentionnés plus haut. Ainsi, les responsabilités sont réparties dans les objets (ou fichiers) puis de manière macro au niveau des modules. Mais on peut encore remonter d'un niveau.

### Concevoir des applications

Au dessus des modules, vous avez des applications entières. La plupart des projets concerne une et une seule application et peu se sentiront concernés par ce niveau de conception. Toutefois, je me surprends, dans mes propres projets, à imaginer une brique intermédiaire, uniquement dédiée à la restitution de données par exemple.

Une application classique se compose d'un accès à la couche de données stockées, d'un front communément appelé le site, et d'un back, communément appelé l'interface admin. Globalement, le back insère des données dans une base de données et le front va lire les données dans la base de données et les restituer à l'écran. Après, vous avez toujours les sites participatifs, où les utilisateurs du front peuvent inscrire des informations dans la base de données, mais dans ce cas, vous aurez également un back plus solide qui va gérer des aspects absents du front : gestion des utilisateurs, gestion des droits etc... Il y a toujours un back et un front, les deux articulés autour d'une base de données.

Une fois qu'on voit ces trois éléments, on peut se livrer à plusieurs architectures différentes :

- une seule URL, un back, un front et une base de données, tout mélangé : typiquement, un site Wordpress.

- une URL pour le front, un sous domaine pour le back, et la base de données... Ca laisse songeur. Comment développer une application back, hébergée sur le sous domaine, qui auraient les fonctionnalités pour venir enregistrer les données dans la base de données et une seconde application front, hébergée sur le domaine, qui ne pourraient que lire les infos de la base de données : sessions séparées, caches séparés : c'est pratique pour la répartition des ressources. Le back est lié à la base de données. Le front est lié à la base de données. Les changements opérés sur le front n'ont pas de conséquences sur le back et vice et versa. On peut même commencer à imaginer pour un même back, plusieurs fronts différents, chacun exploitant une partie des données stockées dans la base de données. Chaque front étant indépendant (sauf pour la base de données), modifier un front n'intervient pas sur les autres fronts. On sépare encore plus l'accès aux données et la présentation au client.

- Afin de mieux séparer encore les concepts (et responsabilités), on pourrait décider que le front n'a aucun contact sur la base de données. Il n'y a donc pas de risques que le mot de passe de la base de données circule auprès d'une grande population d'utilisateurs. Mais alors comment accéder aux données stockées dans la base par le back ? En ajoutant les web services. Le back insère les données dans la base de données. Une couche webservices restitue les données. Grâce à cette couche webservices, le développeur contrôle exactement les requêtes "publiques" qu'on peut faire sur son jeu de données. Ne faire que des GET, interdire les PUSH etc... Le front consommerait alors ce web services. On a complètement détaché le front de la base de données. Si cette dernière organisation semble plus complexe à énoncer, elle peut se révéler plus simple à maintenir. Toucher une des applications ne casse pas nécessairement l'autre. Limiter l'accès à la base de données a un sens aussi. Et plus concrètement, cette organisation permet de garder un back avec un modèle de site web alors que le front serait une application mobile...

De niveau en niveau, on a coupé, scindé, divisé, fragmenté notre application toujours en plus petites parties. Plusieurs applications séparées qui accèdent au même jeu de données. Chaque application est composée de modules en charge d'une fonctionnalité distincte. Chaque module lui même est divisé en plusieurs fichiers, chaque fichier lui même représentant un et un seul composant responsable.

Même si vous décidez de vous affranchir de ce tout objet qui semble faire le buzz autour de vous et que vous décidez de conserver votre vieille programmation procédurale, vous pouvez quand même faire la démarche de découper et de scinder votre code en plus petites parties et chaque partie sera utilisée par effet d'include... J'ai relu des vieux vieux codes à moi et j'ai souris quand j'ai vu que j'avais déjà appliqué ce principe... Maladroitement, mais le principe était là.
