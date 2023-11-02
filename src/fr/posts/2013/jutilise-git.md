---
title: "J'utilise git"
permalink: "fr/posts/jutilise-git.html"
date: "2013-04-09T12:40"
slug: jutilise-git
layout: post
drupal_uuid: 72c937f9-b15b-4c1b-b5fd-78c340a1b168
drupal_nid: 33
lang: fr
author: haclong

media:
  path: /img/teaser/Git-Logo-1788C.png

tags:
  - "gandi.net"
  - "scm"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Même si je suis seule maître à bord sur mon développement, 1/ il n'est pas exclu que je partage le boulot avec un autre développeur et de toutes façons, 2/ à moi toute seule, je démultiplie les sources puisque j'ai des postes différents pour développer... Après avoir testé les moyens du bord pour maintenir des sources propres, je tente les outils de gestion de version.
"
---

Même si je suis seule maître à bord sur mon développement, 1/ il n'est pas exclu que je partage le boulot avec un autre développeur et de toutes façons, 2/ à moi toute seule, je démultiplie les sources puisque j'ai des postes différents pour développer... Après avoir testé les moyens du bord pour maintenir des sources propres, je tente les outils de gestion de version.

### Choisir son outil de gestion de version

De réputation, j'en connais 2 : <a href="http://subversion.apache.org/" target="_blank">**SVN**</a> d'une part et <a href="http://git-scm.com/" target="_blank">**git**</a> de l'autre.

Pour avoir testé SVN de manière passive (ON me l'a installé, ON me l'a configuré et quand je ne peux pas commiter, ON a corrigé le problème sans me dire pourquoi), j'ai hélas gardé l'impression que c'était un outil obscur et compliqué. C'est un mauvais souvenir basé sur un mauvais ressenti mais je ne me sentais pas le courage de me lancer dans SVN comme ça.

En plus, à côté de ça, j'ai trouvé des commentaires vantant la facilité d'approche de **git** : **git** si léger, **git** si simple, **git** si convivial... Il n'y avait que des louanges... Peut être que je n'ai retenu que les bons points aussi. Je sais que j'ai vu passer des articles sur "pourquoi **git** est si compliqué, si obscur, si ceci cela..." Et surtout : "pourquoi **git** ne parle pas comme les autres". Dans la mesure où je n'en connaissais vraiment aucun, que **git** parle comme ou différement des autres ne pouvait pas compter pour mon choix.

Bref, j'ai tenté **git**.

### Installer son repo git

Le *repository*, c'est l'endroit où vous allez stocker vos sources. Normalement, c'est l'endroit qui sera le plus "propre" en terme de développement et le plus à jour. Par simple bon sens, le repository se situe sur un serveur accessible par plusieurs. Soit un espace web, soit un espace sur le réseau local dans le cadre de développement professionnel. J'ai même tenté la clé USB pour mon premier repository... Passons.

N'importe quelle machine ne peut pas accueillir un repository **git** parce qu'il faut que ladite machine puisse interpréter les commandes **git**. La conséquence est que, si vous avez souscrit une solution en hébergement mutualisé, votre espace d'hébergement ne peut pas forcément servir de repository. Il faut se renseigner sur ce point.

Si vous désirez quand même avoir un repository **git** sur le web, <a href="https://github.com/" target="_blank">github.com</a> est là pour ça.

Pour ma part, l'hébergeur <a href="http://www.gandi.net" target="_blank">Gandi.net</a> comprend dans son offre d'hébergement mutualisé Simple Hosting la possibilité de faire de son espace un repository **git**. Toutefois, quand on découvre **git**, c'est pas toujours évident de savoir quoi et comment faire.

Pour le moment, Gandi n'autorise qu'un seul "serveur **git**" par vhost. *Je pense que le terme "serveur" est un abus de langage mais je crois que je le dis plusieurs fois, du coup, comprenez plutôt "repository" git.* Cela signifie que si un de vos vhosts comprends beaucoup de projets importants, alors ils seront tous compris dans le même repository **git** (donc dans les mêmes instructions `clone` et les même instructions `commit`...) Ce n'est pas pratique, bien évidemment, mais c'est mieux que rien.

### Voyons comment installer son repo (repository pour les intimes) git

La documentation n'est pas très claire et j'ai eu beaucoup de mal à le faire mais finalement, il semblerait que cela soit simplissime. Je pense que je cherchais des complications là où il n'y en avait pas parce que la documentation officielle de git ne semble citer que github et que l'hébergeur Gandi.net avait son propre tutoriel.

### Installer git sur votre machine locale

Il existe des applications pour Ubuntu comme pour Windows, servez vous. Personnellement, j'utilise <a href="http://msysgit.github.io/" target="_blank">msysGit</a> et NetBeans pour Windows et <a href="http://doc.ubuntu-fr.org/git" target="_blank">git </a>pour Ubuntu. J'ai bien **gitg** et **gitk** pour Ubuntu mais je ne sais pas encore les utiliser... ça va venir.

Sur votre machine locale, placez vous à la racine de votre projet web (techniquement, là où se situe votre application).

#### Initialiser git

Déclarez que pour ce projet, vous allez travailler avec **git**.

```sh
 git init
```

La console vous réponds : `Initialized empty Git repository in /path/to/web/application/.git/`

Du coup, vous apprenez au passage que la commande `git init` a créé un répertoire `.git/` à la racine de votre projet.

Ce répertoire `.git/`, c'est "tout" votre git. Tout est stocké là, tout est consigné etc...

- Si vous voulez tout réinitialiser parce que vous vous êtes mélangé les pinceaux, il faudra effacer ce répertoire `.git/`.
- Si vous transférez vos fichiers en FTP, ne transférez pas le répertoire `.git/`... Ni dans un sens, ni dans l'autre...

#### Protéger des fichiers

Le principe de **git**, c'est que vous allez stocker dans votre répertoire `.git/` tout votre projet : cela comprend l'intégralité des fichiers. Dans les grosses lignes, ce répertoire `.git/` va être transféré sur votre repository distant. Ainsi, tous vos collaborateurs et plus largement toutes les personnes qui souhaitent travailler sur votre projet pourront se procurer les sources du projet en recopiant ce répertoire `.git/`.

Et là, si vous voyez à peu près là où je veux en venir, vous réalisez que vous allez forcément avoir dans vos sources des fichiers avec des informations délicates : les mots de passe pour accéder à des ressources de types comptes user ou comptes base de données par ex... L'open source, c'est beau, c'est joli mais c'est pas une raison pour être irrationnel et se faire trouer sa sécurité pour ses beaux yeux...

Du coup, il faudra être rigoureux et stocker ces informations sur des fichiers qui ne seront pas à copier. Si vous êtes un minimum intentionné, vous laisserez une version "publique" avec des fausses infos pour que vos émules n'aient pas à chercher dans le noir le nom des variables utilisées par votre application. De même, vous laisserez également des fichiers sql avec à minima la structure de la base de données que vous utilisez. Ca peut aider.

En attendant, il faut protéger vos fichiers sensibles.

Pour cela, il faut mettre un fichier `.gitignore`. Dans ce fichier `.gitignore`, il faut lister les fichiers qui ne doivent pas être clonés. La liste peut être écrite litéralement, ou bien avec des expressions régulières. Il faut un fichier `.gitignore` par répertoire où il y a des fichiers à protéger. Des outils graphiques permettent de faire ça facilement avec des menus contextuels par ex. Je suppose qu'il doit être également possible d'alimenter le fichier `.gitignore` en ligne de commande.

#### Ajouter les fichiers à suivre (track)

Après avoir protégé les fichiers sensibles, il faut maintenant donner à **git** la liste des fichiers et répertoires que vous voulez que **git** suive.

```sh
 git add {liste des fichiers/répertoires séparés par un espace}
```

Je pense qu'il y a un moyen de faire `git add *` mais comme j'en suis à ma énième tentative, j'ai préféré choisir la sécurité. Pour vérifier que les fichiers ont bien été ajoutés, il faut ouvrir `.git/` et vérifier qu'il y a un fichier `index`. Toutefois, ce fichier `index` est crypté. Il faut juste faire une estimation en fonction du nombre de fichiers que vous avez ajoutés et la taille du fichier `index`.

Sinon, on peut utiliser `git add -v {fichiers}`. L'option `-v` rend `git add` plus bavard... On peut donc suivre ce que fait `git add`.

#### Dites à git qui vous êtes

Dans la vie de votre projet, vous serez soit seul à maintenir votre projet, soit plusieurs. Dès que vous êtes plusieurs, il est toujours bien de savoir qui a fait quoi. Et pour savoir qui a fait quoi, il faut déclarer votre identité. Afin que **git** ajoute cette information dès que vous ferez mettrez le projet à jour.

Ajoutez donc

```sh
 git config user.email "{votre email}"
 git config user.name "{votre nom}"
```

**git** n'est pas G+. Un pseudo fera toujours l'affaire, du moment qu'on peut vous identifier avec.

#### Déclarer le repository à distance (remote repository)

Il faut dire à votre répertoire local, sur lequel vous ferez vos développements, où se situe votre remote repository. Donnez un nom à votre repository à distance. Le notre va s'appeler "*origin*"

```sh
 git remote add origin {path/to/remote/repository}
```

Vous pourrez toujours vérifier cette information dans le fichier `.git/config`.

#### Votre premier commit

On a initialisé **git** pour le projet, on a ajouté la liste des fichiers à suivre, il faut maintenant faire le premier **commit** pour enregistrer le premier état de votre projet. C'est votre "point de sauvegarde".

```sh
 git commit
```

Il est recommandé de laisser un commentaire pour identifier, tagger, marquer, annoter le point de sauvegarde. C'est toujours mieux pour le retrouver.

```sh
 git commit -m "mon premier point de sauvegarde"
```

La console liste tous les fichiers inclus dans le **commit**.

#### Envoyer le point de sauvegarde vers le repository à distance

Même si vous avez marqué votre point de sauvegarde, il faut savoir que celui ci n'est noté que sur votre poste de développement. Votre repository distant n'a pas encore enregistré ce point de sauvegarde. Il faut maintenant envoyer ces informations à notre repository à distance.

```sh
 git push origin master
```

On *pousse* le dernier point de sauvegarde de la branche *master* vers le repository qu'on a nommé *origin*.

Et voila !

Concernant **github**, je ne sais pas, mais concernant **gandi.net**, il semblerait que `git push` n'upload pas les fichiers vers le serveur. En fait, le `push` envoie sur le repository à distance les fichiers sources sous une forme "git"ée... Les transactions de type `push`, `pull` et `clone` soit encode les fichiers, soit les décode. Cela signifie deux choses :

- Il faut utiliser un client FTP pour transférer les "vrais" fichiers source pour que le site fonctionne.
- Le repository peut se situer sur un serveur (github par ex) alors que le véritable site (si site il y a) est hébergé sur un autre serveur.

Sur Gandi.net, le repository se trouve hors du répertoire web. Il se trouve sur `lamp0/vcs/git/`.

### Pour résumer

On crée un suivi des versions avec

- `git init` (pour initialiser git)
- `git config` (pour déclarer le nom et l'email de l'utilisateur)
- `git remote add` (pour déclarer le chemin du dépôt à distance)

On alimente (et on met à jour) le repository à distance avec

- `git add` (pour déclarer les nouveaux fichiers à suivre)
- `git commit` (pour marquer un point de sauvegarde)
- `git push` (pour pousser le point de sauvegarde sur le repository à distance)

Pendant le développement d'un projet, il faut penser à suivre les fichiers qui sont créés progressivement et éventuellement, suivre ceux qui sont supprimés (plus difficile à suivre). Il existe une option pour `git add` pour que ce soit **git** qui identifie tout seul les fichiers ajoutés et ceux qui sont supprimés. Personnellement, j'utilise un client graphique qui fait ça très bien.

**RAPPEL** : Mettre à jour le repository ne signifie pas que les fichiers seront téléchargés. Il faut le faire pour que le site soit en ligne.

### Les autres opérations

#### Récupérer un projet existant

Si vous souhaitez télécharger un projet existant :

```sh
 git clone {path/to/projet.git}
```

#### Mettre à jour vos fichiers locaux (de dev) avec les fichiers du repository

Si vous souhaitez faire du travail collaboratif, il y a des réflexes à adopter.

Par exemple, juste avant de mettre à jour un fichier sur le dépôt à distance, il faut vérifier que vous avez bien la dernière version du fichier.

```sh
 git pull
```

Faire votre développement et remettre le repository à jour.

```sh
 git add (si nécessaire)
 git commit
 git push
```

#### Dé-branchez votre projet

Vous pouvez également faire des sous versions, des branches.

Le principe, c'est de ne pas modifier l'axe principal du développement du projet. Par exemple pour garder une version stable aussi stable que possible disponible. Ou bien parce qu'on se lance dans un refactoring massif et qu'il ne faut pas casser toute les fonctionnalités.

**Git** permet alors de créer une nouvelle branche que vous allez développer et commiter de votre côté. Et quand votre développement sera stabilisé / terminé, alors on fusionne votre branche sur la branche principale.

**Git** sait et permet de faire tout ça.... Faut juste repérer les commandes qui vont bien.

**Git** propose de fusionner les sources (`merge`) lorsque le fichier qui se trouve sur le dépôt distant et celui qui a été modifié sur le poste local diffèrent.

Il me reste encore plusieurs fonctionnalités à découvrir sur **git**. Mais j'ai déjà les informations de base pour commencer à travailler...

J'espère que ce post peut s'avérer utile pour certains.
