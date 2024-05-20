---
title: "Les aventures de Petits Pas Dans La Neige..."
permalink: "fr/posts/les-aventures-de-petits-pas-dans-la-neige.html"
date: "2021-12-06T13:10"
slug: les-aventures-de-petits-pas-dans-la-neige
layout: post
drupal_uuid: 21fd4f95-6f24-4f79-aeeb-c78dc4013a07
drupal_nid: 178
lang: fr
author: haclong

media:
  path: /img/teaser/aaron-burden-xG8IQMqMITM-unsplash.jpg
  credit: "Aaron Burden"
  url: https://unsplash.com/@aaronburden

summary: "Le blog que vous lisez à cet instant précis ne me satisfait pas entièrement. Et je cherche (mais c'est une tâche de fond, je n'y passe tout mon temps, ça se saurait) à le changer."
---

Pour le moment, Petits Pas Dans La Neige utilise un Drupal. J'ai migré récemment le blog d'une version majeure à la suivante et je dois déjà considérer la prochaine migration (oui, comme ça me prend un certain temps pour me décider à mettre les mains dans le cambouis, il faut que je me prépare psychologiquement à y aller...)

On va dire que j'avais plus d'ambition pour ce blog quand je l'ai créé il y a de cela quelques années. L'une d'elle étant très ouvertement d'aller tripatouiller la solution Drupal. J'en ai fais le tour (pas Drupal, le blog) et voici le constat après toutes ces années :

- Un blog, c'est juste un blog... c'est pas un réseau social, y'a pas besoin d'un énorme système de gestion de users (surtout CE blog)
- Drupal, c'est un peu overkill pour ce que j'en fais. C'était rigolo et ça fait le job, je dis pas, mais finalement, je n'ai pas forcément besoin de toute la complexité du CMS. Même pour le thème, comme il n'y a pas beaucoup une typologie complexe des articles ni une activité débordante, pas besoin d'avoir un thème très complexe qui permettrait de mettre des articles en avant sur différents domaines. J'avais bien regardé Wordpress à l'époque où j'ai fait mon choix mais à l'époque, Wordpress n'offrait pas une solution multilingue qui me convenait.
- La solution Drupal ou Wordpress me contraint de passer par l'admin de ces deux CMS pour ajouter du contenu au site. Or, avec le temps, j'écris mes nouveaux articles sur un notepad de base, je mets en forme ma réflexion, je réarrange les chapitres et je sauvegarde le résultat dans un .txt. Ensuite je me connecte sur l'admin du site et là, je fais copier coller de mon fichier .txt et je refais la mise en page en utilisant l'éditeur de Drupal, en répartissant le titre, le summary, les liens internes et externes, les insertions des images... Quitte à réécrire suite à la relecture, ce qui fait que ma version Drupal dévie de ma version initiale... Après un moment, je me retrouve avec pleins de fichiers .txt qui ont été pour certains publiés, pour d'autres pas encore, dans le chaos créatif, je me retrouve même avec plusieurs répertoires différents (sur les différents ordinateurs) qui contiennent ces embryons d'articles. Je finis par m'interroger sur la nécessité de doubler les articles : la version .txt qui pourrait convenir pour peu qu'ils incluent une mise en page basique et la version base de données de Drupal qui est la version "officielle" finalement, mais qui ne peut être réexploité sans le moteur du CMS qui est le seul à comprendre ce qui a été stocké et comment ça a été stocké. J'en retire un sentiment de dépendance confortable mais irritant.

La crise s'est surtout manifestée lorsqu'il s'est agit de migrer Drupal d'une version majeure à la suivante, Drupal n'assurant pas la rétro compatibilité entre ses versions majeures (pas de surprise, on le sait quand on choisit Drupal). La crainte de perdre des informations dans mes articles, les liens, les images, la mise en page, tout ça résultant des nombreux modules complémentaires que j'ai installé sur Drupal et dont je n'étais pas sûre de la conformité / correspondance dans la version suivante. Le travail nécessaire pour s'assurer que tous les articles survivraient suffisamment bien à la migration parce qu'ils passaient d'une base de données à la suivante alors qu'en soi, migrer d'une version à une autre un CMS ne _devrait_ pas avoir d'incidence sur un contenu et sa mise en page a également contribué à remettre la solution en question.

J'en suis là. Je cherche un moyen de migrer mon blog sur une version markdown avec des fichiers plats pour chacun de mes articles. Toutes "migrations" ultérieures concerneraient le moteur de restitution des articles, les thèmes, les fonctionnalités mais pas le contenu de mes articles.

Afin d'assurer la migration du blog, il faut en lister les fonctionnalités :

- la page d'accueil contient la liste des articles du plus récent au plus ancien
- les articles sont en anglais ou en français avec des liens entre eux puisque certains sont la traduction des autres
- les articles ont tous une image d'entête pour illustrer
- les articles peuvent avoir des images insérées dans le corps de l'article
- les articles doivent pouvoir afficher du code avec coloration syntaxique pour faciliter la lecture
- les articles peuvent être taggés
- les articles doivent être datés
- il peut y avoir des commentaires sur les articles mais il doit être possible de modérer ces commentaires, voire même de les refuser
- certains articles sont regroupés en collection d'articles sur un même sujet (comme un tutoriel en plusieurs épisodes)
- les articles des collections d'articles sont hiérarchisés et ordonnés
- les collections d'articles affichent dans l'ordre les articles qui les composent
- les collections d'articles peuvent apparaître sur une liste "books"
- il y a également des événements qui me permettent de partager des sujets sur des événements à venir ou en cours (expositions, festivals etc..)
- les événements peuvent avoir des commentaires
- les événements peuvent être taggés
- les événements apparaissent sur une liste "événements à venir"
- les articles, comme les événements, peuvent avoir des liens en interne ou des liens vers des sites externes.

J'envisage soit Jekyll <a href="https://jekyllrb.com/">https://jekyllrb.com/</a>, soit Grav <a href="https://getgrav.org/">https://getgrav.org/</a>. Je dois avouer, Jekyll en Ruby me freine à cause d'un ancien litige avec Ruby qui se refusait de fonctionner correctement et qui, malgré de nombreuses recherches sur Google et Stackoverflow, s'est avéré impossible de débugger... J'en garde un ressentiment encore vivace... Mais, toujours est-il, la compétition est ouverte !
