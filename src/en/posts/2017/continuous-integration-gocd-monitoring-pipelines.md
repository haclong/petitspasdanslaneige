---
title: "Continuous Integration with GoCD - Monitoring pipelines"
permalink: "en/posts/continuous-integration-gocd-monitoring-pipelines.html"
date: "2017-02-27T18:59"
slug: continuous-integration-gocd-monitoring-pipelines
layout: post
drupal_uuid: a7d0c526-9360-4829-bf6f-9320e3176dac
drupal_nid: 173
lang: en
author: haclong

media:
  path: /img/teaser/capture_2.png
  credit: "Sebastian Mantel - Unsplash"

tags:
  - "intégration continue"
  - "gocd"

sites:
  - "Développement"

summary: "Once pipelines are successfully set, you can go to the server dashboard and monitor the server activity."
---

Once pipelines are successfully set, you can go to the server dashboard and monitor the server activity.

You should be able to find the dashboard here : `http://localhost:8153/go`

If necessary, you will need to set a hostname because **Go Server** won't open when you use `localhost`. In that case, you will get the dashboard here : `http://{hostname}:8153/go`

Using Ubuntu, you need to edit `/etc/hosts` to set a hostname.

Edit and add :

```sh
// /etc/hosts

127.0.0.1        {hostname}
```

Most of the time, you will use that page : `http://localhost:8153/go/pipelines`.

On that page, you will be able to see all your pipelines by group. On the right side of the screen, you'd have a "**Personalize**" button who gonna allow you to hide the pipelines you don't want to see any longer.

Each pipeline looks like a cardboard with

- the **pipeline name**,
- a **direct access to the pipeline settings** (it's like going to **Admin > Pipelines > {pipeline name}**)
- a pipeline **counter** (can be used when naming artifacts by using the `**$GO_PIPELINE_COUNTER**` system variable)
- a **Compare** link to compare the current build version with the previous one
- a **Changes** link to access the current build changelog
- **colored bars** indicating each a different **stage**.
- a button to run pipeline
- a button to run the pipeline under conditions
- a button to pause the pipeline. When you put the pipeline on hold, the pipeline won't run automatically until you stop the pause.

**Clic on the pipeline name** links to the builds history. Then you can click on each stages in history and you can either check the detail of the stage run or rerun the stage.

**Clic on the build counter** leads us to a graph with all steps of our pipeline, including the dependencies.

**Clic on a stage** (green when successful and red when failed) allows us to check the detail of the stage run.

For each stage, we will be able to

- find the **list of jobs** (In Progress, Failed or Passed).
- find the **status of the ten last run.**
- find the pipeline **dependencies** (i didn't get it right though)
- find the **datas on the material** **GoCD** used for the build
- find the **tests** (status ? artefacts ?)
- find the **xml conf file of the stage**

If you wish to rerun each stage independantly from the others, you will have to rerun all jobs within the same stage. Impossible to run a part of jobs from the same stage.

For each job (click on its name), you will be able to access datas from the job :

- the **console**, with **GoCD** output. Don't be afraid to check on the console for there might be some very useful hints on errors and blocking issues when you are setting your pipeline up.
- a **tests report** (i have any but i think i need to set a Test build type artefact)
- an **error report** when the job has failed
- the **Artifacts** tab where you can find your "build artifacts"
- **eventually custom tabs** we added.

Voilà

Please, feel free to explore your **Go CD** server.

Lorsque vous allez sur la page d'un job (en cliquant sur son nom), vous accéder à d'autres informations dédiées au job :

- la **console**, avec l'exécution de **GoCD** comme si vous y étiez. J'ai pu choper quelques indices dont des messages d'erreur qui m'ont aidé à configurer mon pipeline.
- un **rapport de tests** (inexistant, je pense qu'il faut définir un artifact de type Test build)
- si le job a échoué, vous aurez un **rapport d'erreur**
- enfin, l'onglet **Artifacts** dans lequel vous trouverez tous vos "build artifact"
- **éventuellement les onglets personnalisés** que nous avons fait rajouter.

Voilà

Je vous laisse explorer votre serveur **Go CD**.
