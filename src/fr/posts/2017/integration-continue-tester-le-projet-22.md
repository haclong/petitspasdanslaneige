---
title: "Intégration continue - Tester le projet 2/2"
permalink: "fr/posts/integration-continue-tester-le-projet-22.html"
date: "2017-02-17T09:27"
slug: integration-continue-tester-le-projet-22
layout: post
drupal_uuid: b7e2b508-58d0-4bc6-8fb8-8c00bd13c887
drupal_nid: 172
lang: fr
author: haclong

book:
  book: integration-continue-utiliser-go-cd
  rank: 5
  top:
    url: /fr/books/integration-continue-utiliser-go-cd.html
    title: Intégration Continue - Utiliser Go CD
  next:
    url: /fr/posts/integration-continue-avec-gocd-monitorer-les-pipelines.html
    title: Intégration Continue avec GoCD - Monitorer les pipelines
  previous: 
    url: /fr/posts/integration-continue-tester-le-projet-12.html
    title: Intégration continue - Tester le projet 1/2

media:
  path: /img/teaser/capture_2.png
  credit: "Sebastian Mantel - Unsplash"

tags:
  - "intégration continue"
  - "git"
  - "phpunit"
  - "gocd"
  - "tutorial"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Dans un même stage, nous avons deux jobs : un job en charge des tests de couverture de code et un job en charge des tests unitaires et copie du code validé vers un dépot de source / dépôt git distant. Nous avons vu dans un article précédent comment on paramètre le job pour faire les tests de couverture et dans cet article, nous allons voir comment on finalise le stage."
---

Dans un même *stage*, nous avons deux *jobs* : un *job* en charge des tests de couverture de code et un *job* en charge des tests unitaires et copie du code validé vers un dépot de source / dépôt git distant. Nous avons vu dans un article précédent comment on paramètre le *job* pour faire les tests de couverture et dans cet article, nous allons voir comment on finalise le *stage*.

### Job 2 TestAndBuild

#### MonPremierBuild/ProjectTesting/TestAndBuild

**Job Settings**

- Job Name : **TestAndBuild**
- Resources : **''**
- Job Timeout : **Use default (Never)**
- Run Type : **Run one instance**. *Je ne sais pas encore jouer le code sur des instances différentes*.

**Artifact**

Pour ce *job* **TestAndBuild**, nous générons un *artifact* (*les artifacts est une notion en train de s'éclaircir...*)

- Source : **monprojet.*.zip**
- Destination : **''**
- Type : **Build Artifact**

Pour les curieux, vous retrouverez vos *artifacts* générés par **GoCD** ici : `/var/lib/go-server/artifact/pipeline/{pipelineName}/{compteur}/{stageName}/{compteur}/{jobName}/`

**Variables d'environnement personnalisées**

Aucune variable définie à ce jour.

**Onglet personnalisé**

Aucun onglet personnalisé

Tout le paramétrage du *job* est là, penchons nous plus précisemment sur les *tâches* du *job*.

## La task

Concernant le *job* **TestAndBuild**, il y a plusieurs *tasks* qu'il faut préparer.

### Task 2.1

La première *tâche* consiste à exécuter les tests unitaires.

S'il avait fallu le faire dans un terminal, à la main, en ligne de commande, on aurait exécuté cette commande, sans aucun argument : 

```sh
phpunit
```

#### Ce qu'il va se passer

- **GoCD** est notifié lorsque le *stage* qui précède a été exécuté avec succès.
- **GoCD** va exécuter la *task* qu'on va lui dire d'exécuter (ici, pour commencer, `phpunit`)

#### Ce qu'il faut faire

Pour cela, éditer la *task* dans **GoCD**. C'est une *task* **"More..."** : à nous d'écrire ce que nous voulons que le server fasse.

- Command : **phpunit**
- Arguments : **''** (aucun argument)
- Working Directory : **''**
- Run If Conditions : **Passed** (s'exécute automatiquement et à la condition que le *job* précédent a réussi)

<cite>Attention, afin que cela marche, il faut penser à installer l'exécutable de **phpunit** dans un répertoire de binaires de votre poste **Ubuntu**.

Mettre `phpunit` dans `/usr/bin/`

Les permissions de `phpunit` : `root:root - 755`
</cite>

### Task 2.2

La seconde *tâche* consiste faire un .zip du projet si les tests passent.

A la main, dans un terminal, voici la commande :

```sh
git archive --format=zip -v --output=sudokusolver.zip master
```

#### Ce qu'il va se passer

- **GoCD** a exécuté la *tâche* qui précède avec succès
- **GoCD** va exécuter la *task* qu'on va lui dire d'exécuter (ici, pour commencer, faire le zip)

#### Ce qu'il faut faire

- Command : **sh** (oui, c'est particulier, mais ça marche comme ça)
- Arguments : (attention, les retours à la ligne sont importants)

```sh
-c
git archive --format=zip -v --output.MyBuild.$GO_PIPELINE_COUNTER.zip master
```

- Working Directory : **''**
- Run If Conditions : **Passed** (s'exécute automatiquement et à la condition que le *job* précédent a réussi)

<cite>Notez que j'ai ajouté la variable `$GO_PIPELINE_COUNTER` qui correspond au numéro incrémental que **GoCD** affecte à chaque *pipeline* chaque fois qu'il est exécuté. Ainsi, si on fait notre *build* plusieurs fois dans la même journée, à chaque fois, on va obtenir un zip différent avec un suffixe auto-incrémenté.

La liste des variables que l'on peut utiliser se trouve ici.
</cite>

### Task 2.3

La troisième *tâche* consiste à ajouter le *dépôt distant* au projet que **GoCD** a installé et exécuté.

A la main, dans un terminal, voici la commande qu'on connait bien :

```sh
git remote add github git@github.com:user/remote.git
```

#### Ce qu'il va se passer

Lorsque **GoCD** a installé votre projet, il a fait un clone de votre projet. Il y a donc un nouveau serveur git tout neuf pour votre projet installé par **GoCD**. Qui dit serveur git tout neuf dit AUCUN dépôt distant, or *origin* qui pointe sur le répertoire de développement de votre projet (là où **GoCD** a cloné votre projet)

Il va donc falloir ajouter à ce serveur git tout neuf votre VRAI répertoire distant.

#### Ce qu'il faut faire

- Command : **sh** 
- Arguments : (attention, les retours à la ligne sont importants)

```sh
-c
git remote add github git@github.com:user/remote.git
```

- Working Directory : **''**
- Run If Conditions : **Passed** (s'exécute automatiquement et à la condition que le *job* précédent a réussi)

### Task 2.4

Vous vous doutez bien, la quatrième *tâche* va consister à pousser notre projet vers le dépôt distant si les tests ont été passés avec succès.

A la main, dans un terminal, voici la commande qu'on connait bien :

```sh
git push github master
```

#### Ce qu'il faut faire

- Command : **sh** 
- Arguments : (attention, les retours à la ligne sont importants)

```sh
-c
git push github master
```

- Working Directory : **''**
- Run If Conditions : **Passed** (s'exécute automatiquement et à la condition que le *job* précédent a réussi)

### Task 2.5

Finalement, pour me faire plaisir et parce que je voulais expérimenter un peu plus, la cinquième *tâche* va copier le .zip que **GoCD** a fait plus tôt et le déplacer dans un dépôt de source de mon choix (en local).

#### Ce qu'il faut faire

- Command : **sh** 
- Arguments : (attention, les retours à la ligne sont importants)

```sh
-c
cp MyBuild.$GO_PIPELINE_COUNTER.zip /home/user/repository/monprojet/builds/.
```

- Working Directory : **''**
- Run If Conditions : **Passed** (s'exécute automatiquement et à la condition que le *job* précédent a réussi)

## Note : syntaxe des tasks

D'après la documentation de **GoCD**, lorsqu'il s'agit de rédiger les *tasks*, il faut soit utiliser la vraie commande et dans le champ **Arguments**, mettre un argument différent par ligne. Dans l'autre cas, **GoCD** considère en fait que la commande qu'on veut voir exécuter est de cette nature : `sh -c "git push github master"`

Je vous renvoie sur la documentation pour savoir pourquoi il y a deux manières de gérer les commandes sur Ubuntu.

## Note : pousser le code vers le dépôt git distant

Si vous utilisez ce tutorial, vous allez rencontrez un problème de sécurité. En effet, dans l'état actuel, **github** ne va pas accepter que n'importe qui (en l'occurence un utilisateur `go:go`) lui pousse des fichiers sur un dépôt qui vous appartient. Il va falloir expliquer à **github** que le user *go* a le droit de lui pousser des informations.

- Ouvrir un terminal
- Prétendre être l'utilisateur *go*

```sh
sudo su go
```

- Générer une clé SSH pour l'utilisateur *go* à l'intention de **github**

```sh
ssh-keygen -t rsa -b 4096 -C "{adresse email}"
```

En principe, une clé est générée et on vous propose de la sauvegarder ici : `/var/go/.ssh/id_rsa`

- Copier coller le contenu de `/var/go/.ssh/id_rsa.pub` et ajouter cette nouvelle clé SSH à votre dépôt **github**.
- Une fois que la clé est ajoutée dans **github**, revenir dans le terminal. Assurez vous que vous êtes toujours l'utilisateur *go*
- Saisir cette commande : 

```sh
ssh -vT git@github.com
```

je ne sais pas vraiment ce que ça fait mais ça marche

- Répondre Yes quand on vous pose la question
- Récupérer son user :

```sh
exit
```

Il faut peut être également définir un port dédié pour la connexion https.

- Aller dans le menu **Admin > Server configuration** et définir l'url et le port pour HTTPS. *Je ne saurais vous en dire plus... je ne sais pas trop comment ça marche ici :p*

Et voilà !!

## Conclusion

Voila l'ensemble des tâches paramétrées pour le *job* **MonPremierBuild/ProjectTesting/TestAndBuild**.

- ce *job* exécute les tests unitaires (`phpunit`)
- si les tests sont réussis, ce *job* fait un zip du projet (sans les librairies) et copie ce zip sur un repository local
- si les tests sont réussis, ce *job* ajoute un dépôt distant au serveur git et pousse le code du projet vers le dépôt distant

*J'ai noté un petit inconvénient avec l'automatisation du code poussé vers le dépôt distant :*

*Finalement, c'est à partir du serveur git de GoCD que le code est poussé vers github. Résultat, sur le serveur git de développement (même machine, répertoire de développement et non plus répertoires de GoCD), on perd la synchronisation avec la branche master distante.*

*Du coup, je m'interroge sur la pertinence de mes tâches... A voir...*

Ouf... c'était un peu long mais il me semble que tout y est. J'espère que ça vous sera utile. Je vous donne rendez vous pour d'autres aventures !
