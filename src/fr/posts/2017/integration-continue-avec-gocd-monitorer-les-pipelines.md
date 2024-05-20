---
title: "Intégration Continue avec GoCD - Monitorer les pipelines"
permalink: "fr/posts/integration-continue-avec-gocd-monitorer-les-pipelines.html"
date: "2017-02-27T09:18"
slug: integration-continue-avec-gocd-monitorer-les-pipelines
layout: post
drupal_uuid: a7d0c526-9360-4829-bf6f-9320e3176dac
drupal_nid: 173
lang: fr
author: haclong

book:
  book: integration-continue-utiliser-go-cd
  rank: 6
  top:
    url: /fr/books/integration-continue-utiliser-go-cd.html
    title: Intégration Continue - Utiliser Go CD
  previous: 
    url: /fr/posts/integration-continue-tester-le-projet-22.html
    title: Intégration continue - Tester le projet 2/2

media:
  path: /img/teaser/capture_2.png
  credit: "Sebastian Mantel - Unsplash"

tags:
  - "intégration continue"
  - "gocd"

sites:
  - "Développement"

summary: "Une fois que les pipelines ont été convenablement paramétrés, il suffit de venir consulter l'activité du serveur en utilisant la console d'administration du serveur."
---

Une fois que les pipelines ont été convenablement paramétrés, il suffit de venir consulter l'activité du serveur en utilisant la console d'administration du serveur.

La console se situe (en principe) à cette adresse : `http://localhost:8153/go`

Si nécessaire, il faut définir un hostname à votre machine parce que **Go Server** peut rechigner à utiliser `localhost`. Dans ce cas là, vous trouverez la console à cette adresse : `http://{hostname}:8153/go`

Sur Ubuntu, pour donner un hostname à votre poste, il faut éditer le fichier `/etc/hosts`.

Ajouter :

```sh
// /etc/hosts

127.0.0.1        {hostname}
```

La plupart du temps, vous serez sur cette page : `http://localhost:8153/go/pipelines`.

Sur cette page, vous pourrez voir tous vos *pipelines* par groupe. Sur la droite, vous avez un bouton "**Personalize**" qui vous permet de masquer des *pipelines* si vous ne souhaitez plus les voir apparaître.

Chaque *pipeline* se présente comme une carte avec

- le **nom** du *pipeline*,
- un lien avec un **accès direct au paramétrage** de votre *pipeline* (équivalent à **Admin > Pipelines > {nom de votre pipeline}**)
- un **compteur** de *pipeline* (qui pourra être utilisé par exemple dans le nom des *artifacts* avec la variable `$GO_PIPELINE_COUNTER`)
- un lien **Compare** qui compare cette version du *build* avec la version antérieure
- un lien **Changes** qui donne le *changelog* entre la version actuelle du *build* et la version antérieure
- des **barres colorées** qui correspondent chacune à un *stage*.
- un bouton pour exécuter le *pipeline* à la main
- un bouton pour exécuter le *pipeline* avec conditions
- un bouton pour mettre le *pipeline* en pause. Lorsque vous mettez le *pipeline* en pause, si vous modifiez votre code, **GoCD** n'exécutera pas le *pipeline*. Il ne se passera rien.

**Cliquer sur le nom du pipeline** nous conduit sur une page où on peut voir l'historique des *builds* qu'il y a eu sur notre *pipeline*. A partir de l'historique, pour chaque *stage*, vous pouvez soit voir le détail d'exécution du *stage*, soit relancer le *stage* (relancer son exécution).

**Cliquer sur le compteur de build** nous conduit sur un schéma où on peut voir l'articulation de notre *pipeline*, avec ses dépendances.

**Cliquer sur un stage** (vert quand le *stage* a réussi, rouge quand le *stage* a échoué) permet d'aller voir le détail d'exécution du *stage*.

Par *stage*, on va trouver

- la **liste des jobs** (en cours (*In Progress*), échoués (*Failed*) ou réussis (*Passed*)).
- le **statut des dix dernières fois** que le *stage* a été exécuté
- les **dépendances** du *pipeline* (jai pas bien compris cette partie)
- les **infos sur le material** que **GoCD** a utilisé
- la **liste des jobs** du *stage*
- les **tests** (?)
- le fichier xml de **configuration du stage**

Si vous pouvez relancer chaque *stage* indépendamment les uns des autres, vous devez en revanche relancer tous les *jobs* d'un même *stage* dans leur intégralité.

Lorsque vous allez sur la page d'un *job* (en cliquant sur son nom), vous accéder à d'autres informations dédiées au *job* :

- la **console**, avec l'exécution de **GoCD** comme si vous y étiez. J'ai pu choper quelques indices dont des messages d'erreur qui m'ont aidé à configurer mon *pipeline*.
- un **rapport de tests** (inexistant, je pense qu'il faut définir un *artifact* de type *Test build*)
- si le job a échoué, vous aurez un **rapport d'erreur**
- enfin, l'onglet **Artifacts** dans lequel vous trouverez tous vos "*build artifact*"
- **éventuellement les onglets personnalisés** que nous avons fait rajouter.

Voilà

Je vous laisse explorer votre serveur **Go CD**.
