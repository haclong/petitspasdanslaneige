---
title: "Back to work !"
permalink: "fr/posts/back-work.html"
date: "2016-09-19T14:59"
slug: back-work
layout: post
drupal_uuid: 0f75a30b-617f-46e0-b6f6-d9487a319432
drupal_nid: 151
lang: fr
author: haclong

media:
  path: /img/teaser/jeu_de_contruction.jpg

tags:
  - "symfony"
  - "zend framework 2"
  - "MVC"

sites:
  - "Développement"

summary: "Oh la la !! Festival de nouveautés ! J'ai fait plein de trucs pendant mon silence (pas tant que ça mais quand même :)) et me revoila pour vous dire ce que j'ai compris. Je suis contente parce que comme j'ai appris de nouveaux sujets, j'ai de quoi parler ici."
---

Oh la la !! Festival de nouveautés !

Dernièrement, je :

- ai installé un projet en Symfony 3,
- ai installé un projet avec le nouveau MVC Skeleton Application de Zend Framework. Maintenant que Zend Framework est tout éclaté en composants "indépendants", je suppose qu'il faut plus parler des versions de chacun des composants. Pour ma part, j'ai suivi leur tutoriel et j'ai installé le skeleton qui est mis à disposition actuellement, soit la version d'août 2016 (probablement la version 3.0.x du skeleton... hum hum, un fichier VERSION.md à la racine pourrait être utile),
- me suis découvert une étrange passion pour les tests unitaires,
- ai lu la <a href="https://tools.ietf.org/html/rfc6749">spec de Oauth</a> que je ne sais ABSOLUMENT pas prononcer sans avoir l'air de bégayer,
- n'ai pas fait mes comptes, ce qui est une véritable catastrophe mais vous vous en fichez bien.

Par voie de conséquence, j'ai plein de choses à vous dire. ^^

## Comparatif Symfony - Zend Framework

Avant de passer aux choses sérieuses, je souhaite ajouter un complément à mon comparatif Symfony / Zend Framework, ayant tâté des deux maintenant.

#### Zend Framework

Il faut savoir que PAR DEFAUT, dans un projet Zend Framework basé sur l'installation d'un Skeleton Application, il n'y a RIEN d'installé. Juste le strict minimum et cela revient à parler d'un lot minimum minimonum. (il faut lire : QUASIMENT RIEN d'installé... bien sûr qu'il y a des trucs installés, vous pouvez trouver la <a href="https://docs.zendframework.com/zend-mvc/services/#servicemanager">liste des services installés dans une application MVC de Zend Framework ici</a>

C'est parce que la team de Zend Framework préfère laisser au développeur (qui utilise le skeleton application) de choisir lui même les services (composants) dont il a besoin.

Ainsi, si vous avez une très vieille version du skeleton application, **composer** installe TOUS les composants de Zend Framework (pas le choix, à l'époque, c'était tout ou rien) mais il n'y avait pas forcément de services correspondant aux composants qui s'installaient.

Désormais, sur les nouvelles versions du skeleton application, depuis que Zend Framework a été séparé en plusieurs composants indépendants, **composer** n'installe QUE les composants nécessaires, ce qui réduit DRASTIQUEMENT la liste des composants installés.

#### Symfony

Côté Symfony, tous les composants sont installés (à vérifier) mais le niveau d'exigence de Symfony pour les composants nécessaires à une application web est différent. DE BASE, Symfony monte tout un tas de services, qu'on le veuille ou non.

#### Comparatif

**Tous les composants de base pour gérer la mécanique MVC**
*Installés par défaut sur ZF, Installés par défaut sur SF*
- Gestionnaire de route,
- Gestionnaire de requête,
- Gestionnaire de réponse,
- Gestionnaire de controlleur,
- Gestionnaire de vue.

Ce sont des composants qui permettent de faire le *hello world !*de base :)

**Gestionnaire de service**
*Par défaut sur ZF, par défaut sur SF*
Zend Framework l'appelle le **Service Manager** (ou bien **Container** récemment) et Symfony l'appelle **Container**.

Je ne connais pas de commande sur Zend Framework pour voir tous les services qui sont montés sur votre application.

Symfony, de son côté, a une commande sur la console qui permet de lister l'intégralité des services disponibles. Ce que je trouve hyper pratique.

**Gestionnaire d'événements**
*Par défaut sur ZF, par défaut sur SF*
Zend Framework l'appelle l'**Event Manager** (composant **Event Manager**). Symfony l'appelle le **Dispatcher** (ou **event-dispatcher**).

Ici aussi, pas de commande connue côté Zend Framework pour identifier tous les événements qui existent dans votre applicatin.

Côté Symfony, il y a une console pour lister tous les événements qui sont écoutés. Si vous créez un événement, qu'il est déclenché mais qu'il n'existe aucun listener sur votre application, il ne peut pas être listé...

**Gestionnaire de module**
*Par défaut sur ZF, probablement par défaut sur SF*
Zend Framework, c'est le **module manager**. Côté Symfony, un module est un **Bundle**. Mais je ne connais pas le nom du composant qui gère les bundles...

**Session**
*Pas sur ZF, par défaut sur SF*
Symfony a une session qui tourne par défaut quand vous installez une application Symfony. Alors ne surtout pas créer votre propre session ou bien vous aurez des surprises sur la persistence de vos données.

Côté Zend Framework, la session n'est pas présente par défaut. Il faut instancier un objet Session si vous souhaitez utiliser la session.

**Log**
*Pas sur ZF, par défaut sur SF*
Symfony utilise la librairie **Monolog** pour journaliser par défaut tout ce que lui-même fait sur une application Symfony. Il ne tient plus qu'à vous d'utiliser le même service pour logger vos propres informations.

Côté Zend Framework, constant avec lui-même : si vous voulez des logs, installez **Zend-log** pour commencer (ou bien n'importe quel autre module de log à votre convenance) et ajouter ce service à votre gestionnaire de service (vous arrêtez pas sur la difficulté d'ajouter votre service au gestionnaire de service, vous trouverez la doc facilement sur la doc de Zend Framework.)

**Base de données**
*Pas sur ZF, par défaut sur SF*
Symphony utilise **Doctrine ORM** pour gérer l'intéraction avec la base de données. Et par défaut, Symfony considère que vous avez besoin d'une base de données dans une application Symfony. Du coup, vous avez les services Doctrine présents à l'installation. Pour le coup, je trouve cette décision un peu arbitraire. J'ai plusieurs exemples de tests et de manipulation pour lesquels je n'ai pas de bases de données. Après, vous me direz, si ça ne gêne pas...

Zend Framework, de son côté, reste fidèle à lui-même. Si vous souhaitez utiliser **Zend-db**, depuis les dernières versions, il faut installer Zend-db. Du coup, contrairement aux anciennes versions où vous aviez l'impression d'installer Doctrine ORM EN PLUS DE Zend db, dans les versions récentes, vous pouvez installer Doctrine, Zend-db ne fait MEME PAS parti du paysage, à moins que vous l'ayez décidé.

Ah oui, non, en fait, le module qui fait connecteur entre Zend Framework et Doctrine ne marche pas pour la version Zend MVC 3.0 (ce qui est un peu le module de tous les derniers skeleton application... ce qui est vraiment bête...) En attendant, il semblerait qu'on trouve d'autres modules pour brancher Doctrine et ZF sur packagist... à voir.

***

Sur ce, si je vois autre chose, je vous en parlerais à n'en pas douter. Je vous donne rendez vous prochainement pour parler d'intégration continue.
