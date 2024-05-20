---
title: "Je passe à Zend Framework 2 !!"
permalink: "fr/posts/je-passe-zend-framework-2.html"
date: "2013-03-26T18:11"
slug: je-passe-zend-framework-2
layout: post
drupal_uuid: 88a8c78e-d570-41ac-9351-84a27cc3a65e
drupal_nid: 32
lang: fr
author: haclong

media:
  path: /img/teaser/ZendFramework.png
  credit: "zend framework"

tags:
  - "zend framework 2"
  - "web application"
  - "gandi"

sites:
  - "Développement"

summary: "Finalement, au rythme où je vais, deux options s'offrent à moi : soit je finis mes applications en Zend Framework 1 et j'enchaine direct avec leur refactoring en Zend Framework 2, soit je passe directement à Zend Framework 2 en reprenant tout depuis le début avec la nouvelle librairie.
"
---

Finalement, au rythme où je vais, deux options s'offrent à moi : soit je finis mes applications en Zend Framework 1 et j'enchaine direct avec leur refactoring en Zend Framework 2, soit je passe directement à Zend Framework 2 en reprenant tout depuis le début avec la nouvelle librairie.

Comme pour la plupart du temps, le choix final se fera suite à un concours de circonstances d'une part et à une bonne réflexion d'autre part. L'argument déterminant reste le choix tout récent d'un nouvel hébergeur. J'ai souscrit à une solution <a href="https://www.gandi.net/hosting/" target="_blank">Simple Hosting chez Gandi</a>, en plus de l'hébergement mutualisé que j'ai déjà chez <a href="http://www.online.net" target="_blank">Online</a>.

### Installer une application Zend Framework 2

Comme pour Zend Framework 1, il faut télécharger un squelette d'application qui servira de structure de base pour le développement d'une application web. L'offre Simple Hosting de Gandi est presque parfaite pour suivre les instructions d'installation de l'application tel que recommandées dans le manuel de Zend Framework 2. Sur l'espace d'hébergement Gandi en Simple Hosting, vous pouvez avoir git d'une part, l'accès à la console d'autre part en se connectant en SSH et une connexion FTP classique (SFTP en fait, mais c'est pratiquement pareil). Il est donc aisé de suivre le manuel de Zend Framework et d'installer son application en utilisant le fameux <a href="http://getcomposer.org/" target="_blank">Composer</a>.

Toutefois, pour ceux qui ont des solutions d'hébergements mutualisés, je sais que tous les hébergeurs n'offrent pas autant de possibilités. Je vois deux difficultés majeures :

- l'impossibilité d'accéder aux outils en ligne de commande : `git` et `composer`, et
- la structure d'un espace d'hébergement où il n'y a pas de répertoire `public/` à part, permettant la sécurisation des fichiers de l'application hors de l'espace d'accès public.

Il y a pour ma part 3 cas possibles. Essayons de déterminer dans quel cas vous vous situez. Le but de ce test est d'afficher le fameux "Hello world !" lorsque vous vous connectez sur <a href="http://mon.domaine.tld">http://mon.domaine.tld</a>

1. Pour cela, créez un fichier `index.html` dans lequel vous aurez écrit une page HTML basique avec le fameux "Hello World !".
2. Connectez vous en FTP sur votre hébergement pour déposer votre fichier.

  - Si vous déposez le fichier dans ***/mon.domaine/public/index.html*** : vous êtes dans le **cas A**
  - Si vous déposez le fichier dans ***/mon.domaine/autre_repertoire_public/index.html*** : vous êtes dans le **cas B**
  - Si vous déposez le fichier dans ***/mon.domaine/index.html*** : vous êtes dans le **cas C**

A titre indicatif, si vous êtes hébergé par Gandi, vous êtes dans le cas B et si vous êtes hébergé par Online, vous êtes dans le cas C.

#### Voici comment adapter l'installation d'une application Zend Framework 2.

Maintenant que nous avons une idée de la situation d'hébergement que vous avez, nous pouvons installer notre application.

1. Téléchargez le <a href="https://github.com/zendframework/ZendSkeletonApplication" target="_blank">squelette d'application</a> mis à disposition sur github.
2. Dézippez le.
3. (Ré)-organisez les répertoires :
  - Si vous êtes dans le cas A, vous n'avez rien à faire
  - Si vous êtes dans le cas B, renommez le répertoire `public/` du squelette d'application par le nom fourni par votre hébergeur (***autre_repertoire_public/***)
  - Si vous êtes dans le cas C et que vous êtes un crack en redirection d'URL ce qui n'est pas mon cas, vous gardez le répertoire `public/` et vous écrivez le fichier `.htaccess` qui va bien. Mais si vous êtes un crack en redirection d'URL, normalement, vous n'avez pas besoin de suivre ce tutoriel.
  - Si vous êtes dans le cas C et que vous ne comprenez rien à la redirection d'URL comme moi, vous déplacez le contenu du répertoire `public/` et vous remontez tout d'un niveau. Normalement, les répertoires `css/`, `js/` et `img/` ainsi que les deux fichiers `.htaccess` et `index.php` se retrouvent au même niveau que les autres répertoires du squelette (`config/`, `vendor/`, `module/` et `data/`). Attention, si vous êtes dans le cas C mais que vous utilisez `git` et/ou `composer`, il faut modifier les chemins dans les fichiers qui vont bien. Ce cas de figure n'est pas traité ici.
4. Dans chacun des répertoires de l'application, il faut mettre un fichier `.htaccess` pour protéger les fichiers de l'application. Le fichier `.htaccess` comprend une ligne unique :
```sh
 deny from all
```
5. Déposez les fichiers et répertoires à la racine de votre espace d'hébergement (répertoire **mon.domaine**)

On vient de déposer le squelette d'application de Zend Framework 2. Il nous reste à mettre en place la librairie. Cette partie est prise en charge par **Composer** si vous pouvez accéder à **Composer**. Si vous n'accédez pas à **Composer**, comme pour la majorité des personnes en hébergement mutualisé, voici ce qu'il faut faire :

1. Téléchargez la <a href="http://framework.zend.com/downloads/latest" target="_blank">version minimale</a> de la librairie Zend Framework 2.
2. Dézippez l'archive.
3. Renommez le répertoire `ZendFramework-minimal-2.1.4/` en `ZF2/`.
4. Déposez le répertoire `ZF2/` dans le répertoire `vendor/` du squelette d'application.

Ouvrez un navigateur et connectez vous sur votre site.

En principe, ça devrait marcher.

### Derniers réglages

Si vous souhaitez faire l'installation dans un sous-répertoire, il faut modifier le fichier `index.php`. Pour ajuster les chemins si nécessaire, il faut éditer le fichier `index.php` et modifier la ligne 6

```php
chdir(dirname(__DIR__)) ;
```

Cette ligne pointe en pratique sur le répertoire qui comprend tous les répertoires de l'application : `config/`, `vendor/`, `module/` et `data/`. Si vous déplacez vos répertoires de l'application, il faut modifier cette ligne et lui indiquer le nouveau chemin des répertoires.

### Installation en localhost

Le plus simple reste quand même de faire toute l'installation sur votre serveur apache/php local, faire les développements et tout envoyer sur votre hébergement en FTP...
