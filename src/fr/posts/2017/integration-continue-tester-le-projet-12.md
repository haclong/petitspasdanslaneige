---
title: "Intégration continue - Tester le projet 1/2"
permalink: "fr/posts/integration-continue-tester-le-projet-12.html"
date: "2017-02-07T09:25"
slug: integration-continue-tester-le-projet-12
layout: post
drupal_uuid: b464e4ff-5341-4614-84ed-fa3c4d586295
drupal_nid: 171
lang: fr
author: haclong

media:
  path: /img/teaser/capture_2.png
  credit: "Sebastian Mantel - Unsplash"

tags:
  - "intégration continue"
  - "gocd"
  - "git"
  - "phpunit"
  - "tutorial"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Résumons nous : on a installé un premier pipeline et dans ce pipeline, un premier stage. Le stage initial, la plupart du temps, consistera à installer votre projet : récupérer les librairies, les installer. Une fois que le projet est installé, passons au stage suivant : les tests."
---

Résumons nous : on a installé un premier *pipeline* et dans ce *pipeline*, un premier *stage*. Le *stage* initial, la plupart du temps, consistera à installer votre projet : récupérer les librairies, les installer. Une fois que le projet est installé, passons au *stage* suivant : les tests.

## Le stage

Dans notre *pipeline*, il faut ajouter un second *stage*. Comme pour le *stage* précédent, nous n'utilisons pas de template (mais on pourrait, encore une fois, je préfère faire tout à la main pour bien comprendre avant d'automatiser).

- Configuration type : **Define Stages**

### Stage ProjectTesting

Voyons le paramétrage du *stage* qui teste le projet

#### MonPremierBuild/ProjectTesting

**Stage Settings**

- Stage Name : **ProjectTesting**
- Stage Type : **On success** (déclenchement automatisé du *stage* en opposition au déclenchement manuel). Si le *stage* est précédé d'un premier *stage* qui échoue, alors le *stage* qui suit ne va pas s'exécuter. Si on se situe dans le tout premier *stage*, le *stage* est automatiquement exécuté quand **GoCD** commence un *build*.
- Fetch Materials : **Y.** **GoCD** doit aller chercher les *materials* pour exécuter le *stage*.
- Never Cleanup Artifacts : **N**. Si le *stage* génère un *artifact*, cette checkbox indique à **GoCD** de ne jamais purger les *artifacts* stockés sur **Go Server**
- Clean Working Directory : **N**. Si vous supprimez le répertoire de travail, alors votre projet que vous avez installé (avec ces dépendances) dans le *stage* précédent sera effacé et vous n'aurez rien à tester. Laisser le tout premier *stage* nettoyer le répertoire de travail.

**Variables d'environnement personnalisées**

Aucune variable définie à ce jour.

**Permissions**

- choix par défaut : **Inherit from the pipeline group**.

Interessons nous plutôt aux *jobs* maintenant.

## Le job

Cette fois ci, j'ai planifié deux *jobs* :

- un premier *job* qui va exécuter les tests unitaires en vérifiant la couverture des tests, sans pousser le code vers le dépôt distant même si les tests sont réussis

- un second *job* qui va exécuter les tests unitaires et en cas de réussite, pousser le code validé vers le dépôt distant

Notez qu'on aurait pu s'aménager un *stage* pour gérer le déploiement, soit "après les tests". A la place, on a fait le déploiement (*pousser le code validé vers le dépôt distant*) dans ce *stage*. C'est un choix.

### Job 1 CheckCoverage

#### MonPremierBuild/ProjectTesting/CheckCoverage

**Job Settings**

- Job Name : **CheckCoverage**
- Resources : **''**
- Job Timeout : **Use default (Never)**
- Run Type : **Run one instance**. *Je ne sais pas encore jouer le code sur des instances différentes*.

**Artifacts**

Comme on va produire quelquechose à la sortie de notre *job* (les rapports de couvertures), cela signifie qu'on doit définir au moins un *artifact*.

- Source : **var/coverage** (`/var/lib/go-agent/pipelines/{pipelineName}/`)

- Destination : **report** (`/var/lib/go-server/artifact/pipelines/{pipelineName}/{compteur}/{stageName}/{compteur}/{jobName}/`)

- Type : **Build Artifact**

**Variables d'environnement personnalisées**

Aucune variable définie à ce jour.

**Onglet personnalisé**

Puisqu'on souhaite voir le résultat de notre *artifact* (il se trouve qu'ici, le rapport de couverture des tests est en HTML, ça tombe bien), on doit ajouter un onglet personnalisé.

- Tab Name : **Coverage**. C'est le nom de l'onglet qui va être généré automatiquement quand le *job* se sera exécuté.
- Path : **report/coverage/index.html**. C'est le chemin pour accéder au fichier `index.html` du rapport de couverture de tests. Pour celui-là, j'ai triché et j'ai regardé le chemin exact sur le répertoire `/var/lib/go-server/artifact/pipelines/{pipelineName}/{compteur}/{stageName}/{compteur}/{jobName}/`

Tout le paramétrage du *job* est là, penchons nous plus précisemment sur les *tâches* du *job*.

## La task

Concernant le *job* **CheckCoverage**, il n'y a qu'une seule *tâche* à préparer.

### Task 1.1

La première *tâche* consiste à exécuter les tests unitaires en générant le rapport de couverture.

S'il avait fallu le faire dans un terminal, à la main, en ligne de commande, on aurait exécuté cette commande : `phpunit --coverage-html var/coverage`

#### Ce qu'il va se passer

- **GoCD** est notifié lorsque le *stage* qui précède a été exécuté avec succès.
- **GoCD** va exécuter la *task* qu'on va lui dire d'exécuter (ici, `phpunit`)

#### Ce qu'il faut faire

Pour cela, éditer la *task* dans **GoCD**. C'est une *task* **"More..."** : à nous d'écrire ce que nous voulons que le server fasse.

- Command : **phpunit**
- Arguments : (attention, les retours à la ligne sont importants)

```sh
--coverage-html
var/coverage
```

- Working Directory : **''**
- Run If Conditions : **Passed** (s'exécute automatiquement et à la condition que le *job* précédent a réussi)

<cite>Attention, afin que cela marche, il faut penser à installer l'exécutable de **phpunit** dans un répertoire de binaires de votre poste **Ubuntu**.

Mettre `phpunit` dans `/usr/bin/`

Les permissions de `phpunit` : `root:root - 755`
</cite>

## Concernant le job CheckCoverage

Ce *job* est intéressant parce qu'il génère des fichiers et fait intervenir plusieurs nouveaux éléments : les *artifacts*, les onglets personnalisés...

Lorsqu'on lance notre *pipeline* :

- **GoCD** a cloné notre projet et on le retrouvera ici : `/var/lib/go-agent/pipelines/{pipelineName}/`
- Ensuite la tâche suivante va générer les fichiers html de couverture de tests.

```sh
phpunit --coverage-html var/coverage
```

- **phpunit** va créer le répertoire `var/coverage/` dans les fichiers de notre projet (cloné sur `/var/lib/go-agent/`)

Seulement, à partir du dashboard de **GoCD** (`http://localhost:8153/go`), vous n'accédez pas aux fichiers qui se trouvent sur `/var/lib/go-agent/`. Si vous avez des fichiers qui sont générés par un des *jobs* / une des *tâches*, il faut les déclarez dans les *artifacts* afin que **go-server** en ait connaissance.

Ainsi, notre paramétrage d'*artifact* dit que les fichiers que l'on trouvera à la source `var/coverage/` (`/var/lib/go-agent/pipelines/{pipelineName}/var/coverage/`), on souhaite les déplacer vers la destination `report/` (`/var/lib/go-server/artifact/pipelines/{pipelineName}/{compteur}/{stageName}/{compteur}/{jobName}/report/`)

En fait, l'intention était de copier le contenu de `var/coverage/` vers `report/` mais finalement, on s'aperçoit que **GoCD** a copié le contenu de `var/` vers `report/`. *Il faudra creuser un peu plus loin si on souhaite éclaircir ce point.*

Une fois qu'on a déclaré notre *artifact*, on peut y accéder depuis le dashboard de **GoCD** (`http://localhost:8153/go`) lorsqu'on consulte notre *build*.

Enfin, dans le cas particulier de la couverture des tests qui génère des fichiers HTML qu'on pourrait facilement consulter directement à l'écran sans avoir à les télécharger, il faut ajouter un *onglet personnalisé*.

Dans ces cas là, on donne un nom à notre nouvel onglet et on lui indique le fichier que l'onglet doit afficher. Le fichier est nécessairement dans le répertoire : `/var/lib/go-server/artifact/pipelines/{pipelineName}/{compteur}/{stageName}/{compteur}/{jobName}/`

Et voila.

Il ne restera plus qu'à refaire les tests (sans couverture) et faire les livrables nécessaires.
