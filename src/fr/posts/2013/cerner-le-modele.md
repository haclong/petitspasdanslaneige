---
title: "Cerner le modèle"
permalink: "fr/posts/cerner-le-modele.html"
date: "2013-03-09T21:34"
slug: cerner-le-modele
layout: post
drupal_uuid: e1ce0770-a01f-47bc-8d19-ab48a9693e71
drupal_nid: 28
lang: fr
author: haclong

media:
  path: /img/teaser/600_prometheus-prom-007_rgb1.jpg
  credit: "20th century fox"

tags:
  - "OOP"
  - "architecture logicielle"
  - "modèle"

sites:
  - "Développement"

summary: "Quand j'ai commencé le développement orienté objet, notamment dans le cadre du modèle MVC, je me suis rapidement heurté à cette interrogation : qu'est ce que le MODELE ? Et au delà de sa définition, comment on construit un modèle ?"
---

Quand j'ai commencé le développement orienté objet, notamment dans le cadre du modèle MVC, je me suis rapidement heurté à cette interrogation : qu'est ce que le MODELE ? Et au delà de sa définition, comment on construit un modèle ?

### Ni la vue, ni le contrôleur

D'après les explications du <a href="http://fr.wikipedia.org/wiki/Mod%C3%A8le-Vue-Contr%C3%B4leur" target="_blank">modèle MVC</a>, de toutes évidences, le **Modèle** n'est ni le **Contrôleur**, ni la **Vue**.

- La **Vue**, c'est le templating : la mise en forme des *données*.
- Le **Contrôleur**, c'est le routing et la gestion des requêtes HTTP. La responsabilité du contrôleur est de servir les *données* en fonction de la requête de l'utilisateur.

Ainsi, le **contrôleur** sert les *données* et les transmet à la **vue** qui affiche ces mêmes *données* dans une jolie mise en page. Comme on peut le constater, contrôleur et vue travaillent en étroite collaboration. Du moins, tel que c'est géré avec <a href="http://framework.zend.com/manual/1.12/en/learning.quickstart.intro.html" target="_blank">**Zend Application**</a>.

Dans ce cadre, de quelles façons s'inscrit donc le **modèle** ? Je vous le donne dans le mille, et après un rapide travail d'élimination, on peut affirmer sans ciller que le **modèle** est tout ce qui reste : les **données**.

L'affaire prend alors une tournure simplissime.

### Modèle = données

Il y a quelques années, lorsqu'on mentionnait les *données*, on entendait facilement *base de données* qui plus est, unique. De nos jours, on ne peut plus se permettre de limiter le concept de *données* à une seule base.

En effet, les applications puisent leurs informations parfois dans plusieurs bases de données différentes, chacune avec une technologie différente (MySQL, Posgre, Oracle...). Certaines données peuvent venir de flux échangés avec des webservices de fournisseurs tiers alors que d'autres peuvent provenir de flux RSS.

Les sources de données sont désormais multiples et à la conception du modèle, il faut pouvoir prévoir - déjà - les possiblités d'extensions de ses fonctionnalités.

### Le modèle contient les règles métiers

Au delà de ce point, j'ai pu constater que je ne pouvais pas me limiter à cette équivalence : modèle = données. Celle ci ne serait vrai que si les utilisateurs qui visitent une application ne souhaitaient accéder qu'à des données brutes, certes mise en page, mais non filtrées, non triées et ne serait-ce qu'en citant le cas des dates non formatées, format timestamp par exemple, j'ai tout dit.

Diverses lectures font clairement apparaître qu'en plus des données, le modèle comprend également les règles métiers : le format des données à communiquer, les procédures enchaînées suite à un événement, les conditions à satisfaire pour distribuer des informations... En vérité, le coeur de l'application se situe en fait dans le modèle. Deux exemples simples pour s'en convaincre :

- Dans le cadre d'une application avec des membres, ceux ci ont la possibilité de se désinscrire. Pour l'utilisateur membre, se désinscrire revient à cliquer sur un bouton "se désinscrire". Le bouton se situe dans la vue. Lorsque l'utilisateur a cliqué le bouton, la vue transforme cette action en requête que le contrôleur reçoit. Le contrôleur dit alors au modèle qu'un membre authentifié souhaite se désinscrire. Le modèle réagit en
- retirant l'accès de l'application à l'utilisateur
- supprimant toutes les données personnelles de l'utilisateur
- conservant les données (articles, blogs, posts, commentaires) dont l'utilisateur est auteur
- remplaçant l'identifiant de l'utilisateur par la valeur par défaut "anonyme"


- Dans le cadre d'une application de vente en ligne, l'utilisateur peut consulter son panier en cours de commande. Pour consulter la commande, l'utilisateur cliquer sur l'icône du "panier" que la vue a bien pris soin de lui mettre à disposition. Lorsque l'utilisateur a cliqué sur l'icône, une requête est envoyée au contrôleur. Le contrôleur dit au modèle que l'utilisateur A souhaite consulter son panier en cours. Le modèle réagit en
- identifiant le bon panier
- renvoyant, pour chaque élément du panier, le prix unitaire du produit et le prix total calculé sur la base du prix unitaire multiplié par la quantité
- renvoyant le montant total du panier en additionant tous les prix totaux des éléments du panier
- renvoyant le montant de TVA sur la base du taux de TVA en vigueur

On constate donc bien que pour deux actions qui, du point de vue de l'utilisateur semblent être simplissimes enchaînent chacune des décisions, des arbitrages ou des calculs avant l'affichage final des données.

Pour conclure sur ce point, les recommandations portent sur des contrôleurs très légers et des modèles beaucoup plus volumineux mais plus judicieux également. Vous trouverez des argumentations plus convaincants probablement sur les articles suivants (anglophones) : <a href="http://blog.astrumfutura.com/2008/12/the-m-in-mvc-why-models-are-misunderstood-and-unappreciated/trackback/" target="_blank">The M in MVC...</a> de Pádraic Brady, <a href="http://weblog.jamisbuck.org/2006/10/18/skinny-controller-fat-model" target="_blank">Skinny controller....</a> de Jamis (appliqué au framework Ruby on Rails mais le principe reste le même), et un <a href="http://www.slideshare.net/damiansromek/thin-controllers-fat-models-proper-code-structure-for-mvc" target="_blank">diaporama</a> qui résume bien le choix technique.

### Mais alors, où allons nous ?

Le concept du modèle s'éclaircit. On sait ce qu'il n'est pas, ni la vue, ni le contrôleur. On sait également qu'il ne peut se limiter à une correspondance avec une base de données. Mais quand on est devant son IDE favori et qu'il s'agit de créer son premier modèle, on se dit : par où commencer ?

Matthew Weier O'Phinney et Rob Allen en décrivent les principes dans leur articles respectifs (anglophones) <a href="http://www.mwop.net/blog/202-Model-Infrastructure.html" target="_blank">Model Infrastructure</a> et <a href="http://akrabat.com/zend-framework/on-models-in-a-zend-framework-application/" target="_blank">On Models in a Zend Framework application</a>. Après la lecture de leurs propositions, j'ai commencé à entrevoir une organisation dans mes objets.

A la conception, j'ai commencé à craindre la démultiplication des objets si proches les uns des autres, les uns appelant les autres de façon à créer peut être une pyramide avec trop de couches successives dans mon modèle. Je me suis demandée si mon concept n'était pas exagéré dans ses détails et si, dans mon enthousiasme, je n'avais pas appliqué les principes trop scrupuleusement. La lecture de l'article <a href="http://en.wikipedia.org/wiki/SOLID_%28object-oriented_design%29" target="_blank">S.O.L.I.D</a> de Wikipedia (anglophone, désolé, la version française n'a plus cet article) m'a réconfortée dans mes choix et ces 5 principes sont un guide que je garde à l'esprit pour la conception de mes objets. Philippe Vialatte explique très bien les <a href="http://philippe.developpez.com/articles/SOLIDdotNet/" target="_blank">principes S.O.L.I.D</a> sur developpez.com. Concernant ses exemples de code, il faut juste retenir que son article est appliqué au langage .NET. De toutes façons, nous parlons ici d'architecture du code et non pas d'un langage lui même. La conception d'un modèle peut s'appliquer à tous les langages. Ce n'est vraiment qu'au moment de l'appliquer et de l'écrire véritablement que le choix du langage fera la différence.

L'architecture de mon modèle fait petit à petit son chemin. J'ai dû refactorer plusieurs fois au cours de sa conception (mieux vaut tard que jamais) parce que une arborescence valait peut être mieux qu'une autre. Je ne suis toujours pas sûre mais dans mon développement, je suis de plus en plus persuadée que les principes SOLID contribuent à une programmation orientée objet efficace.

Je vous donne rendez vous dans le prochain article dans lequel je vous présenterais plus en détail mes conclusions. Initialement, je voulais le faire dans ce même article mais la lecture commence à être longue. Et la rédaction de l'article aussi (!). A bientôt.
