---
title: "Intégration continue - Installer le projet"
permalink: "fr/posts/integration-continue-installer-le-projet.html"
date: "2017-01-27T08:53"
slug: integration-continue-installer-le-projet
layout: post
drupal_uuid: c24253bf-fc25-4f0c-9467-e25429e7cda2
drupal_nid: 169
lang: fr
author: haclong

book:
  book: integration-continue-utiliser-go-cd
  rank: 3
  top:
    url: /fr/books/integration-continue-utiliser-go-cd.html
    title: Intégration Continue - Utiliser Go CD
  next:
    url: /fr/posts/integration-continue-tester-le-projet-12.html
    title: Intégration continue - Tester le projet 1/2
  previous: 
    url: /fr/posts/integration-continue-installer-gocd.html
    title: Intégration Continue - Installer GoCD

media:
  path: /img/teaser/capture_2.png
  credit: "Sebastian Mantel - Unsplash"

tags:
  - "intégration continue"
  - "gocd"
  - "ubuntu"
  - "tutorial"
  - "git"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Une fois que le pipeline a été créé dans GoCD, voyons en détail le paramétrage pour notre premier build."
---

Une fois que le *pipeline* a été créé dans **GoCD**, voyons en détail le paramétrage pour notre premier *build*.

Dans l'<a href="/fr/content/int%C3%A9gration-continue-les-concepts-de-gocd.html">article précédent</a>, nous avons vu comment créer notre premier *pipeline*... Pas tout à fait. Pour les attentifs, il ne s'est rien passé à la création de notre *pipeline*. De plus, frustration extrême, je ne vous ai communiqué aucune indication précise sur le contenu des *jobs*...

Mais avant de vous parler du *pipeline*, voyons un peu le type de projet que nous avons là.

## Caractéristiques du projet

- Framework <a href="https://symfony.com/doc/current/setup.html" target="_blank">Symfony 2</a>
- Pas de base de données *(si vous voulez un ex d'intégration continue avec base de données, il faut vous reférer à <a href="/fr/content/ci-int%C3%A9gration-continue-avec-continuousphp.html">mon autre article sur ContinuousPHP</a>)*
- Tests avec <a href="https://phpunit.de/getting-started.html" target="_blank">**PHPUnit**</a>
- Dépôt distant sur <a href="https://github.com/">**github**</a>

## Scénario

Le développement se fait en local sur des branches dédiées par fonctionnalité.

Lorsque le développement de la branche est terminé, je merge sur la branche *master locale*.

La mise à jour de la branche *master locale* déclenche le *pipeline* **GoCD** qui va bien.

Si les scénarii de tests se déroulent sans problème, **GoCD** pousse le code vers la branche *master sur le dépôt distant*.

#### Voyons comment on fait ça sur GoCD

Dans un premier temps, pour que **GoCD** puisse faire un *build*, il est impératif que **GoCD** puisse installer le projet. *Souvenez vous, à chaque fois que le serveur d'intégration continue doit faire un build, il doit tout refaire depuis le début : aller chercher les sources LA où on les a mises, installer le projet, installer les dépendances, exécuter les tests, valider les tests et finir le build en fonction de nos instructions.*

## Le pipeline

Après avoir créé notre premier *pipeline*, on va aller l'éditer.

**Pipeline General Options**

- Pipeline Name : **MonPremierBuild**
- Label Template : **${COUNT}**
- Automatic Pipeline locking : **N**
- Automatic Pipeline scheduling : **Y**

**Pipeline Project Management**

- Tracking Tool : **None**
- Pipeline Materials : **only path to source**

**Variables d'environnement personnalisées**

Aucune variable définie à ce jour. *Il faut que je creuse la question, je ne sais pas très bien à quoi cela peut servir*

**Paramètres particuliers**

Aucun paramètre particulier défini à ce jour.

Intéressons nous maintenant aux stages.

## Le stage

Nos stages sont créés manuellement et ne sont pas définis par un template.

- Configuration type : **Define Stages**

### **Stage ProjectInstallation**

J'ai commencé avec un seul *stage* qui comprenait l'intégralité du *build*. Mais l'exécution des tests étaient de plus en plus long et parfois, **GoCD** tombait en timeout. Il a fallu séparer les différentes étapes du *build*. Rappelons nous, les *stages* sont toujours exécutés dans l'ordre dans lesquels on les positionne. J'ai donc finalement un premier *stage* concernant l'installation du projet et un second *stage* concernant ce qui reste à faire.

Nous voyons ici spécifiquement le *stage* pour installer le projet.

#### **MonPremierBuild/ProjectInstallation**

**Stage Settings**

- Stage Name : **ProjectInstallation**
- Stage Type : **On success** (déclenchement automatisé du *stage* contrairement au déclenchement manuel). Si le *stage* est précédé d'un premier *stage* qui échoue, alors le *stage* qui suit ne va pas s'exécuter. Si c'est le tout premier *stage*, il s'exécute automatiquement quand **GoCD** commence un *build*.
- Fetch Materials : **Y.** **GoCD** doit aller chercher les *materials* pour exécuter le *stage*.
- Never Cleanup Artifacts : **N**. Si le *stage* génère un *artifact*, cette checkbox indique à **GoCD** de ne jamais purger les *artifacts* stockés sur **Go Server**
- Clean Working Directory : **Y**. Cette option est importante parce que cela indique que **GoCD** doit SYSTEMATIQUEMENT supprimer le répertoire temporaire contenant le projet chaque fois qu'il doit réexécuter le *build*. On est ainsi sûr de repartir sur de bonnes bases.

**Variables d'environnement personnalisées**

Aucune variable définie à ce jour.

**Permissions**

- choix par défaut : **Inherit from the pipeline group**.

Interessons nous plutôt aux *jobs* maintenant.

## Le job

Mon stage **ProjectInstallation** n'a qu'un seul *job* pour le moment.

### Job InstallWithComposer

#### MonPremierBuild/ProjectInstallation/InstallWithComposer

**Job Settings**

- JobName : **InstallWithComposer**
- Resources : **''**
- Job Timeout : **Use default (Never)**
- Run Type : **Run one instance**. *Je ne sais pas encore jouer le code sur des instances différentes*.

**Artifact**

Pas d'artifact défini pour ce job.

**Variables d'environnement personnalisées**

Aucune variable définie à ce jour.

**Onglet personnalisé**

Aucun onglet personnalisé

Tout le paramétrage du *job* est là, penchons nous plus précisemment sur les tâches du *job*.

## La task

En fait, pour le job **InstallWithComposer**, il n'y a qu'une seule *task* à définir : la ligne de commande qui va lancer **Composer** et installer le projet.

Ce que nous allons demander maintenant à **GoCD**, c'est de faire AUTOMATIQUEMENT ce que nous aurions fait MANUELLEMENT de cette façon dans un terminal :

```sh
composer install
```

#### Ce qu'il va se passer :

RAPPEL : A la création du *pipeline*, on a défini un premier *material* qui est notre *dépôt git local* et on a précisé quelle était la *branche* que **GoCD** devait surveiller.

- Lorsqu'on aura fait un commit de la *branche* surveillée sur le *dépôt git local*
- **GoCD** va le détecter
- **GoCD** va aller cloner le projet depuis le *dépôt git local* vers `/var/lib/go-agent/pipelines`
- **GoCD** va se positionner à la racine de ce *pipeline*
- **GoCD** va exécuter la *task* qu'on va lui dire d'exécuter (ici : `composer install`)

#### Ce qu'il faut faire :

Il faut éditer la *task* dans **GoCD**. C'est une *task* **"More..."**, à nous d'écrire ce que nous désirons.

- Command : **composer**
- Arguments : **install**
- Working Directory : **''**
- Run If Conditions : **Passed** (s'exécute automatiquement et à la condition que le *job* précédent a réussi)

Attention, afin que cela marche, il faut penser à installer l'exécutable de `composer` dans un répertoire de commandes de votre poste **Ubuntu**.

Mettre `composer.phar` dans `/usr/bin/`

```sh
cd /usr/bin
cp /path/to/composer.phar
```

**Faire un lien symbolique**

```sh
sudo ln -s composer.phar composer
```

Les permissions de `composer.phar` :

```root:root - 755```

Ceci étant fait, nous avons installé notre projet sur **Go Server**.

A la prochaine étape, nous verrons comment on exécute les tests. A la condition que vous ayez des tests à jouer... D'un autre côté, comme je l'ai déjà dit, il y peu d'intérêt de paramétrer un serveur d'intégration continue si vous ne profitez pas de l'opportunité pour ajouter un peu de tests à votre projet.
