---
title: "Intégration continue - Les concepts de GoCD"
permalink: "fr/posts/integration-continue-les-concepts-de-gocd.html"
date: "2017-01-17T09:32"
slug: integration-continue-les-concepts-de-gocd
layout: post
drupal_uuid: a457074d-30f3-421e-a858-0e6d0c6b2a03
drupal_nid: 164
lang: fr
author: haclong

book:
  book: integration-continue-utiliser-go-cd
  rank: 1
  top:
    url: /fr/books/integration-continue-utiliser-go-cd.html
    title: Intégration Continue - Utiliser Go CD
  next:
    url: /fr/posts/integration-continue-installer-gocd.html
    title: Intégration Continue - Installer GoCD

media:
  path: /img/teaser/2048x1536-fit_illustration-laboratoire-antidopage.jpg

tags:
  - "gocd"
  - "intégration continue"

sites:
  - "Développement"
  - "Haclong projects"

summary: "Rappelons nous, pour utiliser efficacement un serveur d'intégration continue (d'autant plus vrai lorsqu'il s'agit d'un serveur intégralement configurable), il faut qu'on dise quoi faire à notre serveur. Et lorsqu'on utilise GoCD, il faut qu'on ait une vision des différents concepts de GoCD afin de pouvoir organiser au mieux nos instructions."
---

Rappelons nous, pour utiliser efficacement un serveur d'intégration continue (d'autant plus vrai lorsqu'il s'agit d'un serveur intégralement configurable), il faut qu'on dise quoi faire à notre serveur. Et lorsqu'on utilise **GoCD**, il faut qu'on ait une vision des différents concepts de** GoCD** afin de pouvoir organiser au mieux nos instructions.

Nous avons installé **GoCD** (un serveur et un agent), nous avons notre projet. Allons configurer le serveur d'intégration continue.

A notre serveur d'intégration continue (**GoCD**), on va donner des *intructions* pour qu'il sache quoi faire.

#### Task

Chaque *instruction* (qu'on peut assimiler grosso modo à une commande dans le terminal), est une *tâche* (*task*) dans **GoCD**.

#### Job

Les *tâches* sont groupées en *job*. Un *job* est donc composé d'une *séquence ordonnée de tâches* qui va être exécutée *dans l'ordre* qu'on aura choisi.

#### Stage

Les *jobs* sont organisés en *stage* et dans chaque *stage*, les *jobs* sont exécutés *en désordre*, voire même *en même temps*.

#### Pipeline

Enfin, les *stages* sont regroupés en *pipeline*, les *stages* sont exécutés *dans l'ordre choisi*.

Si au début, cela perturbe un peu, vous pouvez toujours essayer de ne pas multiplier les étapes : un *pipeline* avec un seul *stage* avec un seul *job* et, là, ça va être difficile d'y couper, mais plusieurs *tasks*... Petit à petit, au fur et à mesure que vous enrichisserez votre *pipeline*, vous déciderez alors s'il vous faut plusieurs *stages* / plusieurs *jobs*...

Vous trouverez de la <a href="https://docs.go.cd/current/introduction/concepts_in_go.html" target="_blank">documentation plus complète</a> sur le site de **GoCD**.

Maintenant que nous avons vu les concepts (rapidement) de **GoCD**, passons au vif du sujet.

## Mon premier pipeline

Aller sur votre serveur **GoCD** (<a href="#">http://localhost:8153/go</a>), menu **Admin > Pipelines.**

Les *pipelines* peuvent être groupés en ensemble administratif. A vous de vous organiser. Cela n'a rien à voir avec le "boulot" d'un serveur d'intégration continue.

Pour ma part, actuellement, j'ai défini un groupe de *pipeline* par projet. Mais je réalise que je vais TRES PROBABLEMENT n'avoir qu'un seul *pipeline* par projet (avant d'atteindre un niveau astronomique en paramétrage de serveur d'intégration continue). Je me dis qu'il pourrait être intéressant de réorganiser mes *pipelines* par type d'intégration : par ex, un groupe pour intégrer en continu le dépôt local vers le server master principal et un autre groupe pour intégrer en continu les sources validées vers le serveur de prod. C'est une idée à creuser mais sans matière pour le moment, je n'ai rien changé à mon paramétrage.

Bref, cliquer sur `[Add New Pipeline Group]` pour créer un groupe de *pipelines* puis sur `[Create a new pipeline within this group]` pour créer votre premier *pipeline*.

**ATTENTION** : il y a un truc tordu (d'après moi) sur **GoCD**. Vous ne pouvez pas supprimer un *pipeline* et donner le nom du *pipeline* supprimé à un nouveau *pipeline*. **GoCD** ne supprime jamais complètement les *pipelines*. Du coup, un nouveau *pipeline* avec le même nom qu'un ancien *pipeline* va hériter de l'historique de l'ancien *pipeline*. Du coup, on recommande même de ne jamais supprimer les *pipelines* pour ne pas risque de nommer un nouveau *pipeline* avec le nom d'un ancien par erreur... Ce qui se révèle très gênant lorsqu'on essaie de comprendre ce qu'il se passe et qu'on passe son temps à créer des *pipelines* pour expérimenter -_-.

Bref, bon, on s'en sort quand même.

Voyons la création du *pipeline*

#### Step 1 : Basic Settings

Donner un nom (unique) à votre *pipeline* (*Pipeline Name*).
Assurez vous que le nom du groupe (*Pipeline Group Name*) est correct mais en principe, ce champ est automatiquement rempli.

#### Step 2 : Materials

Les "*materials*" chez **GoCD**, c'est la matière à partir de laquelle **Go** va construire le *build*. DE BASE, ce sont vos sources, votre projet. Après, il va être possible de rajouter d'autres *materials*. Par ex, on peut imaginer des dépendances qui ne pourront pas être installées avec **Composer** et qu'il faudra que **Go** installe également pour exécuter le projet.

Pour nous, ce qui nous intéresse, ce sont nos fichiers que nous avons commité sur notre *dépôt git local*.

- *Material Type* = <span style="background-color:#ffff00;">Git</span>
- *URL* = le chemin vers vos sources. **Git** acceptant les chemins du système de fichier, nous pouvons indiquer où se situent nos sources sur notre poste local (Ubuntu).

Mettons que votre projet se trouve dans ce répertoire : `/home/user/projets/monprojet/dev/src/`

Le `dépôt git` serait en principe dans ce répertoire : `/home/user/projets/monprojet/dev/src/.git`

Pour **GoCD**, voici l'URL attendue pour votre `dépôt git` : `/home/user/projets/monprojet/dev/src/`

Vous pouvez vous aider du bouton `[Check Connection]` pour vérifier que **GoCD** va pouvoir accéder au dépôt que vous avez indiqué.

En terme de droits, le propriétaire a les droits d'exécution (*x*), d'écriture (*w*) et de lecture (*r*) sur les fichiers du projet. Quant aux autres, ils n'ont que les droits d'exécution (*x*) et de lecture (*r*) sur les répertoires et les droits de lecture (*r*) sur les fichiers. Cela semble suffire pour **GoCD**.

- *Branch* = la branche qui doit être contrôlée par **GoCD**. Par défaut, c'est *master*. Si vous comptez créer une branche par feature, il faut savoir que pour chaque nouvelle branche, vous allez avoir besoin de créer un *pipeline* dédié (tiens tiens tiens... voila que les *pipelines* se regroupent par projet maintenant... :) )
- *Poll for new changes* = cocher la case. Chaque fois que vous commiterez sur la branche à surveiller, **GoCD** lancera le *build* automatiquement. Si vous ne souhaitez pas que **GoCD** s'exécute automatiquement, il faudra dire à **GoCD** quand il doit s'exécuter. Il vous restera deux choix :
- soit *manuellement*: chaque fois que vous commiterez votre code, il faudra venir sur **GoCD** et lancer le *build* en cliquant sur un bouton.
- soit *programmatiquement*: **GoCD** exécutera un *build* régulièrement à l'heure dite, que le source ait changé ou pas.. <span style="color:#800080;">*heyyy... je viens de penser que c'est une idée pour un autre groupe de pipeline : un groupe dédié aux tests réguliers, qui tourneraient en permanence afin de s'assurer qu'un projet qui est fini depuis longtemps n'a pas d'erreur indétectée peut être parce que la version de PHP a changée...*</span>

#### Step 3 : Stage / Job

- *Configuration Type* : <span style="background-color:#ffff00;">Define Stages</span>. Je pense que lorsqu'on sera rodé, on pourra utiliser les templates, ce qui nous permettra de gagner du temps. Pour le moment, j'ai besoin de comprendre ce qu'il se passe et je ne peux pas me permettre d'introduire de nouveaux niveaux de complexité.
- Nommer le stage (*Stage Name*)
- *Trigger Type* : <span style="background-color:#ffff00;">On Success</span>. A moins de vouloir gérer nos *pipelines* / nos *stages* manuellement, on choisira toujours "On Success".
- Nommer le job (*Job Name*). Par défaut, lorsqu'on crée son premier *pipeline*, **GoCD** va vous aider à créer un seul *stage* et un seul *job*. Mais on peut éditer nos *pipelines* et ajouter de nouveaux *stages* et de nouveaux *jobs*.
- *Task Type*: Je préfère choisir l'option <span style="background-color:#ffff00;">"More..."</span> qui permet d'indiquer à **GoCD** quelle ligne de commande doit être exécutée.

Cliquez sur `[Finish]`. Vous avez créé votre premier *pipeline* !! <a href="https://fr.wiktionary.org/wiki/%E3%81%8A%E3%82%81%E3%81%A7%E3%81%A8%E3%81%86" target="_blank">Omedeto</a> !!

Dans le prochain article, nous réviserons notre *pipeline* pour lui faire faire ce qu'on veut.
