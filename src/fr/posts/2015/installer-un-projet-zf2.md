---
title: "Installer un projet ZF2"
permalink: "fr/posts/installer-un-projet-zf2.html"
date: "2015-07-07T07:21"
slug: installer-un-projet-zf2
layout: post
drupal_uuid: 8537ca06-2743-43ae-885c-be237504d81a
drupal_nid: 139
lang: fr
author: haclong

media:
  path: /img/teaser/lego_pieces1.jpg

tags:
  - "zend framework 2"
  - "Netbeans"
  - "git"
  - "composer"
  - "ubuntu"
  - "github"
  - "SSH"
  - "HOWTO"

sites:
  - "Développement"

summary: "J'ai l'impression que je n'ai fait que des posts sur les installations de projets sur mon poste local. Pourtant, lorsque je cherche, je ne trouve rien... Bon, je n'ai pas beaucoup cherché non plus :p
Alors, pour moi, comme pour vous, voici ce que je fais, pour installer un projet."
---

J'ai l'impression que je n'ai fait que des posts sur les installations de projets. Pourtant, lorsque je cherche, je ne trouve rien... Bon, je n'ai pas beaucoup cherché non plus :p
Alors, pour moi, comme pour vous, voici ce que je fais, pour installer un projet.

**Voici ce qu'on va installer :**

- Un projet** ZF2 Application Skeleton** avec **composer**
- Un **dépôt git** avec un dépôt sur **github**

## Environnement

J'ai une machine **Ubuntu**, une installation **LAMP** standard avec un serveur **Apache2**.

Si vous n'avez pas un LAMP installé sur votre Ubuntu, j'ai une astuce : utiliser **Synaptic** (ou bien à la ligne de commande avec `apt-get`) et installer le package **phpmyadmin**. Pour fonctionner, **phpMyAdmin** a des dépendances (évidentes) sur **MySQL**, sur **PHP** et sur **Apache**. Du coup, vous faites une pierre quatre coups.

Après l'installation de votre LAMP, vous trouverez votre serveur web local à cette adresse (dans votre navigateur) : `http://localhost`.

## Les droits des fichiers

En cas où vous ne le sauriez pas, l'**utilisateur Apache**, qui doit accéder (à minima en lecture) à vos fichiers pour les afficher dans le navigateur, est `www-data:www-data`.

*Si vous souhaitez le changer, il faut retrouver où le faire dans les fichiers de configuration d'Apache.*

Il fut un temps, à chaque fois que j'installais un projet, je changeais les propriétaires des fichiers : tous les répertoires et tous les fichiers appartenaient à `mon user` et au `groupe du user d'Apache`.

`sudo chown -R {moi}:www-data *`

Avec un script, il était facile de changer tous les droits en quelques commandes. Toutefois, cela devenait rébarbatif.

Depuis peu, j'ai changé de stratégie. Mon user appartient désormais au groupe `www-data`. Ainsi, je n'ai plus besoin de changer les droits de mes fichiers. Par défaut, à l'installation (fait par mon user), les fichiers (et répertoires) appartiennent à mon user, mon groupe et le serveur Apache arrive à accéder à ces fichiers sans problème puisque mon user appartient également au groupe d'Apache. *Je ne suis pas sûr que l'explication soit juste juste mais ça marche...*

A toutes fins utiles, les droits sont **`775`** pour les répertoires et **`664`** pour les fichiers.

Il faut faire attention de ne pas utiliser la commande `sudo` pour installer votre projet. Si vous utilisez `sudo`, les fichiers appartiendront à `root:root`. Le serveur Apache ne pourra pas y accéder. Si cela arrivait, rien d'irréversible, utilisez la commande `chown` pour changer les propriétaires des fichiers et répertoires.

`sudo chown -R {moi}:www-data *`

Si vous avez des répertoires où le** user d'Apache** doit écrire (les logs, le cache...), il faut probablement réajuster les droits.

L'installation LAMP standard considère que votre répertoire web par défaut est `/var/www`. Toutefois, contrairement à ce qui est configuré par défaut, je préfère installer mes projets dans le répertoire de mon user. Je crée alors un répertoire dédié par projet (`/home/{moi}/monProjet`)

Généralement, dans ce répertoire, je crée un répertoire pour les fichiers préparatoires, les documents, les fichiers sources des maquettes par ex et je crée un répertoire dédié au projet de développement.

`/home/{moi}/monProjet/dev`

## Les sources

Comme je souhaite séparer le répertoire du projet NetBeans des sources du projet, je crée un autre répertoire, dédié aux sources du projet.

`/home/{moi}/monProjet/dev/source`

Pour installer les sources du projet, je vais avoir besoin de <a href="http://getcomposer.org" target="_blank">**Composer**</a>.

### Installer Composer

Nous allons installer **Composer** et nous arranger pour que vous puissiez y faire appel pour ce projet et pour les projets suivants.

- Ouvrez un terminal

`curl -sS https://getcomposer.org/installer | php`

Faites attention au répertoire dans lequel vous êtes. Un fichier `composer.phar` devrait avoir y été copié/créé.

- Copiez ce fichier `composer.phar` dans le répertoire `/usr/bin`

`mv repertoire/composer.phar /usr/bin/composer`

*Utilisez `sudo` si nécessaire.*

- Changez les droits pour que tous les utilisateurs puissent accéder à cette nouvelle commande `composer`

`chmod +x /usr/bin/composer`

*Utilisez `sudo` s'il le faut.*

### Installer les sources du projet

- Retournez dans votre projet

`cd /home/{moi}/monProjet/dev/source`

- Ouvrez un terminal.

`composer create-project -s dev zendframework/skeleton-application`

**Composer** va télécharger tous les fichiers du **Zend Framework 2 skeleton application**, ses dépendances et installer le tout.

### Mettre en place le virtual host

Dans le répertoire de développement, je crée un **fichier de configuration d'Apache**.

```sh
// /home/{moi}/monProjet/dev/httpd.conf

Alias /alias_du_projet /home/{moi}/monProjet/dev/source/public

<Directory /home/{moi}/monProjet/dev/source/public>
  Options FollowSymLinks
  DirectoryIndex index.php
  Require all granted
</Directory>
```

#### Ajouter ce virtual host à Apache

Dans votre console :

`sudo ln -s /home/{moi}/monProjet/dev/httpd.conf /etc/apache2/sites-available/monProjet.conf`

Si vous allez vérifier dans le répertoire `/etc/apache2/sites-available`, vous verrez le nouveau fichier `monProjet.conf` qui est un alias vers votre fichier `/home/{moi}/monProjet/dev/httpd.conf`.

*Depuis **Apache 2.4** (si je ne me trompe pas), il faut obligatoirement le `.conf` derrière.*

#### Ajouter ce nouveau site au chargement d'Apache

`sudo a2ensite monProjet.conf`

#### Redémarrer Apache

`sudo service apache2 reload`

L'alias indique à **Apache** que lorsqu'on saisit `http://localhost/alias_du_projet` dans le navigateur, **Apache** doit aller chercher le fichier `/home/{moi}/monProjet/dev/source/public/index.php` et afficher la page qui correspond à cette adresse. Le fichier `index.php` étant la page d'entrée de notre application, pour savoir ce qui est chargé, il faut voir ce qu'il se passe dans une **application MVC de Zend Framework.**

## Créer le projet dans Netbeans

Installer **Netbeans** avec **synaptic**

- Lancer **Netbeans**
- Cliquer sur `File > New project...`
- Dans la fenêtre qui s'ouvre, choisir **PHP Application with Existing Source**
- Cliquer sur suivant
- Choisir un nom de projet du type **Nom_De_Mon_Projet**
- Pointer le répertoire de sources vers `/home/{moi}/monProjet/dev/source`
- Choisir votre **version de PHP** et votre **encoding** par défaut
- Cocher la case "**Put NetBeans metadata into a separate directory**"
- Choisir le chemin `/home/{moi}/monProjet/dev`
- **NetBeans** vous avertira que le répertoire choisi pour les **métadonnées de NetBeans** n'est pas vide. Ignorez l'avertissement et cliquer sur **Suivant**.
- Pour une **application Zend Framework**, choisissez **Local Web Site (running on local web server)**
- Pour l'URL de votre projet, mettez `http://localhost/alias_du_projet`
- Index File : choisissez le fichier `public/index.php`

**NetBeans** va créer un répertoire `nbproject` qui contient toutes les métadonnées dont **NetBeans** a besoin pour gérer votre projet.

`/home/{moi}/monProjet/dev/nbproject`

Dans **NetBeans**, dans la fenêtre **Projects**, le nouveau projet **Nom_De_Mon_Projet** apparaît.

## Utiliser un gestionnaire de version pour le projet

Installer **git** avec **synaptic**

### Initialiser votre dépôt local

- Ouvrez **NetBeans**
- Installez le plugin **Git**
- Cliquez droit sur votre projet **Nom_De_Mon_Projet > Versioning > Initializing Git Repository** pour initialiser votre dépôt grâce à l'interface de **NetBeans**. Si le **plugin git** n'est pas installé dans **NetBeans**, vous pouvez **initialiser votre dépôt git** par la ligne de commande. A partir du terminal, allez sur le répertoire `/home/{moi}/monProjet/dev/sources` et tapez `git init`.

### Installer un dépôt distant

- Ouvrez un compte sur <a href="https://github.com" target="_blank">**github**</a>

### Vérifier si votre poste a déjà une clé SSH installée.

Sur **Ubuntu**, la clé devrait être dans `home/{moi}/.ssh`.

La **clé SSH** est composée de deux fichiers. D'un poste à l'autre, ils peuvent avoir des noms différents. Pour moi, les deux fichiers sont nommés `id_rsa` et `id_rsa.pub`. Les deux fichiers sont générés en une fois par une même application.

Sur **Ubuntu**, il faut utiliser l'utilitaire `ssh-keygen`.
Sur **Windows**, en installant l'application **Git Gui**, vous bénéficierez également d'un générateur de **clé SSH**.
Il existe également de nombreuses autres applications pour générer les clés SSH.

- Muni de votre clé, identifiez vous sur **github**. Dans votre compte, menu **Settings** (le petit engrenage), allez dans le menu **SSH Keys**. Sur cet écran, vous pouvez ajoutez une nouvelle clé (**Add SSH Key**).
- Un formulaire s'ouvre. Choisissez un **nom** pour savoir à quel utilisateur / compte / poste correspond la clé et dans la partie **key**, copiez le contenu de votre **clé publique**. La clé publique est celle où il n'y a pas marqué `BEGIN PRIVATE KEY` (éditez le fichier pour voir le contenu de la clé).
- Cliquez sur **Add Key**.
- Revenez sur le répertoire de votre projet `/home/{moi}/monProjet/dev/sources`
- Ajoutez un dépôt distant `git remote add {nom du repo} git@github.com:{username}/{repositoryname}.git`

Vous pouvez maintenant, depuis **NetBeans**, commiter votre code et pousser vos commits vers le dépôt distant sur **github**.

### Dans NetBeans, pour voir vos dépôts distants

Dans le menu **Team > Git > Repository Browser**, vous avez la liste de tous vos dépôts git locaux.

- Pour chacun des dépôts, vous avez entre crochets le nom de la branche "courante".
- Pour chacun des dépôts, vous avez également la liste des dépôts distants.
- Pour chacun des dépôts, vous avez la liste des branches du dépôt local ainsi que les branches des dépôts distants.
