---
title: "Installer Drupal sur l'hébergeur Online.net"
permalink: "fr/posts/installer-drupal-sur-lhebergeur-onlinenet.html"
date: "2013-03-20T16:25"
slug: installer-drupal-sur-lhebergeur-onlinenet
layout: post
drupal_uuid: 4a93c33a-2f66-41e5-9659-0716bf6ee58a
drupal_nid: 31
lang: fr
author: haclong

media:
  path: /img/teaser/_ben2585.jpg
  credit: "Benedict Chui"

tags:
  - "Drupal"
  - "HOWTO"
  - "Online.net"
  - "redirection rules"

sites:
  - "Développement"

summary: "Il y a quelques temps, j'ai écrit un article sur l'installation de Drupal dans un sous répertoire. Voici une version actualisée du process."
---

Il y a quelques temps, j'ai écrit un article sur l'<a href="http://haclong.long2.net/en/content/installing-drupal-subdirectory.html#overlay-context=en" target="_blank">installation de Drupal dans un sous répertoire</a>. Voici une version actualisée du process.

### L'hébergeur

Mon hébergeur est <a href="http://www.online.net" target="_blank">Online.net</a>. Comme je n'ai aucune compétence à la maintenance d'un serveur de production, que je ne prétends pas en avoir et, au dessus de tout ça, je ne souhaite pas du tout en avoir, j'ai opté pour une de leur offre Hébergement.

Chez Online, en FTP, on a accès à des répertoires racines qui correspondent chacun à un des sous domaines. Par exemple, sur l'espace FTP, le répertoire /www va correspondre à l'adresse <a href="http://www.mondomaine.com">http://www.mondomaine.com</a> et le répertoire /forum va correspondre à l'adresse <a href="http://forum.mondomaine.com">http://forum.mondomaine.com</a>.

### Le besoin

Je veux utiliser Drupal pour gérer la page d'accueil de mon site. Toutefois, afin de ne pas mélanger les fichiers de Drupal avec des fichiers d'autres packages que je serais amenée à utiliser, je souhaite que le package Drupal soit installé dans un répertoire dédié.

### L'installation du package

- Pour installer Drupal, télécharger la version de Drupal que vous souhaitez utiliser. Ce tutoriel convient pour la version 6.x et la 7.x.
- Dézipper le package et laisser reposer
- Connectez vous sur votre espace FTP (mis à disposition gracieusement par votre hébergeur)
- Sur le répertoire correspondant au sous-domaine que vous souhaitez utiliser (`/www`), créer un répertoire `/drupal`
- Uploader le package Drupal vers le répertoire `/drupal`. Là, si vous tester votre installation Drupal à cette adresse : <a href="http://www.mondomaine.com/drupal">http://www.mondomaine.com/drupal</a>, vous obtiendrez une erreur 500 qui va commencer gentiment à vous stresser...

### www/.htaccess

Pour commencer, on va créer un fichier `.htaccess` que l'on va mettre à la racine.

Nous avons désormais cette arborescence

```
//www/
drupal/
// package drupal entièrement dézippé
.htaccess
```

Editez le fichier `.htaccess`

```sh
# ajouter ces lignes pour l'hébergeur Online.net utilise le moteur php5 pour les fichiers .php
AddType application/x-httpd-php5 .php

RewriteEngine On
# paramétrer la redirection d'url
RewriteCond %{DOCUMENT_ROOT}/drupal%{REQUEST_URI} -f
RewriteRule .* drupal/$0 [L]
RewriteRule .* drupal/index.php?q=$0 [QSA]
```

### www/drupal/.htaccess

Nous allons maintenant nous occuper du fichier `.htaccess` fourni par défaut par Drupal

Editer le fichier `.htaccess`

```js
// ajouter ces lignes pour l'hébergeur Online.net utilise le moteur php5 pour les fichiers .php
AddType application/x-httpd-php5 .php

// modifier ces lignes pour l'hébergeur Online.net qui n'autorise pas la commande Options.
# Don't show directory listings for URLs which map to a directory.
// mettre la ligne d'origine du .htaccess de Drupal en commentaire
Options -Indexes

// modifier ces lignes pour l'hébergeur Online.net.
# Follow symbolic links in this directory.
// mettre la ligne d'origine du .htaccess de Drupal en commentaire
#Options +FollowSymLinks

// Laisser le reste du fichier tel quel
```

Normalement, vous devriez maintenant accéder à la page d'installation de Drupal. Suivez les instructions pour avoir votre site tout beau tout propre.

<a href="http://www.mondomaine.com">http://www.mondomaine.com</a> devrait vous afficher la page par défaut de Drupal maintenant.

### www/drupal/sites/default/files/.htaccess

Si vous comptez utiliser les fonctionnalités d'upload de Drupal (upload d'images par ex), le script d'installation de Drupal va créer un repertoire `www/drupal/sites/default/files/` dans lequel on trouvera un fichier `.htaccess`.

Editer ce fichier `.htaccess`

```js
SetHandler Drupal_Security_Do_Not_Remove_See_SA_2006_006
// mettre les lignes d'origines du .htaccess de Drupal en commentaire
Options None
#Options +FollowSymLinks
```

### Installer un fichier googleXXXX

Maintenant qu'on a bien joué avec les redirections d'URL, comment installer le fichier `googlexxxxxx.html` que **Google Webmaster Tools** vous demande d'installer à la racine de votre site ?

- Enregistrer le fichier `googlexxxxxx.html` fourni par **Google Webmaster Tools**
- Se connecter sur l'espace FTP du site (chez Online donc).
- Déposer le fichier `googlexxxxxxx.html` dans le répertoire `drupal/`
- Editer le fichier `www/.htaccess` et modifier les règles de redirections d'URL

```js
# ajouter ces lignes pour l'hébergeur Online.net utilise le moteur php5 pour les fichiers .php
AddType application/x-httpd-php5 .php

# paramétrer la redirection d'url
RewriteEngine On
// Ajouter cette ligne pour que la redirection d'url ne fonctionne pas pour le fichier googlexxxx.html
RewriteCond %{REQUEST_URI} !^googlexxxxxxxxxxx\.html$ [NC]
RewriteCond %{DOCUMENT_ROOT}/drupal%{REQUEST_URI} -f
RewriteRule .* drupal/$0 [L]
RewriteRule .* drupal/index.php?q=$0 [QSA]
```

### Installer des packages dans d'autres sous répertoires

Si vous installez d'autres packages, chacun dans son sous répertoire pour que tout soit bien propre, vous allez avoir un problème parce que les règles de redirection édictées dans le premier fichier `.htaccess` va systématiquement vous rediriger vers Drupal et Drupal ne va pas comprendre quand vous voudrez afficher un fichier `index.php` qui ne correspond pas au fichier `index.php` de Drupal.

Pour cela, il faut modifier les règles de redirections d'URL dans le fichier `www/.haccess`

```js
# ajouter ces lignes pour l'hébergeur Online.net utilise le moteur php5 pour les fichiers .php
AddType application/x-httpd-php5 .php

# paramétrer la redirection d'url
RewriteEngine On
RewriteCond %{REQUEST_URI} !^googlexxxxxxxxxxx\.html$ [NC]
// Ajouter cette ligne pour que la redirection d'url ne fonctionne pas pour le répertoire wiki
RewriteCond %{REQUEST_URI} !wiki/
RewriteCond %{DOCUMENT_ROOT}/drupal%{REQUEST_URI} -f
RewriteRule .* drupal/$0 [L]
RewriteRule .* drupal/index.php?q=$0 [QSA]
```

Dans le sous répertoire `/wiki/`, il faut ajouter ces lignes au fichier `.htaccess` existant ou bien ajouter un fichier `.htaccess` avec ces lignes

```js
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} -s [OR]
RewriteCond %{REQUEST_FILENAME} -l [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^.*$ - [NC,L]
```

Vous avez maintenant une arborescence de ce type

```
//www/
drupal/
   .htaccess
   // package drupal entièrement dézippé
   googlexxxxxx.html
wiki/
   .htaccess
   // package wiki entièrement dézippé
.htaccess
```

Lorsque vous saisissez cette adresse dans votre navigateur

<a href="http://www.mondomaine.com">http://www.mondomaine.com</a> -> vous obtenez votre site sur Drupal

<a href="http://www.mondomaine.com/wiki">http://www.mondomaine.com/wiki</a> -> vous obtenez votre wiki

<a href="http://www.mondomaine.com/googlexxxxxx.html">http://www.mondomaine.com/googlexxxxxx.html</a> devrait être valide pour Google Webmaster Tools
