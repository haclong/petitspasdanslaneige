---
title: "Environnement de travail"
permalink: "fr/posts/environnement-de-travail.html"
date: "2013-07-22T15:50"
slug: environnement-de-travail
layout: post
drupal_uuid: 43624b8d-b61f-41a9-ab26-db35948d188a
drupal_nid: 42
lang: fr
author: haclong

media:
  path: /img/teaser/9363900-los-engranajes-de-los-viejos-billetes.jpg

tags:
  - "daily life"

sites:
  - "Développement"

summary: "Je viens de changer d'ordinateur, mon eeepc précédent commençant à donner des signes de faiblesse. Je profite de l'occasion pour mettre à plat mon environnement de travail."
---

Je viens de changer d'ordinateur, mon eeepc précédent commençant à donner des signes de faiblesse. Je profite de l'occasion pour mettre à plat mon environnement de travail.

### L'OS

Ubuntu 13.04. J'aurais bien testé Mint mais il semblerait que Mint ne permette pas un démarrage en dual boot avec Windows 8...

Je suis fan du repository. Que ce soit par la logithèque Ubuntu ou par le gestionnaire de paquets Synaptic, on fait une petite recherche, on trouve une appli, on clique, elle s'installe. Et si besoin est, elle s'installe avec toutes les librairies qui vont bien. C'est historisé. Il faut juste prendre le temps de lire l'historique date par date.

Je ne suis pas fan de Unity mais on finit par s'habituer. C'est surtout parce que je ne sais pas changer un bureau pour une autre :p hihi

**Saisie internationale** : pour pouvoir écrire plusieurs alphabets différents (dont le vietnamien), j'ai installé ibus. Il faut distinguer la méthode de saisie (ibus) et la gestion des langues sur l'OS. Si on confond, on peut se retrouver avec son ordinateur qui parle une autre langue un jour...

### Les classiques

**La suite bureautique** de base sur Ubuntu, c'est Libre Office. Rien à dire de ce côté là.

**Le gestionnaire de fichier** : Files (ex nautilus). Etrangement, la version qui est installé sur la 13.04 bug quand on transfère de gros paquets de fichiers du disque dur local vers un NAS par le réseau. Ce n'est pas glop et en plus, ça laisse des indicateurs résiduels sur l'écran... (genre la barre de progression qui ne correspond plus à aucune progression, l'absence de barre de progression...) C'est assez gênant. Du coup, j'utilise Krusader en parallèle si j'ai prévu de faire de gros transferts. C'est pas la situation que je préfère mais j'ai pas encore trouvé mieux. Je pourrais utiliser Krusader définitivement mais j'ai une préférence pour l'interface de Files.

**Les utilitaires** sont installés par défaut avec Ubuntu. Rien à redire.

**L'imprimante PDF**

### Les media

**Le lecteur de média** : Rhythmbox. C'est mon dernier choix mais je pourrais changer. Rhythmbox accède aux podcasts et aux radios internet. En plus, il a une version minimale qui est incrustée dans la barre de programme d'Ubuntu. Le titre de la chanson en cours s'affiche en premier plan au moment où la chanson commence.

**Le gestionnaire d'ID tags** : mes mp3 ont des tags mal faits. ex falso est pratique pour renommer massivement les morceaux

**Renommer massivement les fichiers** : ex falso fait également ça en se basant sur les tags. Je pense que je vais vite arriver à une limite à cette fonctionnalité sur ex falso mais pour le moment, ça dépanne.

**La vidéo** : Le lecteur de vidéo de Ubuntu par défaut est Totem. Je n'ai pas pour le moment besoin de plus. Mais mes besoins sont minimaux.

**La retouche photo** : Gimp

**Le dessin vectoriel** : Inkscape. Je suis fan.

**Les tableaux** 

**Le visionneur d'images**

### Le développement

**L'éditeur de texte** : la base, parce que c'est toujours utile et que ça dépanne : gedit

**Le serveur** : Apache 2 avec le module php5

**La base de données :** Mysql

**Le gestionnaire de base de données :** un grand classique : phpMyAdmin

**Le client FTP :** Filezilla

**La suite de test unitaire** : phpUnit

**L'éditeur IDE :** Net Beans installé avec les librairies PHP, notamment le framework Zend Framework 2

**Un wiki** en cas où : Parce que c'est toujours utile de noter des petits trucs à droite et à gauche : j'avais wikimedia jusqu'à ce jour mais je penche plutôt vers un wiki en fichiers plats pour éviter la contrainte de la base de données. Dans la logique, si les infos pour installer la base de données se trouvent stockées dans la base de données qu'on ne sait pas installer, on n'est pas prêt d'y arriver...

**Le gestionnaire de projets :** Redmine à ce jour. J'ai toujours des difficultés à faire fonctionner un serveur Ruby. Du coup, je pense que cette solution n'est pas perenne pour mon usage. Je cherche une alternative open source qui soit souple et complète... Pas encore trouvé vraiment.**** En fait, le gestionnaire de projets doit surtout pouvoir être un gestionnaire d'exigences... Ce type d'applications est encore plus rare que le gestionnaire de projets... Je pense à détourner un outil de suivi de bug pour ça... J'ai à ce jour détourné une instance Drupal, mais si la solution apparaît satisfaisante, je ne la trouve pas pratique.

**Un suivi de bug** : Mantis.

**Un outil d'analyse de trafic :** Piwik

**La gestion des fichiers multilingues :** Poedit.

**La gestion des versions :** git. Ubuntu propose gitg et qgit qui n'est qu'un visualiseur pour git. Mais comme git est interfacé avec net bean, normalement, pas besoin des autres outils.

**Le serveur de mail** : Il me faudrait également un serveur mail pour que les applications en local puisse m'envoyer des mails via le réseau... Pour le moment, rien de tout ça.

Et voila approximativement tout ce dont j'ai besoin pour travailler, modulo les différents jeux installés pour se détendre...
