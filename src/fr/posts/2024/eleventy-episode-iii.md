---
title: Eleventy - Episode III
permalink: fr/posts/eleventy-episode-iii.html
date: 2024-08-31T12:44:00
slug: eleventy-episode-iii
layout: post
lang: fr
author: haclong
tags:
  - jamstack
  - eleventy
  - blog
sites:
  - Développement
  - Haclong projects
summary: "Suite au changement de mon blog sur un générateur de site statique, je vous ai partagé - de manière un peu espacé - mes progrès en la matière. J'ai franchi une nouvelle étape : faciliter la publication des pages html pour chaque nouveau fichier markdown. Je tenais à partager ces avancées avec vous."
media:
  path: /img/teaser/free-nomad-NrE-c_ba_ew-unsplash_cropped.png
  credit: free nomad
  url: https://unsplash.com/@passimage
  name: Henningsvær
---
## Précédemment, dans Petits Pas dans la Neige
### Objectifs
- alléger le blog : ok
- supprimer la contrainte de la base de données : ok
- faciliter la rédaction des articles en utilisant plusieurs éditeurs : ok

### Progression
- extraire les données de <a href="https://www.drupal.org" target="_blank">Drupal</a> et les migrer sur <a href="https://www.11ty.dev/" target="_blank">Eleventy</a>, : ok
- recentraliser les fichiers sources markdown et les fichiers html générés sur un même dépôt github : ok
- confirmer que les commentaires avec <a href="https://github.com/utterance" target="_blank">utterance</a> fonctionnent : ko
- fluidifier la publication des articles du blog : ko
	- automatiser la génération des fichiers statiques : ko
	- automatiser le déploiement des fichiers statiques : ko
- simplifier la rédaction des articles : ko
## Publier un article / le site avec Eleventy
#### Virer la concurrence
Initialement, pour ne pas multiplier les éditeurs avec des capabilités markdown sur mon poste, j'ai commencé à rédiger *quelques* articles avec <a href="https://code.visualstudio.com/" target="_blank">Visual Code</a>. J'étais contente. Ca fait le job. 
Visual Code me permet simultanément de
- lancer le container Docker (qui ne tourne pas en permanence) pour générer la page html correspondante.
- commiter les fichiers markdown et html sur mon dépôt github

Très vite, j'ai vu la faille de ce raisonnement : Si je travaille sur un autre projet sur Visual Code, je ne peux pas écrire de nouvel article. Pour écrire un nouvel article, il faut fermer le workspace en cours, ouvrir mon workspace Eleventy pour rédiger mon article, puis revenir sur le projet en cours et rouvrir les fichiers... Comme tout le monde le sait, c'est un switch qui est _TRES COUTEUX_. Résultat, j'ai beau avoir alléger mon blog, je ne l'alimente pas.

Finalement, pour faire bouger les choses, je dois installer un second éditeur : <a href="https://obsidian.md/" target="_blank">Obsidian</a>. Je peux maintenant avoir simultanément un article en cours de rédaction et des projets en cours de progression.
#### Ecarter Docker
Maintenant que j'écris mes articles sur Obsidian, je ne peux plus profiter du terminal de Visual Code pour lancer Docker. Je suis obligée d'ouvrir un terminal, me positionner dans le bon répertoire et lancer le container.

Faisable mais fastidieux. L'effort me coûte un peu et je n'ai toujours pas écrit de nouveaux articles de manière régulière alors que j'ai tellement de choses à transmettre.

Je me dis que plutôt que de lancer le container manuellement _a chaque fois_, j'essaierais bien d'automatiser le tout. Et parce que je ne suis pas tout à fait douée en scripts bash, je me tourne vers un pipeline sur mon serveur CI/CD <a href="https://www.gocd.org/" target="_blank">GoCD</a>. _(oui, je sais, avec le recul, pourquoi chercher compliqué quand il y avait simple ? bah voilà, c'est comme ça)_. De toutes façons, pour que mon application Utterance fonctionne, je suis OBLIGEE de commiter les fichiers sur le dépôt github.

#### Commiter les fichiers sur le dépôt
Je ne peux plus profiter du plugin git de Visual Code. 

J'utilise un client git pour gérer les commit sur le dépôt local et pour pousser sur le dépôt distant. Ca me coûte un peu parce que
- il faut se réadapter à l'interface graphique mais un client git, c'est un client git. On y arrive. _(oui, je sais, la ligne de commande, ça marche aussi mais c'est comme ça)_.
- ouvrir le client git à chaque nouvel article pour effectuer le commit. _(ça, j'ai prévu d'améliorer au prochain épisode)_.
## Paramétrer le pipeline
Passons à ce qui nous intéresse principalement. Le paramétrage du pipeline GoCD.

Le pipeline doit
1. cloner le projet et les pages markdown
2. installer NodeJS et le package <a href="https://www.11ty.dev/" target="_blank">Eleventy</a>,
3. générer les pages statiques
4. pousser les fichiers vers le repo distant
5. déployer les fichiers statiques sur le serveur mutualisé.
#### Cloner le projet (mon blog)
Jusque là, pas de problème. Il suffit de définir le _material_ et de paramétrer le pipeline pour qu'il se lance automatiquement dès que le _material_ est mis à jour.

      <materials>
        <git url="path/to/petitspasdanslaneige.git" dest="nom_d_un_repertoire_ou_cloner_le_blog" materialName="nom_du_material" />
       </materials>

Si ``materialName="nom_du_material"`` est un paramétrage familier, il faut par contre remarquer cette option ``dest="nom_d_un_repertoire_ou_cloner_le_blog"`` puisque dans ce pipeline, le projet ne peut pas être déployé à la racine du pipeline (on découvrira ensemble pourquoi).

#### Installer NodeJS
Le premier stage du pipeline a pour objectif 
- de nettoyer le répertoire de travail ``cleanWorkingDir="true"``
- de récupérer le material
- d'installer NodeJS dans le répertoire ``"nom_d_un_repertoire_ou_cloner_le_blog"``
- d'installer Eleventy dans le répertoire ``"nom_d_un_repertoire_ou_cloner_le_blog"``

      <stage name="install.nodeJS" cleanWorkingDir="true">
        <jobs>
          <job name="installNodeJsAndEleventy">
            <tasks>
              <exec command="sh" workingdir="nom_d_un_repertoire_ou_cloner_le_blog">
                <arg>-c</arg>
                <arg>npm install</arg>
                <arg>npx @11ty/eleventy</arg>
                <runif status="passed" />
              </exec>
            </tasks>
          </job>
        </jobs>
      </stage>

Ce stage m'a donné le plus de difficulté. 

En effet, la commande ``npm install`` qui est passée dans le pipeline fait intervenir le gestionnaire de paquet [Snap](https://snapcraft.io/docs/home-outside-home). C'est le user _go_ qui fait les actions du pipeline. Et là, Snap va nous péter une erreur ("_sorry, home directories ouside of /home needs configuration_") parce que Snap a une limitation : il est obligatoire que le HOME d'un user (qui utilise Snap) soit /home/$user. Or, à l'installation du serveur GoCD, le HOME du user _go_ est ``/var/go``.

En gros
**HOME exigé** pour le user _go_ = ``/home/go``
**HOME réel** pour le user _go_ = ``/var/go``

Tant que le **HOME exigé** et le **HOME réel** ne sont pas identiques, alors Snap pète une erreur et on ne peut pas installer NodeJS.

Pour satisfaire Snap _(et avancer sur le pipeline)_, il faut lier le **HOME exigé** et le **HOME réel**. Evidemment, trop simple, le lien symbolique ne va pas marcher (``ln -s``). Il faut faire un ``bind mount`` pour que ça marche et en plus, il faut que le ``bind mount`` soit permanent pour éviter à avoir à faire le ``bind mount`` chaque fois que le pipeline doit tourner...

1. pour commencer, on va créer le **HOME exigé** _parce qu'il faut bien qu'il existe_
	   ``sudo mkdir -p /home/go``
2. ouvrir le fichier ``/etc/fstab`` pour faire le ``bind mount`` permanent
	   ``sudo cat /etc/fstab``
3. ajouter la ligne suivante
	   ``/var/go /home/go none bind 0 0``

Pour vérifier que la modification du fichier ``/etc/fstab`` ne déclenche pas d'erreur, il faut utiliser cette commande
	 ``sudo mount -a``

Une fois le fichier ``/etc/fstab`` est modifié sans problème, il faut redémarrer l'ordinateur. 

Le stage du pipeline doit s'exécuter sans problème et dans la foulée, le package Eleventy est également installé.

> alors je n'arrive pas à me souvenir si j'ai du installer NodeJS sur mon poste AVANT de créer le stage. Si le paramétrage du pipeline ne fonctionne pas, en fonction du message d'erreur, peut être qu'il faut installer NodeJS sur la machine.

#### Générer les pages statiques
Oui, installer NodeJS et le package Eleventy ne suffit pas pour générer les nouvelles pages html, contrairement à ce que je pensais.

Ce nouveau stage doit
- ne pas cloner le projet une deuxième fois ``fetchMaterials="false"``
- s'exécuter si le stage précédent est success ``<approval type="success" allowOnlyOnSuccess="true" />``
- s'exécuter dans le répertoire ``"nom_d_un_repertoire_ou_cloner_le_blog"``

      <stage name="build.static.pages" fetchMaterials="false">
        <approval type="success" allowOnlyOnSuccess="true" />
        <jobs>
          <job name="build.blog">
            <tasks>
              <exec command="sh" workingdir="nom_d_un_repertoire_ou_cloner_le_blog">
                <arg>-c</arg>
                <arg>npx @11ty/eleventy</arg>
                <runif status="passed" />
              </exec>
            </tasks>
          </job>
        </jobs>
      </stage>

#### Pousser les fichiers vers le repo distant
Depuis un pipeline GoCD, il faut dans un premier temps ajouter le repo distant pour pouvoir pousser les fichiers sur le repo distant. Ce sera l'objectif d'un nouveau stage.

Une fois que le repo distant est ajouté avec succès, il restera à paramétrer un stage dédié à pousser les fichiers vers le repo.

**Un premier stage pour ajouter le repo distant**

Ce stage  
- ne doit pas cloner le projet pour une deuxième fois ``fetchMaterials="false"``
- s'exécuter si le stage précédent est success ``<approval type="success" allowOnlyOnSuccess="true" />``
- s'exécuter dans le répertoire ``"nom_d_un_repertoire_ou_cloner_le_blog"``

      <stage name="add.remote" fetchMaterials="false">
        <approval type="success" allowOnlyOnSuccess="true" />
        <jobs>
          <job name="add_remote">
            <tasks>
              <exec command="sh" workingdir="nom_d_un_repertoire_ou_cloner_le_blog">
                <arg>-c</arg>
                <arg>git remote add repo_distant /url/to/remote/repo</arg>
                <runif status="passed" />
              </exec>
            </tasks>
          </job>
        </jobs>
      </stage>

La commande ``git remote add`` est bien connue, je ne la détaille pas ici mais j'en parlerais prochainement pour donner les détails de connexion sur les deux repo que j'utilise : bitbucket et github.

**Un stage pour pousser les fichiers à distance**

Pour ce stage, idem, aucune difficulté. 
- ne pas cloner le projet
- s'exécuter si le stage précédent a réussi
- s'exécuter toujours dans le répertoire ``"nom_d_un_repertoire_ou_cloner_le_blog"``

      <stage name="push.master" fetchMaterials="false">
        <approval type="success" allowOnlyOnSuccess="true" />
        <jobs>
          <job name="push.to.remote">
            <tasks>
              <exec command="sh" workingdir="nom_d_un_repertoire_ou_cloner_le_blog">
                <arg>-c</arg>
                <arg>git push repo_distant master</arg>
                <runif status="passed" />
              </exec>
            </tasks>
          </job>
        </jobs>
      </stage>

Ici aussi, la commande ``git push $remote $branch`` est connue. Je ne m'étends pas dessus. 

> Je réalise que je ne pousse que les fichiers markdown qui ont été commité sur mon projet sur le repo distant et non pas les fichiers statiques qui ont été générés pendant le pipeline... j'ai encore du boulot à faire sur ce pipeline....

#### Déployer les fichiers statiques sur le serveur
Enfin, il faut créer le dernier stage qui va transférer les fichiers statiques générés par le pipeline en utilisant la connexion SFTP sur le serveur mutualisé que j'utilise.

Pour y arriver, _et c'est LA que je vous explique pourquoi on a cloné notre projet dans un répertoire dédié_, il y a une petite astuce.

**Préparer un script pour transférer les fichiers en SFTP**

Hors de mon projet Eleventy, j'ai créé un fichier ``transfert_files.txt``

	//transfert_files.txt
	 mput -r htdocs/*

Ce fichier est dans un repo git local... je n'ai pas prévu de créer un dépôt sur un des serveurs git distant.

Ce repo git est ajouté dans les ``materials`` du pipeline

      <materials>
        <git url="path/to/filestransfertscript.git" dest="nom_d_un_repertoire_pour_le_script" materialName="nom_du_material" />
       </materials>

**Enfin, paramétrer le stage**

Cette fois encore, le stage 
- ne doit pas cloner le projet pour une deuxième fois ``fetchMaterials="false"``
- s'exécuter si le stage précédent est success ``<approval type="success" allowOnlyOnSuccess="true" />``
- s'exécuter dans le répertoire ``"nom_d_un_repertoire_ou_cloner_le_blog"``

      <stage name="transfer.files" fetchMaterials="false">
        <approval type="success" allowOnlyOnSuccess="true" />
        <jobs>
          <job name="transfert.files">
            <tasks>
              <exec command="sh" workingdir="eleventy">
                <arg>-c</arg>
                <arg>sftp -b ../nom_d_un_repertoire_pour_le_script/transfert_files.txt user@sftp.host.com:/path/to/htdocs</arg>
                <arg />
                <arg />
                <runif status="passed" />
              </exec>
            </tasks>
          </job>
        </jobs>
      </stage>
## Pour finir
Parce qu'il faut bien finir

Ce post est assez long, ça fait longtemps :D
J'ai essayé de faire au plus clair mais 

1. il y a les détails concernant l'authentification que je n'ai pas abordé
	- authentification à distance sur github depuis GoCD
	- authentification à distance sur bitbucket depuis GoCD
	- authentification à distance sur le serveur mutualisé depuis GoCD.
2. seulement une fois que j'ai fini d'écrire ce post, je réalise que mon script pour transférer les fichiers n'avait pas nécessairement besoin d'être dans un repo séparé... on peut prétendre que je ne voulais pas avoir ce script trainé sur mon blog eleventy. 
3. mes fichiers statiques étant généré durant le pipeline, comme observé, ils ne sont pas poussés vers le repo distant (c'est le projet d'origine qui est poussé). De même, ils ne sont pas poussé sur mon projet sur localhost... il faut que je décide si c'est un problème... pour le moment, ça me va.

Et voila ! j'espère que ça vous plait ! 

#### Bilan
Sur la progression de la mise en place de mon blog, il m'aura coûté. Mais je me rapproche d'une solution satisfaisante

Les pros 
- j'ai un éditeur dédié pour écrire mes articles en markdown
- j'ai un pipeline qui automatise 
	- la génération des fichiers statiques, 
	- la synchronisation du projet sur le dépôt distant
	- le transfert des fichiers statiques générés sur le serveur mutualisé

Les cons
- chacun de mes articles étant illustré d'une illustration en bandeau, je dois choisir et dimensionner l'image manuellement
- je dois déposer l'image redimensionnée dans mon projet
- je dois ajouter le chemin de l'image dans mon article manuellement
- je dois ajouter les informations d'entête de l'article manuellement (Frontmatter)
- je dois utiliser un autre outil pour commiter les nouveaux fichiers (ou la ligne de commande)

Comme on peut le voir, il me reste encore deux trois petites choses à régler pour me rapprocher d'une solution optimale mais on avance !

A bientôt pour de prochains épisodes !!