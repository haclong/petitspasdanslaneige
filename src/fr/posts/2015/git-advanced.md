---
title: "Git advanced"
permalink: "fr/posts/git-advanced.html"
date: "2015-01-08T16:15"
slug: git-advanced
layout: post
drupal_uuid: 671f705a-9f6a-4ac3-981a-fb88fbe893d1
drupal_nid: 124
lang: fr
author: haclong

media:
  path: /img/teaser/Git-Logo-1788C.png

tags:
  - "git"
  - "scm"
  - "github"
  - "bitbucket"

sites:
  - "Développement"

summary: "Il y a bientôt 2 ans... oh la la que le temps passe, je découvrais git. J'ai depuis pris un peu de galons. Quoique...
J'ai toujours un vocabulaire tout aussi approximatif, mi anglais mi français dès qu'on approche d'un lexique spécialisé, et je tâtonne toujours dans les coins mais malgré tout, et heureusement, j'y vois plus clair. 
Parfois."
---

Il y a bientôt 2 ans... oh la la que le temps passe, je découvrais git. J'ai depuis pris un peu de galons. Quoique...

J'ai toujours un vocabulaire tout aussi approximatif, mi anglais mi français dès qu'on approche d'un lexique spécialisé, et je tâtonne toujours dans les coins mais malgré tout, et heureusement, j'y vois plus clair.

Parfois.

## Ce qui a changé

### Les outils

Sur **Windows**, il y a maintenant <a href="http://git-scm.com/download/win" target="_blank">Git Gui</a> qui est super facile à utiliser.

Sur **Ubuntu**, je n'ai rien trouvé d'aussi bien pour le moment... J'ai installé plusieurs applications mais je n'ai pas encore trouvé mon bonheur. Il reste bien sûr la ligne de commande, et les vrais de vrais ne jurent que par elle mais, j'aime les guirlandes et les coins chromés du coup, je préfèrerais quand même un truc graphique...

J'ai changé la version de mon IDE et le **plugin git** depuis a des fonctionnalités intéressantes. J'ai actuellement **NetBeans 8.0.x**.

### Les dépôts

Finalement, je ne travaille pas avec le dépôt disponible sur mon hébergement **Gandi**. Les contraintes du dépôt unique par virtual hosts peut être... je ne sais pas. D'un autre côté, le dépôt git sur Gandi est fonctionnel. il n'y a pas d'interface graphique, d'éditeurs etc... pour manipuler son dépôt. Il y a tout juste un explorateur de dépôt, pour voir ce qu'il y a dedans.

J'ai opté pour les deux serveurs <a href="https://github.com/" target="_blank">**github** </a>(bien sûr) et <a href="https://bitbucket.org/" target="_blank">**bitbucket**</a>.

Pour rappel, **github** est le serveur gratuit de **git**, le plus répandu et le plus célèbre. Il est public ce qui veut dire que tous vos dépôts sont visibles pour tout un chacun. Vous pouvez toutefois avoir des dépôts privés (avec un accès réservé donc) mais il faut alors souscrire un abonnement avec des frais.

De son côté, **bitbucket** est également gratuit pour un usage privé. Il devient payant lorsqu'on veut mettre en place des dépôts partagés par plus de 5 utilisateurs, on va dire des projets "professionnels" donc. (*je sais, c'est discutable*)

J'ai appris depuis que les solutions mutualisées de **1&amp;1** ont également des dépôts **git**. Je n'ai pas encore essayé chez eux.

Oh oui, j'ai appris que le terme exact français pour repository, c'est dépôt :p

### Commencer un projet avec un dépôt distant.

#### Dans le sens **dépôt local vers dépôt distant** :

- Sur votre répertoire du projet, initialiser le dépôt :

`git init`

- puis, ajout d'un dépôt distant :

`git remote add {remote_name} {path/to/remote}`

Typiquement, si vous travaillez sur le dépôt **Gandi**, je crois que c'est comme ça qu'il vaut mieux faire mais mes tests avec **Gandi** remontent à longtemps... il faudra vérifier.

Si vous souhaitez créer un dépôt **git** sur des sources existantes, c'est également comme ça qu'il faut s'y prendre. N'oubliez pas de faire `git add` pour ajouter vos fichiers au dépôt local et `git push` pour pousser les fichiers vers le dépôt distant.

Si vous travaillez avec **github** et **bitbucket**, il faut aller sur ladite plateforme, créer le dépôt (ne serait-ce que pour avoir l'url du dépôt) et faire `git remote` après sur votre dépôt local.

#### Dans le sens **dépôt distant vers dépôt local** :

- Initialiser votre dépôt distant.

Pour **github** et **bitbucket**, il suffit de cliquer sur le bouton "nouveau dépôt". L'url du dépôt va apparaître sur la page du dépôt (en principe, sur la droite sur les deux plateformes) avec une commande `git clone` à copier puis à coller.

- Sur votre répertoire du projet (machine locale), faire

`git clone {path/to/remote}`

Cette commande va faire

`git init`
`git remote add origin {path/to/remote}`
`git fetch`
`git merge`

Direct... tout en un coup. Vous n'aurez rien à faire.

Le **remote** va systématiquement s'appeler *origin*. C'est comme ça.

Sur un projet, vous pouvez ajoutez autant de **remote** que vous le souhaitez. Il suffit de faire un `git remote add {remote_name} {path/to/remote}` autant de fois que vous le voulez. Quand vous souhaitez pousser vos commits, il suffit de choisir sur lequel de vos dépôts distants vous souhaitez pousser. Vous pouvez même vous créer un second dépôt git sur votre machine locale sur laquelle pousser les sources, pour un backup par ex.

## Introduire les branches

Travailler avec **git** donne les avantages suivants :

- dépôt central partagé entre plusieurs pour les sources, comme ça, tout le monde est à niveau (mais pas de contrainte maitre/esclave sur un serveur technique central.
- backup du code en cas où

Mais cela a un intérêt supplémentaire qui donne toute sa puissance à **git** : le suivi des niveaux de sources différents sur un même projet. Fini le temps où on avait deux répertoire : PROD et DEV sur un seul projet et l'un était la copie de l'autre... Tout est au même endroit... oui oui, c'est bien ce que j'ai dit. (*oui, je sais, pour les pro du SCM, je ne vous apprends rien... en même temps, les pro ne lisent jusqu'ici que par politesse*).

Pour cela, il faut travailler avec les **branches**. Et c'est là que vous aurez accès à toute l'efficacité de **git**.

Pour comprendre les branches, il faut presque se dire que ce sont des versions. La version *dev*, la version *integration*, la version *long-term*, la version *main* etc... Chaque version sera un aspect différent du même projet, avancé à différents niveaux de développement. Chaque version est une branche.

Les interfaces graphiques vous créent une branche comme un rien, du coup, je perds un peu les commandes mais effectivement, la commande est simple aussi.

Sur un dépôt **git** (en principe, sur le local mais tous les dépôts étant équivalents, pas de serveur et pas de client, vous pouvez le faire à partir de n'importe quel dépôt), vous avez en principe une branche ouverte sur votre dépôt (le HEAD). Si vous commencez avec git, vous devriez être sur la branche *master*. La branche *master* n'est pas plus importante, plus principale ou plus complète que n'importe quelles autres (futures) branches de votre dépôt. C'est juste que `git init` crée la branche *master*par défaut. Il aurait pu l'appeler *first* ou *main* ou même *toto*, c'était la même chose. D'ailleurs, vous pouvez également changer son nom si cela vous chante... Il suffit de mettre votre propre lexique en place.

Dans le répertoire de travail, vous avez tous les fichiers de votre projet.

Ajoutez tous les fichiers à ajouter (`git add`).

Faites le point de sauvegarde (`git commit`).

A partir de là, quand tout est commité, vous pouvez créer votre branche. (Vous pouvez également le faire avant le commit mais tout ce qui n'a pas été commité pourrait bien être perdu si vous ne les commitez pas... à vous de voir).

`git branch dev`

On a créé une branche nommée *dev*qui est la copie de la branche *master* sur laquelle on est.

Mais vous êtes toujours sur votre branche *master*.

Si vous souhaitez voir le contenu d'une autre branche, il faut faire

`git checkout dev`

Votre répertoire de travail n'a pas été modifié parce que pour le moment, *dev* et *master* sont identiques. Si vous avez un graphique de votre dépôt git, vous verrez que *master* et *dev* portent le même numéro de commit.

Travaillez maintenant sur votre *dev* et commitez. Dans le graphique, *dev* a un numéro différent de *master*.

Si vous faites

`git checkout master`

les modifications faites sur *dev*auront disparu et vous retrouverez *master* tel que vous l'avez laissé.

Et de checkout en checkout, vous pourrez passer d'une branche à l'autre.

Bon, évidemment, éviter de sauter d'une branche à l'autre comme un cabri. Si vous êtes un dev, il y a de fortes chances que vous vous concentriez sur une branche *dev*, histoire de pas polluer la branche *master* avec vos expérimentations et votre code en devenir.

Si vous êtes un intégrateur, vous serez peut être sur une branche *integration* dédiée pour la mise en forme du site web.

Conservez une branche "propre de tous bugs"... genre la version prête à déployer...

### Organiser les branches

Fautes d'avoir les bons mots clés, je n'ai pas trouvé beaucoup d'informations sur comment travailler avec les branches. Toutefois, j'ai fini par trouver. Il existe une méthode, désormais célèbre semblerait-il, communément appelé **gitflow**, mise en place par <a href="http://nvie.com/posts/a-successful-git-branching-model/" target="_blank">**Vincent Driessen**</a>.

Le modèle a tellement convaincu qu'il existe un <a href="http://danielkummer.github.io/git-flow-cheatsheet/" target="_blank">package</a> pour appliquer le robuste workflow de Vincent. Evidemment, sa parole ne faisant pas évangile, vous n'êtes pas obligé d'appliquer le process à la lettre. Mais c'est intéressant de savoir et pour ma part, ça m'a fait découvrir d'autres possibilités dans ma petite vie de développeur.

### Gitflow

Voici le process de **gitflow** dans les grandes lignes.

Un projet a 2 branches principales : *master*, *develop* (appelez les comme vous voulez, je pense que je vais utiliser *master* et *dev* mais ce n'est que mon avis)

- *master* est le reflet de la prod (ou de la prochaine prod en tout cas)
- *dev* est la branche de dev, comme son nom l'indique.

Quand ce qui est en *dev* est stabilisé, on tague le lot de changements, on commite et on pousse en prod. Bon, c'est dit TREEEEES vite.

D'après le workflow de Vincent Driessen, chaque fois que quelque chose est poussé sur *master*, cela signifie que les sources peuvent être déployée en production AVEUGLEMENT... *je résume, mais c'est l'idée*.

A côté de ces 2 branches principales, **gitflow** manipule des branches 'mineures', qui devraient être détruites quand on n'en a plus l'usage. Ces branches mineures se classent en trois catégories :

- features
- releases
- hot fixes

#### Branches de type 'feature'

Les branches de type *features* sont des fonctionnalités à développer sur le long terme. Il vaut mieux créer une branche dédiée afin de pas pourrir la branche de dev principale. Notamment, s'il faut revenir en arrière, vous allez avoir, dans l'historique de votre dépôt / branche des commits qui viennent de tous les côtés de tout le monde, ce qui n'est pas très lisible et pratique pour le retour arrière.

Les branches *feature* sont des branches à partir de la branche *develop* et il existe une branche *feature* par fonctionnalités (pratiquement) ou, pour un dev, une expérimentation / une amélioration sur une feature existante.

Pour la nomenclature, Vincent Driessen donne des recommandations : les branches *feature* peuvent s'appeler n'importe comment, excepté les 'mots clés' suivants : *master*, *develop*, *release-** et *hotfix-**.

Quand la feature est développée et considérée stable, on fusionne le contenu de cette branche *feature* à la branche *develop*, on gère les problèmes de conflits et on détruit la branche *feature*.

Lorsqu'on fusionne (`merge`) la branche *feature* sur la branche *develop*, Vincent Driessen recommande d'utiliser l'option `--no-ff` qui permet de charger toute la branche *feature* en un seul commit historique. C'est plus pratique pour le retour arrière (si nécessaire) : au lieu de revenir 15 commits en arrière, on ne retourne que d'un seul commit, celui qui représente la fusion.

#### Branches de type 'release'

Les branches de type *releases* sont des branches de préprod. On crée une branche dédiée pour chaque nouvelle version (avec son lot de nouvelles fonctionnalités) pour bloquer la nouvelle version une fois pour toute et pour lui appliquer les dernières vérifications et idéalement, les scénarii de tests. C'est une branche sur laquelle il y a toujours des développements appliqués puisque, suivant ce qui résultera des tests, il y aura des ajustements à faire.

Les branches *release* sont des branches à partir de la branche *develop*. Il existe une branche *release* chaque fois qu'une prochaine version est prête. De préférence, il n'y a pas plusieurs branches *releases* en concurrence.

C'est sur la branche *release* qu'on fixe le numéro de version. Pour la nomenclature, la branche s'appelle *release-{numéro_de_version}*.

Quand la release est stable et valide, on fusionne son contenu sur la branche *master*, on gère les conflits possibles. Afin de reporter les petits ajustements finaux sur la branche *develop*, on n'oublie pas de fusionner le contenu de la branche *release* sur la branche *develop* également. On détruit la branche *release* une fois qu'elle a été fusionnée sur *master* et sur *develop*.

#### Branche de type 'hot fix'

Les branches de type *hot fixes* sont des branches pour patcher des bugs en prod non détecté lors des mises en prod précédentes. Comme pour *release*, et en fonction des délais estimés de résolution de certains bugs de production, il y a peu de raisons d'avoir plusieurs branches *hotfix* concurrentes.

Les branches *hotfix* sont des branches à partir de la branche *master*.

Lorsque le(s) bug(s) sont fixés, on donne un numéro de version mineure, on fusionne le contenu de la branche sur la branche *master*, on gère les conflits. Afin de reporter les correctifs sur la branche *develop*, on n'oublie pas de fusionner le contenu de la branche *hotfix* sur la branche *develop* également. En fonction de la présence ou non d'une branche *release*, il faut peut être également reporter les correctifs sur la branche *release* afin de ne pas relivrer le bug en prod. La branche *hotfix* une fois fusionnée dans les autres branches, est détruite.

Ce workflow me semble très intéressant. Certains n'adhèreront pas du tout. Pour des raisons d'absence d'équipe, je n'ai pas eu l'occasion de l'éprouver mais je compte bien me monter une version adaptée dès que possible. Je redoute fortement les problèmes de conflits et je pense qu'il va y avoir d'inévitables mélangeages de pinceaux avant qu'on s'en sorte.

### Branches et dépôts

Si vous avez créés plusieurs branches sur votre dépôt local, il est aisé de pousser ces branches sur les dépôts distants :

`git push {remote-name} {branch-name}`

on choisit le dépôt distant sur lequel on veut pousser et on choisit la branche qu'on veut pousser et voilaaaa !

Je suppose que pour `git fetch`, ça doit être le même principe. Je dois avouer que je laisse le plugin de Netbeans me guider ici.

## Supprimer des fichiers dans le dépôt

Une chose qu'aucun outil graphique ne m'a permis de faire : supprimer des fichiers dans le dépôt git.

J'ai commité par erreur des librairies sur mes différents dépôts local et distant mais c'étaient des fichiers que je ne veux pas conserver dans le dépôt. Toutefois, j'en ai besoin pour travailler, il faut donc que je conserve ces fichiers.

Une fois que les fichiers (qui doivent être ignorés) ont été commité une fois, les rajouter après coup dans `.gitignore` ne sert à rien. Il faut les supprimer du dépôt.

La solution brutale est

- de supprimer les fichiers du répertoire de travail,
- et de commiter dans le dépôt local
- puis de pousser le commit sur les dépôts distants
- avant de remettre les fichiers à leur place
- et de paramétrer gitignore comme il faut.

C'est une solution brutale et vous n'êtes pas certain qu'il n'existe pas déjà un dépôt quelque part avec vos fichiers dedans... résultat, il réapparaîtront tôt ou tard au moment d'une fusion.

La meilleure solution est de **supprimer les fichiers du dépôt** (aucune incidence sur le répertoire de travail, du coup, vos fichiers restent intouchés).

Mais voila.

Aucune interface graphique à ma disposition ne me permettait de supprimer des fichiers du dépôt. Il a fallu revenir aux basiques : la ligne de commande.

`git rm {liste des fichiers}`
`git commit`

et voilaaaa...

Voila mes derniers badges avec git :)

J'espère que mon post a pu vous être utile. Vous trouverez un lien vers un <a href="http://www.synbioz.com/blog/git-adopter-un-modele-de-versionnement-efficace" target="_blank">article de Nicolas Cavigneaux</a> qui explique en détail de process de Vincent Driessen pour ceux qui ne sont pas à l'aise avec la langue de Shakespeare.
