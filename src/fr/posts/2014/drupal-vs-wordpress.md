---
title: "Drupal vs Wordpress"
permalink: "fr/posts/drupal-vs-wordpress.html"
date: "2014-06-28T12:23"
slug: drupal-vs-wordpress
layout: post
drupal_uuid: 19490aa4-68ec-40f1-8750-7e1187ce7106
drupal_nid: 80
lang: fr
author: haclong

media:
  path: /img/teaser/wordpressVdrupal.jpg

tags:
  - "Drupal"
  - "Wordpress"
  - "CMS"

sites:
  - "Haclong projects"

summary: "Vous voilà prêt, vous voilà tout chaud sur les chapeaux de roues prêt à en découdre avec la toile... Vous allez affronter le monde entier, crier au monde vos passions, vos coups de coeur, vos coups de gueule... Vous allez avoir votre propre site !!

Mais voilà... Où ? Quand ? Comment ? et finalement, lequel ? Face à la centaine d'options et de possibilités qui s'offraient à vous, vous hésitez encore entre Wordpress et Drupal... Wordpress ? Drupal ?"
---

Vous voilà prêt, vous voilà tout chaud sur les chapeaux de roues prêt à en découdre avec la toile... Vous allez affronter le monde entier, crier au monde vos passions, vos coups de coeur, vos coups de gueule... Vous allez avoir votre propre site !!

Mais voilà... Où ? Quand ? Comment ? et finalement, lequel ? Face à la centaine d'options et de possibilités qui s'offraient à vous, vous hésitez encore entre Wordpress et Drupal... Wordpress ? Drupal ?

### Les solutions

Pour créer son propre site, Dieu merci, de nos jours, plus la peine de connaître la programmation. Il y a des choses toutes prêtes pour ça, il n'y a qu'à se servir. Parmi ces choses, il y a les CMS. **Drupal** et **Wordpress** en sont des représentants mais ils ne sont pas seuls dans cette catégorie. Ce sont toutefois les seuls que j'ai testé à ce jour, du coup, plutôt que de répéter le ressenti glané sur le web sur d'autres outils, je préfère vous présenter ces deux là.

### Les prérequis techniques

**<a href="https://www.drupal.org/" target="_blank">Drupal</a>** et **<a href="http://wordpress.org/" target="_blank">Wordpress</a>** sont équivalents : deux packages en PHP, sur la même version de PHP à quelques versions mineures près, avec une base de données MySQL derrière pour stocker les données. En principe, vous ne devriez avoir aucun problème pour trouver un hébergeur convenable pour votre site avec ce type de prérequis.

**Wordpress** propose toutefois une solution d'hébergement en ligne, sur <a href="https://wordpress.com/" target="_blank">Wordpress.com</a>. Nous ne parlerons pas du tout de cette solution.

### L'installation

Pour installer les deux (on ne parle donc pas de Wordpress.com mais d'un package Wordpress à installer soi même), il faut se munir des informations de votre base de données : code utilisateur (user), nom de la base (base), mot de passe (password) et adresse de votre base (host).

Il faut dézipper l'archive de chacun des deux packages. A l'adresse, dans le navigateur, la page d'installation devrait apparaître à l'écran. On y définit le nom du site, le nom de l'administrateur et les informations de connexion à la base de données. **Drupal** le fait en plusieurs écrans alors que **Wordpress** a une installation plus rapide. Les deux solutions ont une installation en anglais sur leur site d'origine mais les versions traduites du package se trouve assez facilement sur la toile.

**Drupal** propose en plus une installation multilingue (il faut télécharger <a href="https://www.drupal.org/project/l10n_install" target="_blank">le bon package</a>) qui ajoute une étape à l'installation et qui permet d'installer **Drupal** dans la langue de notre choix, l'installeur se chargeant de télécharger les fichiers de langues qu'il faut.

Une fois installé, c'est là, à mon humble opinion, que ça se corse.

### La prise en main

Les deux sites d'administration (back office) sont équivalents mais on va découvrir rapidement que celui de **Drupal** peut rapidement se densifier.

**Wordpress** est à mon sens plus simple à prendre en main. Il comprend dans son core des fonctionnalités qui facilite beaucoup la vie d'un bloggeur moyen :

- la réécriture d'url, pour avoir des chemins plus simples et, au passage, un SEO conforme à ce qui se fait de nos jours,
- le titre de l'article affiché dans le titre du navigateur (conforme aux recommandations SEO)
- un éditeur de texte wysiwyg complet et fonctionnel avec insertion d'image dans chaque article.
- la possibilité de "programmer" un article afin qu'il s'affiche à la date prévue.

Il n'y a toutefois aucune options pour gérer le multilingue en natif dans **Wordpress**.

Pour **Drupal**, l'installation donne accès à une solution qui semble austère. Si on vient de **Wordpress**, on va s'apercevoir que la réécriture d'url n'est pas implémentée par défaut dans le core de **Drupal**. Il faut donc installer un, voire plusieurs modules pour avoir accès à cette fonctionnalité.

De même, le titre de l'article dans le titre du navigateur ou même l'interface utilisateur comprenant l'insertion d'images et/ou l'éditeur WYSIWYG n'est pas installé dans le core non plus.

En revanche, **Drupal** a d'autres cordes à son arc qui peut faciliter la vie d'un site associatif par ex :

- possibilité d'étendre les fonctionnalités de son site avec
- des sondages avec des choix multiples,
- des forums et
- des pages hiérarchisées en livres (ou manuel)
- un formulaire de contact
- possibilité d'avoir des articles en plusieurs langues
- et concernant les permissions des utilisateurs, possibilité de créer un nombre infini de rôles.

Mon sentiment avec **Drupal**, c'est qu'il faut installer beaucoup de modules complémentaires au package d'origine pour réussir à avoir ce qu'on pourrait qualifier d'un "blog-de-base"... L'enjeu est alors de savoir ce qu'on entend par "de-base". Je peux difficilement imaginer un **Drupal** tout sec, sans modules complémentaires. En fait, pour mon utilisation, certains modules sont tellement indispensables que j'aurais tendance à me demander pourquoi ils ne sont pas inclus par défaut dans la distribution de base... Je me rends bien compte que s'ils étaient vraiment indispensables, ils y seraient, dans le package de base...

### Extension

Pour étendre son **Wordpress**, on peut rechercher à partir des pages de son site le thème ou le plugin **Wordpress** qui convient et installer le plugin ou le thème en quelques clics. C'est très très pratique et c'est un confort d'utilisation que j'apprécie.

Toutefois, c'est mon ressenti personnel, je trouve que le dépôt de plugin **Wordpress** est plutôt anarchique. Il y a beaucoup de projets qui portent les mêmes noms, qui font les mêmes choses. Il faut être attentif parce que ce qui différencie un plugin d'un autre peut être soit son activité (activement maintenu ou pas), soit la présence d'une option en plus ou en moins.

Pour **Drupal**, les extensions (thèmes et modules) se trouvent sur le site de <a href="https://www.drupal.org/download" target="_blank">Drupal.org</a>. Il faut faire ses courses là-bas et, depuis la version 7, soit copier l'URL de l'archive du module (ou thème) pour l'installer à partir de l'administration du site, ou télécharger l'archive, la transférer en FTP dans les répertoires de son site **Drupal** et activer le module installé. Somme toutes, il y a pas mal de manipulation pour installer une extension, même si la possibiliter de donner l'URL du module et laisser **Drupal** faire le reste est déjà un confort (par rapport à la version 6).

Comme pour **Wordpress**, il y a beaucoup de modules redondants, mais certains modules ont su s'imposer par rapport aux autres dans leur domaine et sont reconnus par la communauté entière. Vous trouverez par ex difficilement un module concurrent à Views ou un concurrent à Panel. En revanche, effectivement, si vous recherchez un module pour gérer les média sociaux, c'est actuellement l'anarchie... Il y en a partout et pour tout le monde...

**Drupal** a beaucoup de modules qui sont indispensables aux autres modules... Des sortes de librairies communes. Qui, toujours d'après mon sentiment, ne sont utilisées que par un seul module (sentiment nécessairement arbitraire, souvenez-vous en)... Du coup, vous vous retrouvez rapidement à installer plusieurs modules pour une seule fonctionnalité. De même, là où un plugin **Wordpress** calcule, affiche et choisit en même temps, **Drupal** va parfois favoriser un module pour calculer, un module pour afficher et enfin un module pour choisir... Résultat : une démultiplication galopante des modules installés pour **Drupal** avec une gestion claire des dépendances entre modules. Même si le sentiment d'installer un module de plus est assez irritant, l'écosystème des modules **Drupal** est plutôt stable, les pages respectives de chaque module avertissant clairement s'il y a des risques d'incompatibilité avec l'un ou l'autre des modules.

### Customisation

Concernant les possibilités de personnalisation et d'amélioration, à mon sens, **Drupal** l'emporte haut la main. En utilisant l'interface d'administration seule, il est possible d'étendre certains composants du package (hors modules complémentaires).

**Drupal** comme **Wordpress** possèdent deux types de posts différents : les **articles** d'une part, qui sont généralement la partie "vivante" de votre blog, et les **pages** statiques d'autre part, qui sont la partie constante du site. En plus de ces deux types de posts, **Drupal** permet de créer d'autres types de posts, totalement au choix de l'utilisateur. Pour chacun des types de posts, il est possible d'ajouter autant de nouveaux champs que l'on souhaite, incluant des champs média pouvant constituer une gallerie, des listes déroulantes d'options et des champs de saisie de texte libre. Grâce à cette possibilité, **Drupal** peut permettre de monter assez rapidement des articles de types fiches techniques ou fiche d'annuaires ou même des FAQ, incluant beaucoup de champs prédéfinis afin de catégoriser et typer les fiches. Cette possibilité permet à **Drupal** d'étendre ses fonctionnalités au delà du blog et/ou des sites d'informations vers des sites communautaires, des applications de type gestion de projet, ou des bases de connaissance.

En plus des rôles définis par défaut par **Drupal**, il est possible de rajouter autant de rôle qu'on le souhaite et, pour chacun des rôles créés, il est possible de donner accès à des fonctionnalités ou à des composants particuliers incluant l'accès à certains types de posts mais pas à d'autres et même l'accès à certains champs d'un type de post et pas à d'autres.

Pour améliorer et personnaliser chez **Wordpress**, on se retrouve assez rapidement à éditer les scripts php de **Wordpress** et altérer le code source du package assez vite. On trouve ainsi multitudes de tutoriaux, y compris dans le <a href="http://codex.wordpress.org/fr:Accueil" target="_blank">**Codex** </a>de **Wordpress** pour expliquer quelle est la fonction à utiliser pour arriver à ses fins. Les tutoriaux étant assez simple et la structure des fichiers de **Wordpress** également claire, un bloggeur motivé peut facilement mettre les mains dans le moteur et bidouiller le code de son site sans trop de craintes (quoi que...). Peut être parce que je n'ai jamais essayé et peut être parce que **Drupal** applique une séparation des concepts plus stricte, il y a très peu de tutoriaux pour "bidouiller" son **Drupal**. Sinon, on passe assez rapidement du côté des équipes de développement de **Drupal** (module, thème ou core).

Dans cette optique, **Drupal** propose beaucoup de thèmes de base à partir desquels un chacun peut appliquer sa propre personnalisation en utilisant les librairies javascript et/ou css livrées dans le thème de base pour positionner les composants de son site. Là encore, **Drupal** considère que sa responsabilité est de délivrer du contenu. Le web designer applique le thème qu'il a créé en utilisant ses compétences en expérience utilisateur. Il devient d'ailleurs de plus en plus difficile de trouver un thème décent et prêt à l'emploi pour **Drupal**.

Afin d'assister le web designer, **Drupal** a à disposition des modules pour rationaliser et uniformiser les tailles des fichiers média indépendamment du thème utilisé.

Du côté de **Wordpress**, je trouve que la séparation des concepts est plus floue. En fonction du thème que vous aurez choisi pour votre site, vous pourrez avoir la possibilité de faire des rendus "différents" en fonction des formats mis à disposition par le thème installé. Ca me gêne (même si cela contribue à la richesse du thème choisi) parce qu'au moment où on crée son contenu, on choisit également son rendu. Or, un contenu doit être différencié d'un autre contenu de par sa nature (ou sa fonction ou son propos) mais non pas par son rendu. Cela signifie que pour **Wordpress**, il faut être capable, à la fois, de distinguer sémantiquement son contenu et choisir son rendu en plus. Il faut plus de discipline de ce côté puisque **Wordpress** - nativement - est très peu directif sur ce point.

**Drupal** est un package plus lourd parce que une grosse partie de sa customisation se fait soit par modules interposés, soit directement dans son core.

**Wordpress** offre des modules dans une certaine mesure mais dès qu'on souhaite personnaliser son site, il semblerait qu'il faille utiliser surtout le php directement.

### Administration

La mise à jour du core de **Wordpress** se fait soit automatiquement, soit un message sur l'administration de **Wordpress** nous invite à mettre le site à jour en cliquant sur un bouton, sur le site.

Du côté de **Drupal**, d'après configuration, un mail peut être envoyé à l'administrateur pour recommander d'installer la dernière version du core. La mise à jour d'une version mineure de **Drupal** nécessite le téléchargement de l'archive de **Drupal**, le lancement d'un client FTP, la sauvegarde des fichiers de configuration et de la base de données par sécurité, la mise en maintenance du site **Drupal**, la mise à jour des fichiers **Drupal** par FTP, la mise à jour de la base de données par script, la réactivation du site **Drupal**... Du lourd donc...

La mise à jour des thèmes, plugins et modules se fait toute seule, à partir des deux sites d'administration, en cliquant sur les liens "Mettre à jour" qui vont bien... Toutefois, du côté de **Wordpress**, à la mise à jour d'une version du core de **Wordpress**, un plugin peut se désactiver automatiquement parce que sa compatibilité avec la nouvelle version du core n'a pas été vérifié et que le développeur ne peut assurer la compatibilité de son plugin. Cela peut s'avérer extrêmement gênant surtout si vous avez confié l'utilisation du site à un noob et que vous ne repassez que très rarement sur l'administration du site pour dépanner votre noob... Aucun mail n'est parti pour vous prévenir...

A contrario, ce n'est pas parce qu'un plugin ne s'est pas désactivé qu'on peut garantir sa compatibilité avec le nouveau core...

**Drupal** semble garantir ses versions majeures. Un module fonctionne toujours sur la même version majeure de **Drupal** et ce, malgré les différentes mises à jour du core. En revanche, il n'y a aucune compatibilité entre deux versions majeures de **Drupal**. Cela signifie qu'il y a nécessairement une migration à prévoir lorsqu'on décide de changer de version (majeure) de **Drupal**. Concernant la communauté **Drupal**, cela signifie également qu'il faut redévelopper son module pour la nouvelle version de **Drupal**. Cela signifie enfin que le développeur d'un module peut décider de ne plus maintenir son module pour la version suivante de **Drupal**.

### En définitive...

En définitive, **Wordpress** et **Drupal** sont deux outils complets et performants. En revanche, il est important de mesurer à l'avance pour quelle utilisation ils sont destinés.

**Wordpress** s'adresse à des bloggeurs essentiellement. La possibilité que **Wordpress** offre de pouvoir hacker directement son core permet effectivement à n'importe quel utilisateur de faire ce qu'il souhaite de l'outil. Toutefois, je considère que lorsque j'utilise un outil réputé "clé en main", ce n'est pas pour le hacker lourdement pour arriver à mes fins. Surtout qu'il existe d'autres outils qui permettent d'y arriver. Mais ce n'est que mon opinion personnelle...

**Drupal** s'adresse à des communautés ou des sites plus ambitieux qui sortent du schéma du blog "simple". La possibilité de définir d'autres typologies de contenu permet d'étendre l'utilisation de l'outil pour créer soit des base de données de connaissances, des annuaires, des catalogues, des aggrégateurs de flux, la gestion d'un site communautaire... Son installation et les modules prérequis au lancement en font toutefois rapidement un outil très dense. Je pense qu'on peut faire l'économie de certains modules mais il faudrait alors hacker volontairement **Drupal**...

En définitive, si le projet est défini et qu'il se limite aux capacités de **Wordpress**, je choisirais cet outil pour son confort d'utilisation et sa simplicité.

Mais si le projet commence dans le flou avec le discours qui finit en "et on verra..." (notez bien les trois petits points), alors j'aurais tendance à préférer **Drupal**, m'assurant ainsi un maximum de souplesse et la possibilité d'adapter rapidement le site au besoin de l'utilisateur.
